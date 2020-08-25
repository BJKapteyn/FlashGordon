//--------------------------------------------------------Edit Controls------------------------------------------------------------------
//#region

//Use to store general form information
let formInfo = {
    lastId: "",
    modalBackgroundQ: document.getElementsByClassName("modalBackground")[0],
    formPositionQ: document.getElementById("formStandin"),//Use to append form of choice
    categoryButtons: [],//buttons with functionality
    categories: [],
    updateOrNewFormQ: document.getElementById(''),
    initializeCategoryButtons: function () {
        this.categories.forEach((x) => {
            this.categoryButtons.push(new categoryFilterButton(x));
        })
    }
}

//constructor for object representing filter button with functionality
function categoryFilterButton(categoryString) {
    this.name = categoryString;
    this.isHidden = false;//represents if cards of this category are hidden or not
    this.nodeQuery = queryInnerString("h1", categoryString);
    this.buttonQ = document.getElementById(categoryString + "xyz");
    this.toggleHidden = function () {
        this.isHidden ? this.isHidden = false : this.isHidden = true;
        if (this.isHidden) {
            for (let i = 0; i < this.nodeQuery.length; i++) {
                this.nodeQuery[i].parentNode.parentNode.style.display = "none";
                this.buttonQ.style.backgroundColor = "white";
                this.buttonQ.style.color = "rgb(180, 180, 190)";
            }
        }
        else {
            for (let i = 0; i < this.nodeQuery.length; i++) {
                this.nodeQuery[i].parentNode.parentNode.style.display = "inline-block";
                this.buttonQ.style.backgroundColor = "rgb(6, 123, 194)";
                this.buttonQ.style.color = "white";
            }
        }
    }
}

//onclick function of buttons
function toggleCategory(category) {
    formInfo.categoryButtons.find(x => x.name == category).toggleHidden();
} 

function toggleAllCategories() {
    formInfo.categoryButtons.forEach((x) => {
        if (x.isHidden) {
            x.toggleHidden();
        }
    })
}

//find nodes via their innerText
function queryInnerString(selector, innerTextRegEx) {
    var elements = document.querySelectorAll(selector);
    return Array.prototype.filter.call(elements, function (element) {
        return RegExp(innerTextRegEx).test(element.innerText);
    });
}

//constructor matching entity on back end
function flashCard(front, back, category, id) {
    this.Front = front;
    this.Back = back;
    this.Category = category;
    this.Id = id;
    this.IsUsed = true;
}

function addCategoryOptions(htmlSelectElement) {
    for (i = 0; i < formInfo.categories.length; i++) {
        let category = document.createElement('option');
        category.value = formInfo.categories[i];
        category.innerText = formInfo.categories[i];
        htmlSelectElement.appendChild(category);
    }
    
    return htmlSelectElement;//In case I need to append the whole thing elsewhere 
}

//takes text from the flash card after hitting edit or creates blank card or a new flash card if id is null
function getFlashCardText(formID) {
    //these queries were built by the razor page flashcard Id
    let category = "";
    let frontCard = "";
    let backCard = "";
    if (formID >= 0) {
        category = document.getElementById(`cardCatText${formID}`).innerText;
        frontCard = document.getElementById(`cardFrontText${formID}`).innerText;
        backCard = document.getElementById(`cardBackText${formID}`).innerText;
    }

    let data = new flashCard(frontCard, backCard, category, formID);

    return data;
}

//get updated flash card info to submit for update
function createUpdatedFC(updateFormID) {
    let category = document.querySelector("#categoryCardInput").value;
    let front = document.querySelector("#frontCardInput").value;
    let back = document.querySelector("#backCardInput").value;
    updateFormID <= 0 ? updateFormID = null : updateFormID = updateFormID;//for new cards so the primary key is generated

    return new flashCard(front, back, category, updateFormID);
}

function clearForm(formParentElement) {
    while (formParentElement.firstChild) {
        formParentElement.remove(formParentElement.lastChild);
    }
}

function clearElement(element) {
    element.parentNode.removeChild(element);
}

//if modal isn't the intended form or a form hasn't been appended yet, clear the modal
function didSwapModal(modalClassName) {
    let currentModal = formInfo.formPositionQ.firstChild;
    if (currentModal) {
        if (currentModal.className != modalClassName) {
            clearElement(currentModal);
            return true;
        }
        else {
            return false;
        }
    }
    return true;
}

//add card info for new or update card form
function updateFCFormModal(cardID, newOrUpdateURL) {
    if (didSwapModal("FCForm")) {
        formInfo.formPositionQ.appendChild(createUpdateForm());
    }
    formInfo.lastId = cardID;//need to skip some stuff the last id and current match----------------------TODO

    let frontCardInputQ = document.getElementById("frontCardInput");
    let backCardInputQ = document.getElementById("backCardInput");
    let categoryCardInputQ = document.getElementById("categoryCardInput");
    let submitButtonQ = document.getElementById("formSubmitButton");
    let cardData = getFlashCardText(cardID);

    frontCardInputQ.innerText = cardData.Front;
    backCardInputQ.innerText = cardData.Back;
    categoryCardInputQ.value = cardData.Category;

    submitButtonQ.addEventListener("click", function (event) {
        event.preventDefault();
        updateFlashCardDB(cardData, newOrUpdateURL);//send data off to back end
        toggleModal(false);
    });

    toggleModal(true);
}

function deleteFCModal(cardID) {
    if (didSwapModal("yesNoModalContainer")) {
        formInfo.formPositionQ.appendChild(createYesNoModal(cardID));
    }
    toggleModal(true);
}

//Create Update form modal and display it
function createUpdateForm() {
    //create form from scratch
    let form = document.createElement("form");
    let categoryDiv = document.createElement("div");
    let backDiv = document.createElement('div');
    let frontCardLabel = document.createElement("h3");
    let frontCardInput = document.createElement("textarea");
    let backCardLabel = document.createElement("h3");
    let backCardInput = document.createElement("textarea");
    let categoryInput = document.createElement("select");
    let submitButton = document.createElement("button");
    let elementArray = [categoryDiv, frontCardLabel, frontCardInput, backDiv, submitButton];

    //add attributes and text
    form.id = "updateForm";
    form.className = "FCForm";
    frontCardLabel.innerText = "Front";
    frontCardLabel.id = "formFront";
    frontCardInput.type = "text";
    frontCardInput.id = "frontCardInput"
    frontCardInput.required = true;

    backCardLabel.innerText = "Back";
    backCardLabel.id = "formBack";
    backCardInput.type = "text";
    backCardInput.id = "backCardInput";
    backCardInput.required = true;
    backDiv.id = "backCardForm";
    backDiv.appendChild(backCardLabel);
    backDiv.appendChild(backCardInput);

    categoryDiv.id = "categoryBanner";
    categoryDiv.appendChild(categoryInput);
    addCategoryOptions(categoryInput);
    categoryInput.id = "categoryCardInput";
    categoryInput.required = true;

    submitButton.innerText = "Save Changes";
    submitButton.className = "flashCardButton";
    submitButton.id = "formSubmitButton";


    //build the rest of the form
    for (i = 0; i < elementArray.length; i++) {
        form.appendChild(elementArray[i]);
    }

    return form;

}

//create are you sure? modal
function createYesNoModal(cardID) {
    let modalContainer = document.createElement('div');
    let yesNoText = document.createElement('p');
    let buttonContainer = document.createElement('div');
    let yesButton = document.createElement('button');
    //let yesSymbol = document.createElement('span');
    let noButton = document.createElement('button');
    //let noSymbol = document.createElement('span');

    //add attributes and text
    buttonContainer.className = "yesNoButtons";
    modalContainer.className = "yesNoModalContainer";
    modalContainer.id = "modal" + cardID;

    yesNoText.className = "yesNoText";
    yesNoText.innerText = "Are you sure?"
    yesButton.className = "delete flashCardButton";
    yesButton.innerText = "Yes ";
    yesButton.type = "button";
    yesButton.addEventListener("click", function () {
        deleteFlashCard(cardID);
    });
    //yesSymbol.innerHTML = "&#10004";
    noButton.className = "flashCardButton";
    noButton.innerText = "No ";
    noButton.type = "button";
    //noSymbol.innerHTML = "&#10006";
    noButton.addEventListener("click", function () {
        toggleModal(false);
    });

    //build it
    //yesButton.appendChild(yesSymbol);
    //noButton.appendChild(noSymbol);

    buttonContainer.appendChild(noButton);
    buttonContainer.appendChild(yesButton);

    modalContainer.appendChild(yesNoText);
    modalContainer.appendChild(buttonContainer);

    return modalContainer;
}

async function backEndUpdateFC(url = "", updatedFlashCardData = {}) {//update flash card on database
    let response = await fetch(url, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedFlashCardData)
    })
    return response;
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
    return response;
}

//update the flashcard in database
async function updateFlashCardDB(cardData, newOrUpdateFCURL) {
    let OK = "200";
    let NotFound = "404";
    let BadRequest = "400";
    let requestAddress = urlBuilder(newOrUpdateFCURL);
    let updatedFlashCardData = createUpdatedFC(cardData.Id);


    await backEndUpdateFC(requestAddress, updatedFlashCardData).then(function (response) {
        if (response.status == OK) {
            //add flashcard to the page manually here.
            console.log('It worked, NICE!');
            if (cardData.Id != null) {//If it's a update operation, update the front end
                updateFrontEndFlashCard(cardData.Id, updatedFlashCardData);
            }
        }
        else {
            console.log('yeah that didn\'t work');
        }
    });

    toggleModal(false);
}

async function deleteFlashCard(cardID) {
    let requestAddress = urlBuilder(`/Home/DeleteFC`);
    let cardToDeleteData = JSON.stringify({ Id: cardID });
    let cardToDeleteQ = document.getElementById(cardID);
    await fetch(requestAddress, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: cardToDeleteData
    }).then(response => {
        if (response.status == 200) {
            console.log("Success!");
            opacityFadeElement(cardToDeleteQ, 2000, false, true);

        }
        else {
            console.log("Uh oh");
        }
    })
    toggleModal(false);
}

function opacityFadeElement(htmlElement, fadeTimeInMs = 0, forwardsOrBackwards = true, removeAfter = false) {
    htmlElement.style.animationFillMode = forwardsOrBackwards ? "forwards" : "backwards";
    htmlElement.style.animationDuration = `${fadeTimeInMs}ms`;
    htmlElement.style.animationName = "fadeAway";
    if (removeAfter) {
        setTimeout(function () {
            clearElement(htmlElement);
        }, fadeTimeInMs)
    }
}



//update card on DOM
function updateFrontEndFlashCard(cardID, flashCardData) {
    let flashCardQ = document.getElementById(cardID);
    let frontCardQ = flashCardQ.querySelector('.frontText');
    let backCardQ = flashCardQ.querySelector('.backText');
    let categoryQ = flashCardQ.querySelector('.fCardCategory');
    let statusQ = flashCardQ.querySelector('.status');

    frontCardQ.innerText = flashCardData.Front;
    backCardQ.innerText = flashCardData.Back;
    categoryQ.innerText = flashCardData.Category;
    statusQ.innerText = "Updated!";
}

function toggleModal(onOrOff) {
    if (onOrOff) {
        formInfo.formPositionQ.style.display = "block";
        formInfo.modalBackgroundQ.style.display = "block";
        formInfo.modalBackgroundQ.style.animationName = "fadeInModal";

        formInfo.modalBackgroundQ.addEventListener("click", function () {
            toggleModal(false);
        });
    }
    else {
        formInfo.formPositionQ.style.display = "none";
        formInfo.modalBackgroundQ.style.display = "none";
        formInfo.modalBackgroundQ.style.animationName = "";
    }
}

//initialize page data and buttons


//#endregion
//--------------------------------------------------------Game Controls------------------------------------------------------------------
//#region
//let asyncOps = {//------may use this to resolve promises
//    dataIsLoaded: false
//}

let gameUtilities = {
    flashCardView: document.getElementById("gameWindow"),
    bodyView: document.getElementById("gameBody"),
    fcCategoryView: document.getElementById("flashCardCategory"),
    fcContentView: document.getElementById("flashCardContent"),
    allFlashCards: [],
    gameFlashCards: [],
    gameFlashCardsLength: 0,
    categories: [],
    categoryButtons: [],
    selectedCategories: [],
    frontOrBack: true,//used to flip the card
    cardNumber: 0,

    flashCardGame = function () {
        this.fcCategoryView.innerText = this.gameFlashCards[cardNumber].Category;
        this.fcContentView.innerText = this.gameFlashCards[cardNumber].Front;
    },

    nextCard = function () {
        cardNumber++;
        frontOrBack = true;
        flashCardGame();
    }

    populateCatButtons: function () {//create category buttons based on available categories
        for (let i in this.categories) {
            let id = this.categories[i] + "Id";
            let button = new categoryButton(id, this.categories[i]);
            this.categoryButtons.push(button);
        }
    },

    updateButtonLocations: function () {//add button locations after they are added to the page
        if (this.categoryButtons) {
            for (let i in this.categoryButtons) {
                this.categoryButtons[i].updateNodeLocation();
            }
        }
        else {
            console.error("Couldn't update nodes because they don't exist");
        }
    },

    populateSelectedCategories: function () {
        for (let i in this.categoryButtons) {
            if (this.categoryButtons[i].selected) {
                this.selectedCategories.push(this.categoryButtons[i].name);
            }
        }
    }
}

function categoryButton(_id, _name) {//hold button location and functionality
    this.id = _id;
    this.selected = false;
    this.name = _name;
    this.elementNode = document.getElementById("");//initialize to falsy value for checks
    this.updateNodeLocation = function () {//used after buttons are added to page
        this.elementNode = document.getElementById(`${this.id}`);//-------------------------------------------------stopped here doesn't work
    }
    this.toggleSelected = function () {
        this.selected ? this.selected = false : this.selected = true;
        this.styleCategory();
    }
    this.styleCategory = function () {
        try {
            if (!this.selected) {
                this.elementNode.style.backgroundColor = "white";
                this.elementNode.style.color = "rgb(180, 180, 190)";

            }
            else {
                this.elementNode.style.backgroundColor = "rgb(6, 123, 194)";
                this.elementNode.style.color = "white";
            }
        }
        catch (err) {
            console.error(`${err}\n"${this.name}" button doesn't exist`);
        }
    }
}

function startGame() {//game starts here
    let startButton = document.getElementById("startButton");
    let chooseCategoryView = document.createElement("div");
    let chooseCategoryButton = document.createElement("button");

    chooseCategoryView.id = "chooseCategoryView";
    chooseCategoryButton.className = "flashCardButton";
    chooseCategoryButton.id = "continueButton";
    chooseCategoryButton.type = "button";
    chooseCategoryButton.innerText = "Continue";

    gameUtilities.bodyView.appendChild(createChooseCatElements());
    gameUtilities.bodyView.appendChild(chooseCategoryButton); 
    gameUtilities.flashCardView.appendChild(chooseCategoryView); 
    gameUtilities.updateButtonLocations();//update button's locations for slection functionality

    fadeElement(startButton, true, "fadeOutModal");
    setTimeout(function () {
        clearElement(startButton);
        gameUtilities.categoryButtons.forEach(x => x.styleCategory());
        fadeInAllChildren("gameCategoriesContainer");//fade in the category buttons
    }, 1000);
    document.getElementById("gameTitle").innerText = "Choose Categories";

    chooseCategoryButton.addEventListener("click", function () {
        chooseCategories();
    });
}

function filterCards(flashCard) {
    if (gameUtilities.selectedCategories.includes(flashCard.Category)) {
        return true;
    }
    return false;
}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function chooseCategories() {//creates list of flashcards to show based on selected categories
    let catButtons = document.getElementById("gameCategoriesContainer");
    let continueButton = document.getElementById("continueButton");

    gameUtilities.populateSelectedCategories();
    addFlashCardsToGame();
    shuffle(gameUtilities.gameFlashCards);

    fadeElement(continueButton, true, "fadeOutModal");
    fadeElement(catButtons, true, "fadeOutModal");

    setTimeout(function () {//wait for animation
        gameUtilities.flashCardGame();
    }, 1000);
}

function addFlashCardsToGame() {
    gameUtilities.gameFlashCards = gameUtilities.allFlashCards.filter(filterCards);//create new array of flashcards of selected categories
    gameUtilities.gameFlashCardsLength = gameUtilities.gameFlashCards.length;
}

function createChooseCatElements() {
    let parent = document.createElement('div');
    parent.id = "gameCategoriesContainer";

    for (let i in gameUtilities.categoryButtons) {
        let node = document.createElement('button');
        node.id = gameUtilities.categoryButtons[i].id;
        node.className = "flashCardButton categoryButton";
        node.textContent = gameUtilities.categoryButtons[i].name;
        node.addEventListener('click', function () {
            gameUtilities.categoryButtons[i].toggleSelected();
        });

        parent.appendChild(node);
    }

    return parent;
}

async function getFlashCards() {
    let URL = urlBuilder('/Home/GetAllFlashCards');

    await fetch(URL, {
        method: "GET",
    })
        .then(response => jsonData = response.json())
        .then(data => {
            for (let i in data) {
                let newFC = new flashCard(data[i].Front, data[i].Back, data[i].Category, data[i].Id);
                gameUtilities.allFlashCards.push(newFC);
            }
        });
}

async function getCategories(storageArray) {
    let requestAddress = urlBuilder("/Home/GetCategories");

    await fetch(requestAddress, {
        method: "GET",
        headers: {
            "Accept": "application/json"
        }
    })
        .then(response => response.json())
        .then((data) => {
            let jsonData = JSON.parse(data);
            for (let i in jsonData) storageArray.push(jsonData[i]);//store categories from backend
        })
}

function flipCard() {

}
//#endregion
//-----------------------------------------------------Animation Stuff------------------------------------------------------------------
//#region
function fadeElement(element, forwardsOrReverse = false, animationName = "") {
    element.style.animationDuration = "1s";
    element.style.animationFillMode = forwardsOrReverse ? "forwards" : "backwards";
    element.style.animationName = animationName;
}

function fadeInAllChildren(parentId) {
    let parent = document.getElementById(parentId);
    let parentLength = parent.children.length;
    if (parentLength > 0) {
        let i = 0;
        let interval = setInterval(function () {
            fadeElement(parent.children.item(i), true, "fadeInModal");
            if (i == parentLength - 1) {
                clearInterval(interval);
            }
            i++;
        });
    }
    else {
        console.error("No categories to choose from");
    }
}

function fadeInAllElements(elementsClassName) {
    let elements = document.getElementsByClassName(elementsClassName);

    if (elements.length > 0) {
        var i = 0;
        let interval = setInterval(function () {
            fadeElement(elements.item(i), true, "fadeIn");
            if (i == elements.length - 1) {
                clearInterval(interval);
            }
            i++;
        }, 50);
        //Possibly use this to interrupt the animation
        return interval;
    }
}
//#endregion
//-----------------------------------------------------------Utilities------------------------------------------------------------------
//#region
function urlBuilder(uriString) {
    let domainArr = window.location.href.split('/');
    let domain = domainArr[0] + "//" + domainArr[2];
    return (domain + uriString);
}
//#endregion