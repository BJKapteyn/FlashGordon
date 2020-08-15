let flashCards = {
    allFlashCards: [],
    categories: []
}

function flashCard(front, back, category, id) {
    this.Front = front;
    this.Back = back;
    this.Category = category;
    this.Id = id;
    this.IsUsed = true;
}

function urlBuilder(uriString) {
    let domainArr = window.location.href.split('/');
    let domain = domainArr[0] + "//" + domainArr[2];
    return (domain + uriString);
}

function startGame() {
    
}

async function getFlashCards() {
    let URL = urlBuilder('/Home/GetAllFlashCards');
    await fetch(URL, {
        method: "GET",
    })
        .then(response => jsonData = response.json())
        .then(data => {
            for (let i in data) {
                debugger;
                let newFC = new flashCard(data[i].Front, data[i].Back, data[i].Category, data[i].Id);
                flashCards.allFlashCards.push(newFC);
            }
        });
}

window.onload = async function () {
    await getFlashCards();

    console.log(flashCards.allFlashCards[0]);
}