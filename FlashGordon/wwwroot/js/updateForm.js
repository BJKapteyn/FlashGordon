//use to store previous form information 
let formInfo = {
    lastId: "",
    modalBackgroundQ: document.getElementsByClassName("modalBackground")[0],
    formPositionQ: document.getElementById("formStandin")
}

function flashCardData(front, back, category) {
    this.Front = front;
    this.Back = back;
    this.Category = category;
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
        return;
    }

    let cardData = grabText(cardID);
    //turn it into a number to submit to backend----------------------------TODO
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

    submitButton.innerText = "Save Changes";
    //build the form
    for (i = 0; i < elementArray.length; i++) {
        form.appendChild(elementArray[i]);
    }
    nodeStart.appendChild(form);
    toggleModal(true);
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

function toggleModal(onOrOff) {
    if (onOrOff) {
        debugger;
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