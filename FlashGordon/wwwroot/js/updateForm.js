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

    //Assign the data names
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

//refactor me please--------------------------------------------------TODO
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
        let elementArray = [frontCardLabel, frontCardInput, backCardLabel, backCardInput, categoryLabel, categoryInput, submitButton];

        //will use this to look up the card's id in the database
        formInfo.LastId = cardID;
        //add attributes and text
        form.id = "updateForm" + cardID;
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
        //turn this into radio later---------------------------------------------------TODO
        categoryInput.type = "text";
        categoryInput.value = cardData.Category;
        categoryInput.id = "categoryCardInput"

        submitButton.innerText = "Save Changes";
        submitButton.addEventListener('click', function (event) {
            debugger;
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
            console.log('It worked, NICE!')
        }
        else {
            console.log('yeah that didn\'t work');
        }
        console.log(response);
    });

    toggleModal(false);
}

function updatePageFlashCard(cardID) {
    const flashCardQ = document.getElementById(cardID);

}

//function AJAXUpdate(flashCardDataIn/*flashCardData Object*/) {
//    let OK = "200";
//    let NotFound = "404";
//    let BadRequest = "400";
//    let request = new XMLHttpRequest();
//    let domainArr = window.location.href.split('/');
//    let domain = domainArr[0] + "//" + domainArr[2];
//    //Make sure parameters match the IActionResult parameters! Also see a couple lines below.
//    let requestAddress = domain + `/Home/UpdateFC?front=${flashCardDataIn.Front}&back=${flashCardDataIn.Back}&category=${flashCardDataIn.Category}&id=${flashCardDataIn.Id}`;

//    //Figure out POST AJAX please
//    //let body = JSON.stringify({
//    //    front: flashCardDataIn.Front,
//    //    back: flashCardDataIn.Back,
//    //    category: flashCardDataIn.Category,
//    //    id: flashCardDataIn.Id       
//    //});

//    request.open("POST", requestAddress, true);
//    request.setRequestHeader("Content-Type", "application/json; charset=utf-8");
//    //uncomment when POST method is fixed
//    request.send(/*body*/);

//    request.onreadystatechange = function () {
//        if (this.readyState === XMLHttpRequest.DONE && this.status === OK) {
//            console.log("We did it!");
//            toggleModal(false);
//        }
//        else if (this.readyState === XMLHttpRequest.DONE && this.status === BadRequest) {
//            console.log("Made it to the action result but didn't process correctly");
//        }
//        else {
//            console.log("Not Even Close");
//        }
//    }

//}


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
        formInfo.modalBackgroundQ.classList.remove("modalBackgroundSwitch");
        formInfo.modalBackgroundQ.style.animationName = "";
    }
}