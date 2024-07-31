import {config, httpRequest} from "../cps-portal-dao";
import Ribbon from "./ribbon";

export default class Exam {
    idPageContent;
    examHtml;
    themes = [];
    questions = [];
    questionsFiltered = [];
    ribbon;
    rightAnswerNumber = 0
    currentQuestionInArray = 0;

    constructor(idPageContent) {
        this.idPageContent = idPageContent;
        this.assignHtml();
        httpRequest(config.api.getExamTable, 'GET').then((examResponse) => {
            this.idPageContent.innerHTML = this.startOptionsHtml;
            this.makeQuestionsStructure(examResponse);
            document.querySelector('.btn-start-test').onclick = () => {
                let examSelectedOptions = {
                    group: undefined,
                    mode: undefined,
                    voltage: undefined,
                }
                examSelectedOptions.mode = document.querySelector('#test-options_mode').value;
                examSelectedOptions.voltage = document.querySelector('#test-options_electrical-voltage').value;
                examSelectedOptions.group = document.querySelector('#test-options_electrical-group').value;
                this.filterQuestions(examSelectedOptions);
                this.createExamPageStructure(examSelectedOptions.mode);
                //assignAnswerButtonAction
                document.querySelector('.btn-submit-answer').addEventListener("click", this.checkAnswer.bind(this));
                //insertFirstQuestion
                this.createQuestionAndAnswers(this.currentQuestionInArray);
                this.ribbon.setBabbleStyleActive(this.currentQuestionInArray);
            }
        }).catch((e) => {
            console.log(e);
        });
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

        this.questionsFiltered = this.questions.filter((question) => {
            if (question[groupFieldToFilter] === true || question[examSelectedOptions.group] === examSelectedOptions.voltage) {
                return true
            }
        });
    }

    createQuestionAndAnswers(questionNumberInArray) {
        const questionDiv = document.querySelector('.question');
        questionDiv.textContent = this.questionsFiltered[questionNumberInArray].questionText + ' ' +
            this.questionsFiltered[questionNumberInArray].bookLink;
        //answers
        const answersDiv = document.querySelector('.answers');
        let rightAnswerNumber = 0;
        answersDiv.innerHTML = '';
        for (let i = 0; i < this.questionsFiltered[questionNumberInArray].answers.length; i++) {
            let currentAnswerHtml = this.createHtmlAnswer(i, this.questionsFiltered[questionNumberInArray].answers[i]['text']);
            if (this.questionsFiltered[questionNumberInArray].answers[i]['correct']) {
                this.rightAnswerNumber = i;
            }
            answersDiv.innerHTML += currentAnswerHtml;
        }
        return false
    }

    rightAnswerAction() {
        this.ribbon.setBubbleBackgroundColor(true, this.currentQuestionInArray);
        this.ribbon.setBabbleStyleNotActive(this.currentQuestionInArray);
        if (this.questionsFiltered.length >= this.currentQuestionInArray + 2) {
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


    makeQuestionsStructure(examResponse) {
        examResponse.forEach((elem) => {
            if (elem.question_theme_correct === 'Theme') {
                this.themes.push(elem.theme_question_answer);
                let themesOption = document.querySelector('#test-themes');
                themesOption.add(new Option(elem.theme_question_answer, elem.theme_question_answer));
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
                }
                this.questions.push(question);
            }
            if (elem.question_theme_correct === 'False' || elem.question_theme_correct === 'True') {
                let lastQuestion = this.questions[this.questions.length - 1];
                let answer = {
                    text: elem.theme_question_answer,
                    correct: undefined,
                }
                elem.question_theme_correct === 'False' ? answer.correct = false : answer.correct = true;
                this.questions[this.questions.length - 1].answers.push(answer)
            }
        })
    }

    createExamPageStructure(selectedExamMode) {
        this.idPageContent.innerHTML = this.examHtml;
        this.ribbon = new Ribbon(document.querySelector('.questions-ribbon'), this.questions.length - 1, this);
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
        this.questionStatusHtml = `<div class="quest-status text-center"></div>`
        this.startOptionsHtml = `
        <div class="test-options d-flex  justify-content-center  vh-100 bg-light">
            <div class="form-container col-md-8 mt-5" style="max-width: 600px;">
                    <div class="row mb-3">
                        <label for="test-options_mode" class="col-sm-2 col-form-label">Режим</label>
                        <div class="col-sm-10">
                            <select class="form-control" id="test-options_mode">
                                <option value="preparation" selected>Подготовка</option>
                                <option value="exam">Экзамен</option>
                            </select>
                        </div>
                    </div>
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
                                <option value="till1000andAbove">до и выше 1000В</option>
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
                                <option value="till1000" selected>Все темы</option>
                            </select>
                        </div>
                    </div>
                    <div class="d-flex flex-row-reverse bd-highlight">
                        <button type="submit" class="btn btn-primary btn-start-test">Начать</button>
                    </div>
            </div>
        </div>
        `

        this.examHtml = `
                    <div class="questions-ribbon d-flex flex-row"></div>
                    <div class="question text-center"></div>
                    <div class="answers"></div>
                    <div class="d-grid gap-2 col-3 mx-auto">
                        <button type="submit" class="btn btn-primary btn-submit-answer">Ответить</button>
                    </div>
        `
    }
}
