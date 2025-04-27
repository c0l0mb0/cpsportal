import {config, httpRequest, downloadFile, addCSRF} from "./dao";
import Ribbon from "./ribbon";

export default class Exam {
    constructor(idPageContent) {
        this.idPageContent = idPageContent;
        this.initProperties();
        this.assignHtml();
        this.createExamTypeAndModeForm();
    }

    initProperties() {
        // DOM elements
        this.idPageContent;
        this.ribbon;

        // Exam state
        this.examType = '';
        this.examMode = '';
        this.startTime = '';
        this.currentQuestionInArray = 0;
        this.rightAnswerNumber = 0;

        // Exam configuration
        this.examConfig = {
            electroBez: {
                totalQuestions: 20,
                allowedMistakes: 2
            },
            sps: {
                totalQuestions: 2,
                allowedMistakes: 2
            }
        };

        // Data structures
        this.genericQuestionsStructure = [];
        this.electroBezExamQuestionsStructure = {
            questons: [],
            themes: [],
        };
        this.spsExamQuestionsStructure = [];

        // Worker data
        this.worker = {
            whatPassing: '',
            surname: '',
            name: '',
            patronymic: '',
            tabNumb: '',
            passExam: false,
            answers: [],
            questions: [],
        };
    }

    // ======================
    // Initial Setup Methods
    // ======================

    createExamTypeAndModeForm() {
        this.idPageContent.innerHTML = this.examTypeAndModeHtml;
        document.querySelector('.btn-chose-exam_type_and_mode').onclick = () => this.handleExamTypeAndModeSelection();
    }

    handleExamTypeAndModeSelection() {
        this.examMode = document.querySelector('#test_options_mode').value;
        this.examType = document.querySelector('#test_options_type').value;

        if (this.examType === 'electroBez') {
            this.setupElectroBezExam();
        } else if (this.examType === 'ops') {
            this.setupSpsExam();
        }
    }

    setupElectroBezExam() {
        this.worker.whatPassing = 'electroBez';
        this.setExamParameters('electroBez');

        httpRequest(config.api.getElectroBezTable, 'GET')
            .then(this.createElectroBezQuestionsStructure.bind(this))
            .then(this.createElectroBezForm.bind(this))
            .catch(console.error);
    }

    setupSpsExam() {
        this.worker.whatPassing = 'ops';
        this.setExamParameters('sps');

        httpRequest(config.api.getSpsExamTable, 'GET')
            .then(this.createSpsQuestionsStructure.bind(this))
            .then(this.createExamSPSForm.bind(this))
            .catch(console.error);
    }

    setExamParameters(examType) {
        this.totalQuestions = this.examConfig[examType].totalQuestions;
        this.allowedMistakes = this.examConfig[examType].allowedMistakes;
    }

    // ======================
    // Form Creation Methods
    // ======================

    createExamSPSForm() {
        if (this.examMode === 'exam') {
            this.idPageContent.innerHTML = this.optionsSpsExamHtml;
            document.querySelector('.btn-start-sps-test').onclick = () => {
                if (this.setWorkerFIO()) {
                    this.createExamQuestionAnswersForm();
                }
            };
            return;
        }
        this.createExamQuestionAnswersForm();
    }

    createElectroBezForm() {
        this.idPageContent.innerHTML = this.optionsElectroBezHtml;

        // Small delay to ensure DOM is ready
        setTimeout(() => {
            this.populateThemesDropdown();

            if (this.examMode === 'exam') {
                this.toggleExamFieldsVisibility();
            }

            document.querySelector('.btn-start-test').onclick = () =>
                this.handleElectroBezStartTest();
        }, 0);
    }

    populateThemesDropdown() {

        const themesSelect = document.querySelector('#test-themes');
        if (!themesSelect) {
            console.error('Could not find themes dropdown element');
            return;
        }

        // Clear existing options except the default
        themesSelect.innerHTML = '<option value="0" selected>Все темы</option>';

        // Add theme options
        this.electroBezExamQuestionsStructure.themes.forEach((theme, index) => {
            const option = new Option(theme, index + 1);
            themesSelect.add(option);
        });
    }

    toggleExamFieldsVisibility() {
        document.querySelector('.test-themes').hidden = true;
        document.querySelectorAll('.exam-field').forEach(element => {
            element.hidden = false;
        });
    }

    handleElectroBezStartTest() {
        if (this.examMode === 'exam') {
            if (!this.setWorkerFIO()) return;
        }

        const examSelectedOptions = {
            group: document.querySelector('#test-options_electrical-group').value,
            mode: this.examMode,
            voltage: document.querySelector('#test-options_electrical-voltage').value,
            theme: parseInt(document.querySelector('#test-themes').value),
        };

        this.filterQuestions(examSelectedOptions);
        this.createExamQuestionAnswersForm();
    }

    createExamQuestionAnswersForm() {
        this.startTime = this.getCurrentTime();
        this.setFormWide();
        this.createExamPageStructure(this.genericQuestionsStructure.length);

        document.querySelector('.btn-submit-answer').addEventListener("click", this.checkAnswer.bind(this));
        this.displayCurrentQuestion();
    }

    // ======================
    // Question Handling Methods
    // ======================

    displayCurrentQuestion() {
        this.createQuestionAndAnswers(this.currentQuestionInArray);
        this.ribbon.setBabbleStyleActive(this.currentQuestionInArray);
    }

    createQuestionAndAnswers(questionNumberInArray) {
        const currentQuestion = this.genericQuestionsStructure[questionNumberInArray];

        // Set question text
        const questionDiv = document.querySelector('.question');
        questionDiv.textContent = currentQuestion.questionText + ' ' + (currentQuestion.bookLink || '');

        // Set question image
        this.setQuestionImage(currentQuestion);

        // Set answers
        const answersDiv = document.querySelector('.answers');
        answersDiv.innerHTML = '';

        currentQuestion.answers.forEach((answer, i) => {
            answersDiv.innerHTML += this.createHtmlAnswer(i, answer.text);
            if (answer.correct) {
                this.rightAnswerNumber = i;
            }
        });
    }

    setQuestionImage(question) {
        const image = document.querySelector('#image_question');
        if (question.pictName) {
            let url = window.location
            let splitUrl = url.toString().split('/');
            splitUrl = splitUrl.slice(0, -1);
            let UrlPathWithoutLastDirectory = splitUrl.join("/")
            image.src = UrlPathWithoutLastDirectory + '/pict/sps_test/' + question.pictName;
            image.hidden = false;
        } else {
            image.hidden = true;
        }
    }

    checkAnswer() {
        const selectedAnswer = this.getSelectedAnswer();
        if (selectedAnswer === undefined) return;

        if (selectedAnswer === this.rightAnswerNumber) {
            this.rightAnswerAction(selectedAnswer);
        } else {
            this.wrongAnswerAction(selectedAnswer);
        }
    }

    getSelectedAnswer() {
        const answersRadioButtons = document.querySelectorAll(".form-check-input");
        for (let i = 0; i < answersRadioButtons.length; i++) {
            if (answersRadioButtons[i].checked) {
                return parseInt(answersRadioButtons[i].dataset.ans_numb);
            }
        }
        return undefined;
    }

    rightAnswerAction(selectedAnswerNumber) {
        if (this.examMode === 'preparation') {
            this.handlePreparationModeAnswer(true, selectedAnswerNumber);
            this.moveToNextQuestion();
            return;
        }
        this.handleExamAnswer(true, selectedAnswerNumber);
    }

    wrongAnswerAction(selectedAnswerNumber) {
        if (this.examMode === 'preparation') {
            this.handlePreparationModeAnswer(false, selectedAnswerNumber);
            return;
        }
        this.handleExamAnswer(false, selectedAnswerNumber);
    }

    handlePreparationModeAnswer(isCorrect, selectedAnswerNumber) {
        if (!isCorrect) {
            this.highlightCorrectAndWrongAnswers(selectedAnswerNumber);
        }
        this.ribbon.setBubbleBackgroundColor(isCorrect, this.currentQuestionInArray);
    }

    highlightCorrectAndWrongAnswers(selectedAnswerNumber) {
        const rightAnswerDiv = document.querySelector('.text_answer_' + this.rightAnswerNumber);
        rightAnswerDiv.style.backgroundColor = '#8bffd6';

        if (selectedAnswerNumber !== undefined) {
            const userAnswerDiv = document.querySelector('.text_answer_' + selectedAnswerNumber);
            userAnswerDiv.style.backgroundColor = '#fec6c6';
        }
    }

    handleExamAnswer(isCorrect, selectedAnswerNumber) {
        if (this.isQuestionAnswered(this.currentQuestionInArray)) return;

        this.setWorkerAnswer(isCorrect, selectedAnswerNumber);

        if (this.getTotalAnsweredQuestions() === this.totalQuestions) {
            this.reportResult();
            return;
        }

        this.currentQuestionInArray = this.getNextNotAnsweredIndex();
        this.ribbon.moveScrollIfCurrentBubbleIsLast(this.currentQuestionInArray);
        this.displayCurrentQuestion();
    }

    moveToNextQuestion() {
        if (this.genericQuestionsStructure.length > this.currentQuestionInArray + 1) {
            this.currentQuestionInArray++;
            this.ribbon.moveScrollIfCurrentBubbleIsLast(this.currentQuestionInArray);
            this.displayCurrentQuestion();
        }
    }

    // ======================
    // Worker Data Methods
    // ======================

    setWorkerFIO() {
        const surname = document.querySelector('#worker-surname');
        const name = document.querySelector('#worker-name');
        const patronymic = document.querySelector('#worker-patronymic');

        if (!surname.value.trim() || !name.value.trim() || !patronymic.value.trim()) {
            alert('Пожалуйста, заполните все обязательные поля');
            return false;
        }
        this.worker.surname = surname.value;
        this.worker.name = name.value;
        this.worker.patronymic = patronymic.value;
        this.worker.tabNumb = document.querySelector('#worker-numb').value;
        return true;
    }

    setWorkerAnswer(isRight, selectedAnswerNumber) {
        const currentQuestion = this.worker.questions[this.currentQuestionInArray];
        currentQuestion.isRight = isRight;
        currentQuestion.isAnswered = true;
        currentQuestion.answerNumber = selectedAnswerNumber;
        this.ribbon.setBabbleStyleBlocked(this.currentQuestionInArray);
    }

    // ======================
    // Question Navigation Methods
    // ======================

    isQuestionAnswered(index) {
        return this.worker.questions[index].isAnswered === true;
    }

    getTotalAnsweredQuestions() {
        return this.worker.questions.filter(q => q.isAnswered).length;
    }

    getNextNotAnsweredIndex() {
        // Check questions after current
        for (let i = this.currentQuestionInArray + 1; i < this.totalQuestions; i++) {
            if (!this.isQuestionAnswered(i)) return i;
        }

        // Check questions before current
        for (let i = 0; i < this.currentQuestionInArray; i++) {
            if (!this.isQuestionAnswered(i)) return i;
        }

        return null;
    }

    // ======================
    // Exam Result Methods
    // ======================

    reportResult() {
        const requestBody = this.createReportRequestBody();

        if (this.isExamPass()) {
            alert("Экзамен сдан");
        } else {
            alert("Экзамен не сдан");
        }

        downloadFile(config.api.getSpsProtocol, "POST", addCSRF(requestBody));
    }

    createReportRequestBody() {
        return {
            surname: this.worker.surname,
            name: this.worker.name,
            patronymic: this.worker.patronymic,
            tab_numb: this.worker.tabNumb,
            questions: this.getAnsweredQuestionsData(),
            is_pass: this.worker.passExam,
            start_time: this.startTime,
            finish_time: this.getCurrentTime(),
            report_theme: this.worker.whatPassing,
        };
    }

    getAnsweredQuestionsData() {
        return this.worker.questions.map(question => ({
            question: question.questionText,
            answer: question.answers[question.answerNumber].text,
            isRight: question.isRight
        }));
    }

    isExamPass() {
        const totalRightAnswers = this.worker.questions.filter(q => q.isRight).length;
        this.worker.passExam = (this.totalQuestions - totalRightAnswers) <= this.allowedMistakes;
        return this.worker.passExam;
    }

    // ======================
    // Utility Methods
    // ======================

    getCurrentTime() {
        const now = new Date();
        return `${now.getDate()}.${now.getMonth() + 1}.${now.getFullYear()} ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    }

    setFormWide() {
        document.querySelector('.form-container').style.maxWidth = '95%';
    }

    filterQuestions(examSelectedOptions) {
        let groupFieldToFilter = this.getGroupField(examSelectedOptions.group);

        this.genericQuestionsStructure = this.electroBezExamQuestionsStructure.questons.filter(question => {
            const matchesGroup = question[groupFieldToFilter] === true;
            const matchesVoltage = question[examSelectedOptions.voltage] === true;

            if (examSelectedOptions.theme === 0) {
                return matchesGroup && matchesVoltage;
            }
            return matchesGroup && matchesVoltage && question.theme === examSelectedOptions.theme;
        });

        if (this.examMode === 'exam') {
            this.genericQuestionsStructure = this.getRandomElements(this.genericQuestionsStructure, this.totalQuestions);
        }

        this.worker.questions = this.genericQuestionsStructure;
    }

    getGroupField(group) {
        const groupFields = {
            '2': 'secondGroup',
            '3': 'thirdGroup',
            '4': 'fourthGroup',
            '5': 'fifthGroup'
        };
        return groupFields[group];
    }

    getRandomElements(arr, count) {
        // Fisher-Yates shuffle algorithm
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr.slice(0, count);
    }

    createExamPageStructure(questionsLength) {
        this.idPageContent.innerHTML = this.examHtml;
        this.ribbon = new Ribbon(document.querySelector('.questions-ribbon'), questionsLength - 1, this);
    }

    createHtmlAnswer(answerNumber, answerText) {
        return `
            <div class="form-check d-flex">
                <div class="radio-button-wrapper d-flex justify-content-md-center align-items-center">
                    <input class="form-check-input" type="radio" name="flexRadioDefault"
                           data-ans_numb="${answerNumber}" id="answer_${answerNumber}">
                </div>
                <div class="quest-text">
                    <label class="form-check-answer text_answer_${answerNumber}" for="answer_${answerNumber}">
                        ${answerText}
                    </label>
                </div>
            </div>
            <div class="vertical-space"></div>
        `;
    }

    // ======================
    // Data Structure Creation Methods
    // ======================

    createSpsQuestionsStructure(examResponse) {
        this.spsExamQuestionsStructure = examResponse.map(this.createSpsQuestion.bind(this));
        this.genericQuestionsStructure = this.spsExamQuestionsStructure;

        if (this.examMode === 'exam') {
            this.prepareSpsExamQuestions();
        }
    }

    createSpsQuestion(elem) {
        const question = {
            bookLink: null,
            questionText: elem.question,
            pictName: elem.pict_path,
            answers: this.createSpsAnswers(elem),
            isMedicine: elem.is_medicine === true,
            isAnswered: false,
            isRight: false,
            answerNumber: 0,
        };

        this.setCorrectAnswer(question.answers, elem.correct_answer);
        return question;
    }

    createSpsAnswers(elem) {
        const answers = [];
        for (let i = 1; i <= 5; i++) {
            const answerField = 'answer_' + i;
            if (elem[answerField]) {
                answers.push({text: elem[answerField], correct: undefined});
            }
        }
        return answers;
    }

    setCorrectAnswer(answers, correctAnswer) {
        if (correctAnswer === null) throw new Error('correct_answer === null');
        answers[parseInt(correctAnswer) - 1].correct = true;
    }

    prepareSpsExamQuestions() {
        let questions = [...this.spsExamQuestionsStructure];

        // Get medicine questions
        const medicineQuestions = questions.filter(q => q.isMedicine);
        const selectedMedicineQuestion = this.getRandomElement(medicineQuestions);
        questions = questions.filter(q => !q.isMedicine);

        // Get picture questions
        const pictureQuestions = questions.filter(q => q.pictName);
        const selectedPictureQuestion = this.getRandomElement(pictureQuestions);
        questions = questions.filter(q => !q.pictName);

        // Get remaining questions
        const remainingQuestions = this.getRandomElements(questions, this.totalQuestions - 2);

        this.genericQuestionsStructure = [...remainingQuestions, selectedPictureQuestion, selectedMedicineQuestion];
        this.worker.questions = this.genericQuestionsStructure;
    }

    getRandomElement(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    createElectroBezQuestionsStructure(examResponse) {
        examResponse.forEach(elem => {
            if (elem.question_theme_correct === 'Theme') {
                this.electroBezExamQuestionsStructure.themes.push(elem.theme_question_answer);
            } else if (elem.question_theme_correct === 'Question') {
                this.addElectroBezQuestion(elem);
            } else {
                this.addElectroBezAnswer(elem);
            }
        });
    }

    addElectroBezQuestion(elem) {
        const question = {
            theme: elem.theme,
            till1000: elem.till_1000,
            tillAbove1000: elem.till_above_1000,
            secondGroup: elem.second_group,
            thirdGroup: elem.third_group,
            fourthGroup: elem.fourth_group,
            fifthGroup: elem.fifth_group,
            commissionMember: elem.commission_member,
            employee: elem.employee,
            bookLink: elem.book_link,
            questionText: elem.theme_question_answer,
            answers: [],
            pictName: '',
        };
        this.electroBezExamQuestionsStructure.questons.push(question);
    }

    addElectroBezAnswer(elem) {
        const lastQuestion = this.electroBezExamQuestionsStructure.questons.slice(-1)[0];
        if (!lastQuestion) return;

        const answer = {
            text: elem.theme_question_answer,
            correct: elem.question_theme_correct === 'True',
        };
        lastQuestion.answers.push(answer);
    }

    // ======================
    // HTML Templates
    // ======================

    assignHtml() {
        this.examTypeAndModeHtml = this.getExamTypeAndModeHtml();
        this.optionsSpsExamHtml = this.getOptionsSpsExamHtml();
        this.optionsElectroBezHtml = this.getOptionsElectroBezHtml();
        this.examHtml = this.getExamHtml();
    }

    getExamTypeAndModeHtml() {
        return `
            <div class="row mb-3">
                <label for="test-options_type" class="col-sm-2 col-form-label">Тема</label>
                <div class="col-sm-10">
                    <select class="form-control" id="test_options_type">
                        <option selected value="electroBez">Электробезопасность</option>
                        <option value="ops">Нормы ОПС</option>
                    </select>
                </div>
            </div>
            <div class="row mb-3">
                <label for="test-options_mode" class="col-sm-2 col-form-label">Режим</label>
                <div class="col-sm-10">
                    <select class="form-control" id="test_options_mode">
                        <option selected value="preparation">Подготовка</option>
                        <option value="exam">Экзамен</option>
                    </select>
                </div>
            </div>
            <div class="d-flex flex-row-reverse bd-highlight">
                <button type="submit" class="btn btn-primary btn-chose-exam_type_and_mode">Далее</button>
            </div>
        `;
    }

    getOptionsSpsExamHtml() {
        return `
            <div class="row mb-3">
                <label for="worker-surname" class="col-sm-2 col-form-label">Фамилия</label>
                <div class="col-sm-10">
                    <input type="text" required id="worker-surname" class="form-control" name="worker-surname">
                </div>
            </div>
            <div class="row mb-3">
                <label for="worker-name" class="col-sm-2 col-form-label">Имя</label>
                <div class="col-sm-10">
                    <input type="text" required id="worker-name" class="form-control" name="worker-name">
                </div>
            </div>
            <div class="row mb-3">
                <label for="worker-patronymic" class="col-sm-2 col-form-label">Отчество</label>
                <div class="col-sm-10">
                    <input type="text" required id="worker-patronymic" class="form-control" name="worker-patronymic">
                </div>
            </div>
            <div class="row mb-3">
                <label for="worker-numb" hidden  class="col-sm-2 col-form-label">Табельный номер</label>
                <div class="col-sm-10">
                    <input type="text" hidden required id="worker-numb" class="form-control" name="worker-numb">
                </div>
            </div>
            <div class="d-flex flex-row-reverse bd-highlight">
                <button type="submit" class="btn btn-primary btn-start-sps-test">Далее</button>
            </div>
        `;
    }

    getOptionsElectroBezHtml() {
        return `
                    <div hidden class="row mb-3 exam-field"">
                        <label for="worker-surname"  class="col-sm-2 col-form-label ">Фамилия</label>
                        <div class="col-sm-10">
                            <input type="text" required id="worker-surname" class="form-control " name="worker-surname">
                        </div>
                    </div>
                    <div hidden class="row mb-3 exam-field"">
                        <label for="worker-name"  class="col-sm-2 col-form-label ">Имя</label>
                        <div class="col-sm-10">
                             <input type="text" required id="worker-name" class="form-control " name="worker-name">
                        </div>
                    </div>
                    <div hidden class="row mb-3 exam-field"">
                        <label for="worker-patronymic"  class="col-sm-2 col-form-label " >Отчество</label>
                        <div class="col-sm-10">
                             <input type="text" required id="worker-patronymic" class="form-control " name="worker-patronymic">
                        </div>
                    </div>
                     <div hidden class="row mb-3">
                        <label for="worker-numb"   class="col-sm-2 col-form-label">Табельный номер</label>
                        <div class="col-sm-10">
                             <input type="text"  id="worker-numb" class="form-control" name="worker-numb">
                        </div>
                    </div>
                    <div hidden class="row mb-3 exam-field"" >
                        <label for="worker-position"  class="col-sm-2 col-form-label ">Должность</label>
                        <div class="col-sm-10">
                            <select class="form-control "  id="worker-position" name = "worker-position">
                                <option value="Ведущий инженер" selected>Ведущий инженер</option>
                                <option value="Зам. начальника цеха ПС" selected>Зам. начальника цеха ПС</option>
                                <option value="Мастер по КАиТ" selected>Мастер по КАиТ</option>
                                <option value="Кладовщик 2 разряда" selected>Кладовщик 2 разряда</option>
                                <option value="Техник II категории" selected>Техник II категории</option>
                                <option value="Инженер I категории" selected>Инженер I категории</option>
                                <option value="Инженер-электроник" selected>Инженер-электроник</option>
                                <option value="Инженер-электроник I категории" selected>Инженер-электроник I категории</option>
                                <option value="Инженер-электроник II категории" selected>Инженер-электроник II категории</option>
                                <option value="Ведущий инженер-электроник" selected>Ведущий инженер-электроник</option>
                                <option value="Наладчик КИПиА IV разряда" selected>Наладчик КИПиА IV разряда</option>
                                <option value="Наладчик КИПиА V разряда" selected>Наладчик КИПиА V разряда</option>
                                <option value="Наладчик КИПиА VI разряда" selected>Наладчик КИПиА VI разряда</option>
                                <option value="Начальник участка" selected>Начальник участка</option>
                                <option value="Начальник участка ПС" selected>Начальник участка ПС</option>
                                <option value="Начальник цеха ПС" selected>Начальник цеха ПС</option>
                                <option value="Слесарь по КИПиА IV разряда" selected>Слесарь по КИПиА IV разряда</option>
                                <option value="Слесарь по КИПиА V разряда" selected>Слесарь по КИПиА V разряда</option>
                                <option value="Слесарь по КИПиА VI разряда" selected>Слесарь по КИПиА VI разряда</option>
                                <option value="Электромонтер ОПС IV разряда" selected>Электромонтер ОПС IV разряда</option>
                                <option value="Электромонтер ОПС V разряда" selected>Электромонтер ОПС V разряда</option>
                                <option value="Электромонтер ОПС VI разряда" selected>Электромонтер ОПС VI разряда</option>
                            </select>
                        </div>
                    </div>
                    <div class="row mb-3">
                        <label for="test-options_electrical-voltage" class="col-sm-2 col-form-label">Напряжение</label>
                        <div class="col-sm-10">
                            <select class="form-control" id="test-options_electrical-voltage">
                                <option value="till1000" selected>до 1000В</option>
                                <option value="tillAbove1000">до и выше 1000В</option>
                            </select>
                        </div>
                    </div>
                    <div class="row mb-3">
                        <label for="test-options_electrical-group" class="col-sm-2 col-form-label">Группа</label>
                        <div class="col-sm-10">
                            <select class="form-control" id="test-options_electrical-group">
                                <option value="2">2</option>
                                <option value="3" selected>3</option>
                                <option value="4">4</option>
                                <option value="4">5</option>
                            </select>
                        </div>
                    </div>
                    <div class="row mb-3 test-themes">
                        <label for="test-themes" class="col-sm-2 col-form-label ">Темы</label>
                        <div class="col-sm-10">
                            <select class="form-control" id="test-themes">
                                <option value="0" selected>Все темы</option>
                            </select>
                        </div>
                    </div>
                    <div class="d-flex flex-row-reverse bd-highlight">
                        <button type="submit" class="btn btn-primary btn-start-test">Далее</button>
                    </div>
        `;

    }

    getExamHtml() {
        return `
            <div class="questions-ribbon d-flex flex-row"></div>
            <div class="question text-center"></div>
            <div class="question image_question_wrapper" style="display: flex;justify-content: center;">
                <img src="" alt="question image" id="image_question" width="400" height="400">
            </div>
            <div class="answers"></div>
            <div class="d-grid gap-2 col-3 mx-auto">
                <button type="submit" class="btn btn-primary btn-submit-answer">Ответить</button>
            </div>
        `;
    }
}
