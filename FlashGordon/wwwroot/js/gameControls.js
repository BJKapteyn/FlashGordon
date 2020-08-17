let asyncOps = {
    dataIsLoaded: false
}

let gameUtilities = {
    allFlashCards: [],
    categories: [],
    categoryButtons: [],
    populateCatButtons: function () {
        for (let i in this.categories) {
            let id = this.categories[i] + "Id";
            let button = new categoryButton(id, this.categories[i]);
            this.categoryButtons.push(button);
        }
    },
    updateButtonLocations: function () {
        if (this.categoryButtons) {
            for (let i in this.categoryButtons) {
                this.categoryButtons[i].updateNodelocation();
            }
        }
        else {
            console.error("Couldn't find category buttons");
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

function categoryButton(_id, _name) {//hold button location and functionality
    this.id = _id;
    this.isUsed = false;
    this.name = _name;
    this.node = document.getElementById("");//initialize to falsy value
    this.updateNodelocation = function() {//used after buttons are added to page
        this.node = document.getElementById(`${this.id}`);
    }
    this.toggleIsUsed = function () {
        this.isUsed ? this.isUsed = false : this.isUsed = true;
        try {
            if (this.isUsed) {
                this.node.style.backgroundColor = "white";
                this.node.style.color = "rgb(180, 180, 190)";
          
            }
            else {
                this.node.style.backgroundColor = "rgb(6, 123, 194)";
                this.node.style.color = "white";
            }
        }
        catch (err) {
            console.error(`${err}\n"${this.name}" button doesn't exist`);
        }
    }
}

function startGame() {
    
}

function chooseCategories() {
    
}

function createChooseCatElement() {
    let parent = document.createElement('div');
    parent.id = "gameCategoriesContainer";

    for (let i in gameUtilities.categoryButtons) {
        let node = document.createElement('button');
        node.id = gameUtilities.categoryButtons[i].id;
        node.className = "flashCardButton";
        node.addEventListener('click', function () {
            gameUtilities.categoryButtons[i].toggleIsUsed();
        });
    }
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