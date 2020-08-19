let flashCards = {
    allCardsArr: document.getElementsByClassName("fCardFlex")
}

function fadeInElement(element) {
    element.style.animationName = "fadeIn";
}


function fadeInAllElements() {
    if (!flashCards.allCardsArr) {
        flashCards.allCardsArr = document.getElementsByClassName("fCardFlex");
    }

    if (flashCards.allCardsArr.length > 0) {
        var i = 0;
        let interval = setInterval(function () {
            fadeInElement(flashCards.allCardsArr.item(i));
            if (i == flashCards.allCardsArr.length - 1) {
                clearInterval(interval);
            }
            i++;
        }, 50);
        //Possibly use this to interrupt the animation
        return interval;
    }
}

window.onload = function () {
    fadeInAllElements();
};