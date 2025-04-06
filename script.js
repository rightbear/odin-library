const myLibrary = [];

function Book(author, title, pages, alreadyRead) {
    if (!new.target) {
        throw Error("You must use the 'new' operator to call the constructor");
    }
    this.id = crypto.randomUUID();
    this.author = author;
    this.title = title;
    this.pages = pages;
    this.alreadyRead = alreadyRead;
    this.info = function(){
        let result = `${this.title} by ${this.author}, ${this.pages} pages, `;
        if (alreadyRead == "read_no"){
            result += "not read yet";
        }
        else {
            result += "have read";
        }
        return result;
    };
}

function addBookToLibrary(author, title, pages, alreadyRead) {
    const newBook = new Book(author, title, pages, alreadyRead);
    myLibrary.push(newBook);
}

function loopArrayAndDisplay(){
    myLibrary.forEach((value) => {console.log(value.info())});
}


/////////////////////////////////////////////////////////////////

const formButtons = document.querySelectorAll("dialog form button");
const showButton = document.querySelector("#showDialogBtn");
const bookDialog = document.querySelector("#bookDialog");
const dialogForm = document.querySelector('#dialogForm');

const outputBox = document.querySelector("output");

const confirmBtn = bookDialog.querySelector("#confirmBtn");
const cancelBtn = bookDialog.querySelector("#cancelBtn");

const bookList = document.querySelector(".bookList");
let bookNum = 0;

// "Add a new book!" button opens the dialog modally
showButton.addEventListener("click", () => {
    bookDialog.showModal();
});


//////////////////////////////////////////////////
  
bookDialog.addEventListener("cancel", (e) => {
    outputBox.value = "dialog was canceled with ESC";
});

cancelBtn.addEventListener("click", (e) => {
    outputBox.value = "cancel buttin is clicked";
});

confirmBtn.addEventListener("click", (e) => {
    outputBox.value = "ok buttin is clicked";
});


dialogForm.addEventListener('submit', function(event) {
    const submitBtn = event.submitter;

    // We don't want to submit this fake form
    event.preventDefault();

    // Have to send the submitter value of form, as the returnValue of dialog.
    bookDialog.close(submitBtn.value);
});

bookDialog.addEventListener("close", (e) => {

    if(bookDialog.returnValue == 'confrm'){
        // Retrieve data in form
        const author = document.querySelector('#author');
        const title = document.querySelector('#title');
        const pages = document.querySelector('#pages');
        const alreadyRead = document.querySelector('input[name="read"]:checked');
                
        let result = `${title.value} by ${author.value}, ${pages.value} pages, `
        if (alreadyRead.value == "read_no"){
            result += "not read yet";
        }
        else {
            result += "have read";
        }
        console.log(result);

        addBookToLibrary(author.value, title.value, pages.value, alreadyRead.value);


        if(bookNum == 0){
            while (bookList.firstChild) {
                bookList.removeChild(bookList.firstChild);
            }
            createTable()
        }

        addNewRow(author.value, title.value, pages.value, alreadyRead.value)
    }
    
    dialogForm.reset();
});

/////////////////////////////////


// click outside region of modal to close dialog
bookDialog.addEventListener('click', (e) => {
    const dialogDimensions = bookDialog.getBoundingClientRect();
    if (
      e.clientX < dialogDimensions.left ||
      e.clientX > dialogDimensions.right ||
      e.clientY < dialogDimensions.top ||
      e.clientY > dialogDimensions.bottom
    ) {
        bookDialog.close();
    }
});

// If the new book is successfully added and the number of books
// become nonzero in library, the table of library will be created  
function createTable() {

    let headers = ["Index", "Author", "Title", "Number of pages", "Already read?", "Delete"];
    const libraryTable = document.createElement("TABLE");  //makes a table element for the page
    libraryTable.setAttribute("id", "libraryTable");

    let libraryHeader = libraryTable.createTHead();
    let libraryHeaderRow = libraryHeader.insertRow(0);
    for(let i = 0; i < headers.length; i++) {
        libraryHeaderRow.insertCell(i).innerHTML = headers[i];
    }
    bookList.append(libraryTable);
}

// If the new book is successfully added, the table of library 
// will increase 1 row and the content of new row is related to 
// the new book
function addNewRow(author, title, pages, alreadyRead) {
    bookNum += 1;
    const libraryTable = document.getElementById("libraryTable");
    let newRow = libraryTable.insertRow(bookNum);
    newRow.insertCell(0).textContent = `${bookNum}`;
    newRow.insertCell(1).textContent = `${author}`;
    newRow.insertCell(2).textContent = `${title}`;
    newRow.insertCell(3).textContent = `${pages}`;
    newRow.insertCell(4).textContent = `${alreadyRead}`;
    newRow.insertCell(5).innerHTML = "<img src='./pictures/trash-can.svg' alt='delete-icon'>";
}