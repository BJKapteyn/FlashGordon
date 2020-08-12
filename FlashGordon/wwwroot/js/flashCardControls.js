function flashCard(front, back, category, id) {
    this.Front = front;
    this.Back = back;
    this.Category = category;
    this.Id = id;
    this.IsUsed = true;
}

function urlBuilder(uriString) {
    let domainArr = window.location.href.split('/');
    let domain = domainArr[0] + "//" + domainArr[2];
    return (domain + uriString);
}

function startGame() {
    
}

async function getFlashCards() {
    let URL = urlBuilder('/Home/GetAllFlashCards');
    await fetch(URL, {

    }).then(response => );
}