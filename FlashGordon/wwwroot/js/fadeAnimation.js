let flashCards = {
    allCardsArr: document.getElementsByClassName("fCardFlex")
}

function fadeInElement(elementQuery) {
    elementQuery.style.animationName = "fadeIn";
}


function fadeInAllElements() {
    flashCards.allCardsArr = document.getElementsByClassName("fCardFlex");
    var i = 0;
    let interval = setInterval(function () {
        fadeInElement(flashCards.allCardsArr.item(i));
        if (i == flashCards.allCardsArr.length - 1) {
            clearInterval(interval);
        }
        i++;
    }, 50);
    //Array.prototype.forEach.call(flashCards.allCardsArr, function (x) {
    //    fadeInElement(x);
    //});
    
}

window.onload = fadeInAllElements();