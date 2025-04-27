export default class Ribbon {
    ActiveBubble = 0
    ribbonDiv;
    questionsStatus = [];
    exam;
    babbleWidth;
    inScreenBubbles;
    moveAmount;
    bubbleListener;
    constructor(ribbonDiv, bubblesQuantity, exam) {
        this.ribbonDiv = ribbonDiv;
        this.bubblesQuantity = bubblesQuantity;
        this.exam = exam;
        this.fillRibbonWithBubbles(bubblesQuantity);
        this.calculateBubbleWidth();
        this.calculateMoveScrollStep();

    }

    fillRibbonWithBubbles(bubblesQuantity) {
        for (let i = 0; i <= bubblesQuantity; i++) {
            const questionStatusElement = document.createElement("div");
            questionStatusElement.classList.add('quest-status', 'text-center', 'bubble-' + i);
            questionStatusElement.textContent = (i + 1).toString();
            this.ribbonDiv.appendChild(questionStatusElement);
            let questionStatus = {
                questionStatusElement: undefined,
                userResult: undefined
            }
            questionStatus.questionStatusElement = questionStatusElement;
            this.questionsStatus.push(questionStatus);
            this.bubbleListener = this.bubbleClickAction.bind(this,i)
            questionStatusElement.addEventListener("click", this.bubbleListener
            );
        }
    }

    bubbleClickAction(i) {
        this.setBabbleStyleNotActive(this.exam.currentQuestionInArray);
        this.exam.currentQuestionInArray = i;
        this.setBabbleStyleActive(this.exam.currentQuestionInArray);
        this.exam.createQuestionAndAnswers(i);
    }


    calculateBubbleWidth() {
        const bubble0 = document.querySelector('.bubble-0');
        const style = getComputedStyle(bubble0);
        const bubble0LeftMargin = style.marginLeft;
        this.babbleWidth = bubble0.offsetWidth + parseInt(bubble0LeftMargin);
        this.inScreenBubbles = Math.floor(this.ribbonDiv.clientWidth / this.babbleWidth);
    }

    setBubbleBackgroundColor(isRight, currentQuestionInArray) {
        let bubble = this.questionsStatus[currentQuestionInArray];
        if (bubble.userResult === undefined && isRight) {
            bubble.questionStatusElement.style.backgroundColor = '#8bffd6';
            bubble.userResult = 'right';
        }
        if (bubble.userResult === undefined && !isRight) {
            bubble.questionStatusElement.style.backgroundColor = '#fec6c6';
            bubble.userResult = 'wrong';
        }
    }

    calculateMoveScrollStep() {
        this.moveAmount = Math.floor(this.ribbonDiv.clientWidth / 2.5);
    }

    getLastBubbleInVision() {
        if (this.ribbonDiv.scrollLeft !== 0) {
            let bubblesNotInVisionOnLeftSide = Math.floor(parseInt(this.ribbonDiv.scrollLeft) / parseInt(this.babbleWidth));
            return bubblesNotInVisionOnLeftSide + this.inScreenBubbles;
        }
        return this.inScreenBubbles;
    }

    getFirstBubbleInVision() {
        if (this.ribbonDiv.scrollLeft === 0) {
            return 1;
        }
        return Math.floor(parseInt(this.ribbonDiv.scrollLeft) / parseInt(this.babbleWidth)) + 1;
    }


    setBabbleStyleActive(bubbleNumber) {
        this.ActiveBubble = bubbleNumber;
        let bubble = this.questionsStatus[bubbleNumber].questionStatusElement;
        bubble.classList.add('current-quest-status');
    }

    setBabbleStyleNotActive(bubbleNumber) {
        let bubble = this.questionsStatus[bubbleNumber].questionStatusElement;
        bubble.classList.remove('current-quest-status');
    }

    setBabbleStyleBlocked(bubbleNumber) {
        let bubble = this.questionsStatus[bubbleNumber].questionStatusElement;
        bubble.classList.add('blocked');
    }

    moveScrollIfCurrentBubbleIsLast(nextBubble) {
        const lastBubbleInVision = this.getLastBubbleInVision();
        const firstBubbleInVision = this.getFirstBubbleInVision();
        if (nextBubble < firstBubbleInVision) {
            let pixelsToMove = nextBubble * this.babbleWidth - this.moveAmount;
            this.ribbonDiv.scrollTo(pixelsToMove, 0);
            return true;
        }
        if (nextBubble >= lastBubbleInVision) {
            let pixelsToMove = nextBubble * this.babbleWidth - this.moveAmount;
            this.ribbonDiv.scrollTo(pixelsToMove, 0);
        }

    }

}
