let flashCards = {
    allCardsArr: document.getElementsByClassName("fCardFlex")
}

window.onload = function () {
    getCategories(formInfo.categories).then(formInfo.initializeCategoryButtons());
    fadeInAllElements("fCardFlex");
};