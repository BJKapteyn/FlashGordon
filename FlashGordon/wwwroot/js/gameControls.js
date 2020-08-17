let asyncOps = {
    dataIsLoaded: false
}

let flashCards = {
    allFlashCards: [],
    categories: [],
    categoryButtons: [],
    populateCatButtons: function () {
        for (let i in this.categories) {
            let id = this.categories[i] + "Id";
            let button = new categoryButton(id, false, this.categories[i]);
            this.categoryButtons.push(button);
        }
    }
}

function flashCard(front, back, category, id) {
    this.Front = front;
    this.Back = back;
    this.Category = category;
    this.Id = id;
    this.IsUsed = true;
}

function categoryButton(_id, _isUsed, _name) {
    this.id = _id;
    this.isUsed = _isUsed;
    this.name = _name;
    this.toggleIsUsed = function () {
        this.isUsed ? this.isUsed = false : this.isUsed = true;
        if (this.isUsed) {
            
        }
    }
}

function startGame() {
    
}

function chooseCategories() {
    
}

function createChooseCatElement() {
    let parent = document.createElement('div');
    for(let i in )
}

function urlBuilder(uriString) {
    let domainArr = window.location.href.split('/');
    let domain = domainArr[0] + "//" + domainArr[2];
    return (domain + uriString);
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

function flipCard() {
    
}

window.onload = async function () {
    await getFlashCards();
    await getCategories(flashCards.categories).then(() => {
        
    })
    console.log(flashCards.allFlashCards[0]);
}