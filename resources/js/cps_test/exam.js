import {config, httpRequest} from "./dao";
import Ribbon from "./ribbon";

export default class Exam {
    idPageContent;
    examHtml;
    themes = [];
    questionsForTestForm = [];
    questionsDB = [];
    ribbon;
    rightAnswerNumber = 0
    currentQuestionInArray = 0;
    optionsElectroBezHtml;
    examTypeAndModeHtml;
    examType;
    exaMode;

    constructor(idPageContent) {
        this.idPageContent = idPageContent;
        this.assignHtml();
        this.createExamTypeAndModeForm();
    }

    createExamTypeAndModeForm() {
        this.idPageContent.innerHTML = this.examTypeAndModeHtml;
        document.querySelector('.btn-chose-exam_type_and_mode').onclick = () => {
            this.exaMode = document.querySelector('#test_options_mode').value;
            this.examType = document.querySelector('#test_options_type').value;
            if (this.examType === 'electroBez') {
                httpRequest(config.api.getElectroBezTable, 'GET').then((electroBezTableResponse) => {
                    this.createElectroBezPrepForm();
                    this.createElectroBezQuestionsStructure(electroBezTableResponse);
                }).catch((e) => {
                    console.log(e);
                });
                return;
            }
            if (this.examType === 'ops' && this.exaMode === 'preparation') {
                httpRequest(config.api.getSpsExamTable, 'GET').then((spsExamTableResponse) => {
                    this.createSpsQuestionsStructure(spsExamTableResponse);
                    this.createExamForm();
                }).catch((e) => {
                    console.log(e);
                });
                return;
            }
            if (this.examType === 'ops' && this.exaMode === 'exam') {

            }
        }
    }

    createExamForm() {
        this.setFormWide();
        this.createExamPageStructure(this.questionsForTestForm.length);
        //assignAnswerButtonAction
        document.querySelector('.btn-submit-answer').addEventListener("click", this.checkAnswer.bind(this));
        // //insertFirstQuestion
        this.createQuestionAndAnswers(this.currentQuestionInArray);
        this.ribbon.setBabbleStyleActive(this.currentQuestionInArray);
    }

    setFormWide() {
        let formContainer = document.querySelector('.form-container');
        formContainer.style.maxWidth = '95%';
    }

    createElectroBezPrepForm() {
        this.idPageContent.innerHTML = this.optionsElectroBezHtml;

        document.querySelector('.btn-start-test').onclick = () => {

            let examSelectedOptions = {
                group: undefined,
                mode: undefined,
                voltage: undefined,
                theme: undefined,
            }
            examSelectedOptions.voltage = document.querySelector('#test-options_electrical-voltage').value;
            examSelectedOptions.group = document.querySelector('#test-options_electrical-group').value;
            examSelectedOptions.theme = parseInt(document.querySelector('#test-themes').value);
            this.filterQuestions(examSelectedOptions);
            this.setFormWide();
            this.createExamForm();
        }

    }

    checkAnswer() {
        const answersRadioButtons = document.querySelectorAll(".form-check-input");
        let userAnswer = undefined;
        for (let i = 0; i < answersRadioButtons.length; i++) {
            if (answersRadioButtons[i].checked) {
                userAnswer = parseInt(answersRadioButtons[i].dataset.ans_numb);
                break;
            }
        }
        if (userAnswer === undefined) {
            return false;
        }
        if (userAnswer === this.rightAnswerNumber) {
            this.rightAnswerAction();
            return false;
        }
        this.wrongAnswerAction(userAnswer);
    }

    filterQuestions(examSelectedOptions) {
        let groupFieldToFilter = '';

        switch (examSelectedOptions.group) {
            case '2':
                groupFieldToFilter = 'secondGroup';
                break;
            case '3':
                groupFieldToFilter = 'thirdGroup';
                break;
            case '4':
                groupFieldToFilter = 'fourthGroup';
                break;
            case '5':
                groupFieldToFilter = 'fifthGroup';
                break;
        }

        this.questionsForTestForm = this.questionsDB.filter((question) => {
            if (examSelectedOptions.theme === 0) {
                if (question[groupFieldToFilter] === true && question[examSelectedOptions.voltage] === true) {
                    return true
                }
            }
            if (question[groupFieldToFilter] === true && question[examSelectedOptions.voltage] === true &&
                question.theme === examSelectedOptions.theme) {
                return true
            }
        });
    }

    createQuestionAndAnswers(questionNumberInArray) {
        const questionDiv = document.querySelector('.question');
        let bookLink = '';
        if (this.questionsForTestForm[questionNumberInArray].bookLink !== null) {
            bookLink = this.questionsForTestForm[questionNumberInArray].bookLink;
        }
        questionDiv.textContent = this.questionsForTestForm[questionNumberInArray].questionText + ' ' + bookLink;
        //image
        let image = document.querySelector('#image_question');
        if (this.questionsForTestForm[questionNumberInArray].pictName !== '' &&
            this.questionsForTestForm[questionNumberInArray].pictName !== null) {
            image.src = 'http://cpsportal/public/pict/sps_test/' + this.questionsForTestForm[questionNumberInArray].pictName;
            image.hidden = false;
        } else {
            image.hidden = true;
        };

        //answers
        const answersDiv = document.querySelector('.answers');
        let rightAnswerNumber = 0;
        answersDiv.innerHTML = '';
        for (let i = 0; i < this.questionsForTestForm[questionNumberInArray].answers.length; i++) {
            let currentAnswerHtml = this.createHtmlAnswer(i, this.questionsForTestForm[questionNumberInArray].answers[i]['text']);
            if (this.questionsForTestForm[questionNumberInArray].answers[i]['correct']) {
                this.rightAnswerNumber = i;
            }
            answersDiv.innerHTML += currentAnswerHtml;
        }
        return false
    }

    rightAnswerAction() {
        this.ribbon.setBubbleBackgroundColor(true, this.currentQuestionInArray);
        this.ribbon.setBabbleStyleNotActive(this.currentQuestionInArray);
        if (this.questionsForTestForm.length >= this.currentQuestionInArray + 2) {
            this.currentQuestionInArray++;
            this.ribbon.moveScrollIfCurrentBubbleIsLast(this.currentQuestionInArray);
            this.createQuestionAndAnswers(this.currentQuestionInArray);
            this.ribbon.setBabbleStyleActive(this.currentQuestionInArray);
        }


    }

    wrongAnswerAction(selectedAnswerNumber) {
        const rightAnswerDiv = document.querySelector('.text_answer_' + this.rightAnswerNumber);
        rightAnswerDiv.style.backgroundColor = '#8bffd6';
        if (selectedAnswerNumber !== undefined) {
            const userAnswerDiv = document.querySelector('.text_answer_' + selectedAnswerNumber);
            userAnswerDiv.style.backgroundColor = '#fec6c6';
        }
        this.ribbon.setBubbleBackgroundColor(false, this.currentQuestionInArray);
    }

    createSpsQuestionsStructure(examResponse) {
        examResponse.forEach((elem) => {
            let question = {
                bookLink: null,
                questionText: elem.question,
                pictName: elem.pict_path,
                answers: [],
                isMedicine: false,
            }
            for (let i = 1; i <= 5; i++) {
                let currentAnswerNumbField = 'answer_' + i.toString();
                if (elem[currentAnswerNumbField] !== null && elem[currentAnswerNumbField] !== '') {
                    let answer = {
                        text: elem[currentAnswerNumbField],
                        correct: undefined,
                    }
                    question.answers.push(answer);
                }
            }
            if (elem.correct_answer === null) {
                throw new Error('correct_answer === null');
            }
            let correctAnswer = parseInt(elem.correct_answer);
            question.answers[correctAnswer - 1].correct = true;

            // console.log(question.answers[correctAnswer]);

            this.questionsForTestForm.push(question);
        });
        // console.log(this.questions);
    }

    createElectroBezQuestionsStructure(examResponse) {
        examResponse.forEach((elem) => {
            if (elem.question_theme_correct === 'Theme') {
                this.themes.push(elem.theme_question_answer);
                let themesOption = document.querySelector('#test-themes');
                themesOption.add(new Option(elem.theme_question_answer, elem.theme));
            }
            if (elem.question_theme_correct === 'Question') {
                let question = {
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
                }
                this.questionsDB.push(question);
            }
            if (elem.question_theme_correct === 'False' || elem.question_theme_correct === 'True') {
                let lastQuestion = this.questionsDB[this.questionsDB.length - 1];
                let answer = {
                    text: elem.theme_question_answer,
                    correct: undefined,
                }
                elem.question_theme_correct === 'False' ? answer.correct = false : answer.correct = true;
                this.questionsDB[this.questionsDB.length - 1].answers.push(answer)
            }
        })
    }

    createExamPageStructure(questionsLength) {
        this.idPageContent.innerHTML = this.examHtml;
        this.ribbon = new Ribbon(document.querySelector('.questions-ribbon'), questionsLength - 1, this);
    }


    createHtmlAnswer(answerNumber, answerText) {
        return `
            <div class="form-check d-flex">
            <div class="radio-button-wrapper d-flex justify-content-md-center align-items-center">
                <input class="form-check-input" type="radio" name="flexRadioDefault" data-ans_numb="${answerNumber}"
                 id="answer_${answerNumber}">
            </div>
            <div class="quest-text">
                <label class="form-check-answer text_answer_${answerNumber}" for="answer_${answerNumber}">
                    ${answerText}
                </label>
            </div>
            </div>
            <div class="vertical-space"></div>
        `
    }

    assignHtml() {
        this.examTypeAndModeHtml = `
                    <div class="row mb-3">
                        <label for="test-options_mode" class="col-sm-2 col-form-label">Режим</label>
                        <div class="col-sm-10">
                            <select class="form-control" id="test_options_mode">
                                <option value="preparation" selected>Подготовка</option>
                                <option value="exam">Экзамен</option>
                            </select>
                        </div>
                    </div>
                    <div class="row mb-3">
                        <label for="test-options_type" class="col-sm-2 col-form-label">Тема</label>
                        <div class="col-sm-10">
                            <select class="form-control" id="test_options_type">
                                <option value="electroBez" selected>Электробезопасность</option>
                                <option value="ops">Нормы ОПС</option>
                            </select>
                        </div>
                    </div>
                    <div class="d-flex flex-row-reverse bd-highlight">
                        <button type="submit" class="btn btn-primary btn-chose-exam_type_and_mode">Далее</button>
                    </div>
        `
        this.optionsElectroBezHtml = `

                    <div class="row mb-3" hidden>
                        <label for="test-options_quest-amount" class="col-sm-2 col-form-label">Количество вопросов</label>
                        <div class="col-sm-10">
                            <select class="form-control" id="test-options_mode">
                                <option value="10" selected>10</option>
                                <option value="20">20</option>
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
                    <div class="row mb-3">
                        <label for="test-themes" class="col-sm-2 col-form-label">Темы</label>
                        <div class="col-sm-10">
                            <select class="form-control" id="test-themes">
                                <option value="0" selected>Все темы</option>
                            </select>
                        </div>
                    </div>
                    <div class="d-flex flex-row-reverse bd-highlight">
                        <button type="submit" class="btn btn-primary btn-start-test">Далее</button>
                    </div>
        `

        this.examHtml = `
                    <div class="questions-ribbon d-flex flex-row"></div>
                    <div class="question text-center"></div>
                    <div class="question image_question_wrapper" style="display: flex;justify-content: center;">
                        <img src="" alt="question image" id ='image_question' width="400" height="400">
                    </div>
                    <div class="answers"></div>
                    <div class="d-grid gap-2 col-3 mx-auto">
                        <button type="submit" class="btn btn-primary btn-submit-answer">Ответить</button>
                    </div>
        `
    }
}
