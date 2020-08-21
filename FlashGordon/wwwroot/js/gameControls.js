

window.onload = async function () {
    await getFlashCards();
    await getCategories(gameUtilities.categories).then(() => {
        
    })
    console.log(gameUtilities.allFlashCards[0]);
} 