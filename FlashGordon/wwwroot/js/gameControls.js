

window.onload = async function () {
    await getFlashCards();
    await getCategories(gameUtilities.categories).then(() => {
        gameUtilities.populateCatButtons();
    })
    console.log(gameUtilities.allFlashCards[0]);
    updateViews();
} 