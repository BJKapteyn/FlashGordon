let flashCards = {
    allCardsArr: document.getElementsByClassName("fCardFlex")
}

window.onload = async function () {
    await getCategories(formInfo.categories);
    formInfo.initializeCategoryButtons();
    fadeInAllElements("fCardFlex");
};