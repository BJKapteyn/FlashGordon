

window.onload = async function () {
    await getFlashCards();
    await getCategories(flashCards.categories).then(() => {
        
    })
    console.log(flashCards.allFlashCards[0]);
}