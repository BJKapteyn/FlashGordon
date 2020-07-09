
//refactor me please--------------------------------------------------TODO
function createForm(formID) {

    let nodeStart = document.getElementById("formStandin");
    let cardData = grabText(formID);
    //turn it into a number to submit
    let idInt = parseInt(formID);

    let form = document.createElement("form");
    let frontCardLabel = document.createElement("p");
    let frontCardInput = document.createElement("input");
    let backCardLabel = document.createElement("p");
    let backCardInput = document.createElement("input");
    let categoryLabel = document.createElement("p");
    let categoryInput = document.createElement("input");
    let submitButton = document.createElement("button");
    let itemArray = [frontCardLabel, frontCardInput, backCardLabel, backCardInput, categoryLabel,categoryInput, submitButton];

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
    //clear all previous nodes
    if (idInt != formID) {
        while (nodeStart.firstChild) {
            nodeStart.removeChild(nodeStart.lastChild);
        }
    }

    for (i = 0; i < itemArray.length; i++) {
        form.appendChild(itemArray[i]);
    }
    nodeStart.appendChild(form);
}

//takes text form the card element returns it
function grabText(formID) {
    let startPoint = document.getElementById(formID);
    let startPointKids = startPoint.children;
    let otherKids = startPointKids[1].children;

    let category = startPointKids[0].innerText;
    let frontCard = otherKids[1].innerText;
    let backCard = otherKids[3].innerText;

    //Assign the data names
    let data = {
        Category: category,
        Front: frontCard,
        Back: backCard
    }

    return data;
}