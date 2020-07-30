//use to store previous form information 
let formInfo = {
    lastId: "",
    modalBackgroundQ: document.getElementsByClassName("modalBackground")[0],
    formPositionQ: document.getElementById("formStandin")
}

function flashCardData(front, back, category, id) {
    this.Front = front;
    this.Back = back;
    this.Category = category;
    this.Id = id;
    this.IsUsed = false;
}

//takes text from the flash card after hitting edit.
function grabFlashCardText(formID) {
    //these were built by the razor page flashcard Id
    let categoryQ = document.getElementById(`cardCatText${formID}`)
    let frontQ = document.getElementById(`cardFrontText${formID}`)
    let backQ = document.getElementById(`cardBackText${formID}`)

    let category = categoryQ.innerText;
    let frontCard = frontQ.innerText;
    let backCard = backQ.innerText;

    let data = new flashCardData(frontCard, backCard, category, formID);

    return data;
}

//get updated flash card info to submit for update
function createUpdatedFC(updateFormID) {
    let category = document.querySelector("#categoryCardInput").value;
    let front = document.querySelector('#frontCardInput').value;
    let back = document.querySelector('#backCardInput').value;

    return new flashCardData(front, back, category, updateFormID);
}

//refactor me please---------------------------------------------------------------------------TODO
//Create Update form modal and display it
function createForm(cardID) {
    let nodeStart = formInfo.formPositionQ;
    if (cardID != formInfo.lastId) {
        //clear previous form if clicking on new card to update, or skip function if clicking on the same card
        while (nodeStart.firstChild) {
            nodeStart.removeChild(nodeStart.lastChild);
        }

        let cardData = grabFlashCardText(cardID);

        //create form from scratch
        let form = document.createElement("form");
        let frontCardLabel = document.createElement("p");
        let frontCardInput = document.createElement("textarea");
        let backCardLabel = document.createElement("p");
        let backCardInput = document.createElement("textarea");
        let categoryLabel = document.createElement("p");
        let categoryInput = document.createElement("textarea");
        let submitButton = document.createElement("button");
        let elementArray = [categoryLabel, categoryInput, frontCardLabel, frontCardInput, backCardLabel, backCardInput, submitButton];

        //store the last id to skip this if selecting the same card twice
        formInfo.LastId = cardID;
        //add attributes and text
        form.id = "updateForm";
        form.className = "updateFCForm";
        frontCardLabel.innerText = "Front";
        frontCardLabel.id = "formFront";
        frontCardInput.type = "text";
        frontCardInput.value = cardData.Front;
        frontCardInput.id = "frontCardInput"

        backCardLabel.innerText = "Back";
        backCardLabel.id = "formBack";
        backCardInput.type = "text";
        backCardInput.value = cardData.Back;
        backCardInput.id = "backCardInput";

        categoryLabel.innerText = "Category";
        categoryLabel.id = "formCategory";
        //turn this into select later---------------------------------------------------TODO
        categoryInput.type = "text";
        categoryInput.value = cardData.Category;
        categoryInput.id = "categoryCardInput"

        submitButton.innerText = "Save Changes";
        submitButton.addEventListener('click', function (event) {
            event.preventDefault();
            //send data off to back end
            //
            updateFlashCardDB(cardID);
        })
        //build the form
        for (i = 0; i < elementArray.length; i++) {
            form.appendChild(elementArray[i]);
        }
            nodeStart.appendChild(form);
    }
    else if (cardID == formInfo.lastId) {
        //May use later
        return false;
    }
    toggleModal(true);
}

//Get updated input fields and send it off to backend to update flash card 
//function submitAJAX(cardId) {
//    updatedCard = new flashCardData;
//    updatedCard.Front = document.getElementById('frontCardInput').value;
//    updatedCard.Back = document.getElementById('backCardInput').value;
//    updatedCard.Category = document.getElementById('categoryCardInput').value;
//    updatedCard.Id = cardId;

//    AJAXUpdate(updatedCard);
//}

async function fetchUpdate(url = '', updatedFlashCardData = {}) {
    let response = fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedFlashCardData)
    })
    return response;
}

//update the flashcard in database
async function updateFlashCardDB(cardID) {
    let OK = "200";
    let NotFound = "404";
    let BadRequest = "400";

    let domainArr = window.location.href.split('/');
    let domain = domainArr[0] + "//" + domainArr[2];
    let requestAddress = domain + '/Home/UpdateFC';

    let updatedFlashCardData = createUpdatedFC(cardID);


    await fetchUpdate(requestAddress, updatedFlashCardData).then(function (response) {
        if (response.status == OK) {
            //add flashcard to the page manually here.
            console.log('It worked, NICE!');
            updatePageFlashCard(cardID, updatedFlashCardData);
        }
        else {
            console.log('yeah that didn\'t work');
        }
        console.log(response);
    });

    toggleModal(false);
}

//update card on the actual page
function updatePageFlashCard(cardID, flashCardData) {
    debugger;
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