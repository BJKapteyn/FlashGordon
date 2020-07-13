//use to store previous form information 
let formInfo = {
    lastId: ""
}

function flashCardData(front, back, category) {
    this.Front = front;
    this.Back = back;
    this.Category = category;
}

//refactor me please--------------------------------------------------TODO
function createForm(cardID) {
    let nodeStart = document.getElementById("formStandin");
    //clear previous form if clicking on new card to update or skip function if clicking on the same card
    if (cardID != formInfo.lastId) {
        while (nodeStart.firstChild) {
            nodeStart.removeChild(nodeStart.lastChild);
        }
    }
    else {
        return;
    }

    let cardData = grabText(cardID);
    //turn it into a number to submit to backend----------------------------TODO
    let idInt = parseInt(cardID);
    //create form from scratch
    let form = document.createElement("form");
    let frontCardLabel = document.createElement("p");
    let frontCardInput = document.createElement("input");
    let backCardLabel = document.createElement("p");
    let backCardInput = document.createElement("input");
    let categoryLabel = document.createElement("p");
    let categoryInput = document.createElement("input");
    let submitButton = document.createElement("button");
    let elementArray = [frontCardLabel, frontCardInput, backCardLabel, backCardInput, categoryLabel, categoryInput, submitButton];

    formInfo.LastId = cardID;
    form.id = "updateForm";
    frontCardLabel.innerText = "Front";
    frontCardLabel.id = "formFront";
    frontCardInput.type = "text";
    frontCardInput.value = cardData.Front;

    backCardLabel.innerText = "Back";
    backCardLabel.id = "formBack";
    backCardInput.type = "text";
    backCardInput.value = cardData.Back;

    categoryLabel.innerText = "Category";
    categoryLabel.id = "formCategory";
    //turn this into radio later---------------------------------------------------TODO
    categoryInput.type = "text";
    categoryInput.value = cardData.Category;

    submitButton.innerText = "Submit";
    //clear all previous nodes when selecting a new card
    //build the form
    for (i = 0; i < elementArray.length; i++) {
        form.appendChild(itemArray[i]);
    }
    nodeStart.appendChild(form);
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
    let data = new flashCardData(frontCard, backCard, category);

    return data;
}