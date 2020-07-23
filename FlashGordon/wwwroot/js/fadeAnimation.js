let flashCards = {
    allCardsArr: document.getElementsByClassName("fCardFlex")
}

function fadeInElement(elementQuery) {
    console.log("hey");
    elementQuery.style.animationName = "fadeIn";
}


function fadeInAllElements() {
    flashCards.allCardsArr = document.getElementsByClassName("fCardFlex");
    var i = 0;
    debugger;
    setInterval(function () {
        fadeInElement(flashCards.allCardsArr.item(i));
        if (i === flashCards.allCardsArr.length) {
            this.clearInterval();
        }
        i++;
    }, 100);
    //Array.prototype.forEach.call(flashCards.allCardsArr, function (x) {
    //    fadeInElement(x);
    //});
    
}

window.onload = fadeInAllElements();