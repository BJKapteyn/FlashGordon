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
            this.categoryButtons.push(new categoryButton(x));
        })
    }
}

//constructor for object representing filter button with functionality
function categoryButton(categoryString) {
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
function createFC(updateFormID) {
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
    debugger;
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
        debugger;
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

async function backEndUpdateFC(url = "", updatedFlashCardData = {}) {
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
    debugger;
    let OK = "200";
    let NotFound = "404";
    let BadRequest = "400";
    let requestAddress = urlBuilder(newOrUpdateFCURL);
    let updatedFlashCardData = createFC(cardData.Id);


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
    debugger;
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
            debugger;
            console.log("Success!");
            fadeElementOut(cardToDeleteQ, 2000);

        }
        else {
            console.log("Uh oh");
        }
    })
    toggleModal(false);
}

function fadeElementOut(htmlElement, fadeTimeInMs) {
    htmlElement.style.animationFillMode = "forwards";
    htmlElement.style.animationDuration = `${fadeTimeInMs}ms`;
    htmlElement.style.animationName = "fadeAway";
    setTimeout(function () {
        clearElement(htmlElement);
    }, fadeTimeInMs)
}

function urlBuilder(uriString) {
    let domainArr = window.location.href.split('/');
    let domain = domainArr[0] + "//" + domainArr[2];
    return (domain + uriString);
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
window.onload = function () {
    getCategories(formInfo.categories).then(formInfo.initializeCategoryButtons());
}();