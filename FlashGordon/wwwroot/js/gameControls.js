let asyncOps = {
    dataIsLoaded: false
}

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
    let response = await fetch(URL, {
        method: "GET",
    })
        .then(response => jsonData = response.json())
        .then(data => {
            for (let i in data) {
                let newFC = new flashCard(data[i].Front, data[i].Back, data[i].Category, data[i].Id);
                flashCards.allFlashCards.push(newFC);
            }
        });
    return response;//promise
}

async function getCategories(categoryArray) {
    let requestAddress = urlBuilder("/Home/GetCategories");

    let response = await fetch(requestAddress, {
        method: "GET",
        headers: {
            "Accept": "application/json"
        }
    })
        .then(response => response.json())
        .then((data) => {
            let jsonData = JSON.parse(data);
            for (let i in jsonData) categoryArray.push(jsonData[i]);//store categories from backend
        })
    return response;//promise
}

window.onload = async function () {
    debugger;
    await getFlashCards();
    await getCategories(flashCards.categories);
    console.log(flashCards.allFlashCards[0]);
}