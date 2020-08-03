//Use to store general form information
let formInfo = {
    lastId: "",
    modalBackgroundQ: document.getElementsByClassName("modalBackground")[0],
    formPositionQ: document.getElementById("formStandin"),//Use to append form of choice
    categoryButtons: [],//buttons with functionality
    categories: [],
    initializeCategoryButtons: function () {
        this.categories.forEach((x) => {
            this.categoryButtons.push(new categoryButton(x));
        })
    }
}

//constructor for object representing filter button with functionality
function categoryButton(categoryString) {
    this.name = categoryString;
    this.isHidden = false;
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
    debugger;
    formInfo.categoryButtons.find(x => x.name == category).toggleHidden();
} 

function toggleAllCategories() {
    formInfo.categoryButtons.forEach((x) => {
        if (x.isHidden) {
            x.toggleHidden();
        }
    })
}

//find nodes via innerText
function queryInnerString(selector, innerTextRegEx) {
    //if (innerTextRegEx.includes("/")) {
    //    innerTextRegEx = innerTextRegEx.replace("\/", "\\/");
    //}
    var elements = document.querySelectorAll(selector);
    return Array.prototype.filter.call(elements, function (element) {
        return RegExp(innerTextRegEx).test(element.innerText);
    });
}

//constructor matching entity on back end
function flashCardData(front, back, category, id) {
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

//takes text from the flash card after hitting edit.
function grabFlashCardText(formID) {
    //these queries were built by the razor page flashcard Id
    let categoryQ = document.getElementById(`cardCatText${formID}`);
    let frontQ = document.getElementById(`cardFrontText${formID}`);
    let backQ = document.getElementById(`cardBackText${formID}`);

    let category = categoryQ.innerText;
    let frontCard = frontQ.innerText;
    let backCard = backQ.innerText;

    let data = new flashCardData(frontCard, backCard, category, formID);

    return data;
}

//get updated flash card info to submit for update
function createUpdatedFC(updateFormID) {
    let category = document.querySelector("#categoryCardInput").value;
    let front = document.querySelector("#frontCardInput").value;
    let back = document.querySelector("#backCardInput").value;

    return new flashCardData(front, back, category, updateFormID);
}

function clearForm(element) {
    while (element.firstChild) {
        element.remove(element.lastChild);
    }
}

function updateFCForm(cardID) {
    if (cardID != formInfo.lastId) {
        formInfo.lastId = cardID;
        let nodeStart = formInfo.formPositionQ;
        if (!nodeStart.firstChild) {
            createForm();
        }
        let frontCardInputQ = document.getElementById('frontCardInput');
        let backCardInputQ = document.getElementById('backCardInput');
        let categoryCardInputQ = document.getElementById('categoryCardInput');
        let cardData = grabFlashCardText(cardID);

        frontCardInputQ.innerText = cardData.Front;
        backCardInputQ.innerText = cardData.Back;
        categoryCardInputQ.value = cardData.Category;
    }

}

//refactor me please---------------------------------------------------------------------------TODO
//Create Update form modal and display it
function createForm(cardID) {

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
    form.className = "updateFCForm";
    frontCardLabel.innerText = "Front";
    frontCardLabel.id = "formFront";
    frontCardInput.type = "text";
    frontCardInput.id = "frontCardInput"

    backCardLabel.innerText = "Back";
    backCardLabel.id = "formBack";
    backCardInput.type = "text";
    backCardInput.id = "backCardInput";
    backDiv.id = "backCardForm";
    backDiv.appendChild(backCardLabel);
    backDiv.appendChild(backCardInput);

    categoryDiv.id = "categoryBanner";
    categoryDiv.appendChild(categoryInput);
    addCategoryOptions(categoryInput);
    categoryInput.value = cardData.Category;
    categoryInput.id = "categoryCardInput";

    submitButton.innerText = "Save Changes";
    submitButton.className = "flashCardButton";
    submitButton.id = "formSubmitButton";
    submitButton.addEventListener("click", function (event) {
        event.preventDefault();
        //send data off to back end
        //
        updateFlashCardDB(cardID);
    })

    //build the rest of the form
    for (i = 0; i < elementArray.length; i++) {
        form.appendChild(elementArray[i]);
    }

    nodeStart.appendChild(form);
  
    toggleModal(true);
}

async function fetchUpdate(url = "", updatedFlashCardData = {}) {
    let response = fetch(url, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedFlashCardData)
    })
    return response;
}

async function fetchCategories() {
    //extract function----------------------------------------------------------------TODO
    let domainArr = window.location.href.split("/");
    let domain = domainArr[0] + "//" + domainArr[2];
    let requestAddress = domain + "/Home/GetCategories";

    let response = fetch(requestAddress, {
        method: "GET",
        headers: {
            "Accept": "application/json"
        }
    })
        .then(response => response.json())
        .then((data) => {
            let jsonData = JSON.parse(data);
            for (let i in jsonData) formInfo.categories.push(jsonData[i]);//store categories from backend
        }).then(function () {
            formInfo.initializeCategoryButtons();
        })
    return response;
}

//update the flashcard in database
async function updateFlashCardDB(cardID) {
    let OK = "200";
    let NotFound = "404";
    let BadRequest = "400";

    //extract function----------------------------------------------------------------TODO
    let domainArr = window.location.href.split('/');
    let domain = domainArr[0] + "//" + domainArr[2];
    let requestAddress = domain + '/Home/UpdateFC';

    let updatedFlashCardData = createUpdatedFC(cardID);


    fetchUpdate(requestAddress, updatedFlashCardData).then(function (response) {
        if (response.status == OK) {
            //add flashcard to the page manually here.
            console.log('It worked, NICE!');
            updateFrontEndFlashCard(cardID, updatedFlashCardData);
        }
        else {
            console.log('yeah that didn\'t work');
        }
    });

    toggleModal(false);
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
        //take this out after animation switch-----------------------------------------------------TODO
        formInfo.modalBackgroundQ.classList.remove("modalBackgroundSwitch");
        formInfo.modalBackgroundQ.style.animationName = "";
    }
}

//initialize page data and buttons
window.onload = function () {
    fetchCategories();
}();