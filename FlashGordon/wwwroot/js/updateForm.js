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
}

//takes text from the card element and returns it
function grabText(formID) {
    let startPoint = document.getElementById(formID);
    let startPointKids = startPoint.children;
    let otherKids = startPointKids[1].children;

    let category = startPointKids[0].innerText;
    let frontCard = otherKids[1].innerText;
    let backCard = otherKids[3].innerText;

    //Assign the data names
    let data = new flashCardData(frontCard, backCard, category, formID);

    return data;
}

//refactor me please--------------------------------------------------TODO
function createForm(cardID) {
    let nodeStart = formInfo.formPositionQ;
    //clear previous form if clicking on new card to update or skip function if clicking on the same card
    if (cardID != formInfo.lastId) {
        while (nodeStart.firstChild) {
            nodeStart.removeChild(nodeStart.lastChild);
        }
    }
    else {
        return false;
    }

    let cardData = grabText(cardID);
    let idInt = parseInt(cardID);

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

    //add attributes
    formInfo.LastId = cardID;
    //will use this to look up the card's id in the database
    form.id = cardID;
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
    submitButton.addEventListener('click', function(event) {
        event.preventDefault();
        submitAJAX(cardID);
    })
    //build the form
    for (i = 0; i < elementArray.length; i++) {
        form.appendChild(elementArray[i]);
    }
    nodeStart.appendChild(form);
    toggleModal(true);
}

//Get updated input fields and send it off to backend to update flash card 
function submitAJAX(cardId) {
    updatedCard = new flashCardData;
    updatedCard.Front = document.getElementById('frontCardInput').value;
    updatedCard.Back = document.getElementById('backCardInput').value;
    updatedCard.Category = document.getElementById('categoryCardInput').value;
    updatedCard.Id = cardId;

    AJAXUpdate(updatedCard);
}

function AJAXUpdate(flashCardDataIn/*flashCardData Object*/) {
    let OK = "200";
    let NotFound = "404";
    let BadRequest = "400";
    let request = new XMLHttpRequest();
    let domainArr = window.location.href.split('/');
    let domain = domainArr[0] + "//" + domainArr[2];
    //Make sure parameters match the IActionResult parameters!
    let requestAddress = domain + `/Home/UpdateFC?front=${flashCardDataIn.Front}&back=${flashCardDataIn.Back}&category=${flashCardDataIn.Category}&id=${flashCardDataIn.Id}`;

    //
    //let body = JSON.stringify({
    //    front: flashCardDataIn.Front,
    //    back: flashCardDataIn.Back,
    //    category: flashCardDataIn.Category,
    //    id: flashCardDataIn.Id       
    //});

    request.open("POST", requestAddress, true);
    request.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    request.send(body);

    request.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE && this.status === OK) {
            console.log("We did it!")
        }
        else if (this.readyState === XMLHttpRequest.DONE && this.status === BadRequest) {
            console.log("Made it to the action result but didn't process correctly");
        }
        else {
            console.log("Not Even Close");
        }
    }

}


function toggleModal(onOrOff) {
    if (onOrOff) {
        formInfo.formPositionQ.style.display = "block";
        formInfo.modalBackgroundQ.style.display = "block";
        formInfo.modalBackgroundQ.style.animationName = "fadeIn";

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