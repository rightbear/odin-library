const myLibrary = [];

function Book(author, title, pages, read) {
    if (!new.target) {
        throw Error("You must use the 'new' operator to call the constructor");
    }
    this.id = crypto.randomUUID();
    this.author = author;
    this.title = title;
    this.pages = pages;
    this.read = read;
    this.info = function(){
        let result = `${this.title} by ${this.author}, ${this.pages} pages, `;
        if (read == "read_no"){
            result += "not read yet";
        }
        else {
            result += "have read";
        }
        return result;
    };
}

function addBookToLibrary(author, title, pages, read) {
    const newBook = new Book(author, title, pages, read);
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
        const read = document.querySelector('input[name="read"]:checked');
                
        let result = `${title.value} by ${author.value}, ${pages.value} pages, `
        if (read.value == "read_no"){
            result += "not read yet";
        }
        else {
            result += "have read";
        }
        console.log(result);

        addBookToLibrary(author.value, title.value, pages.value, read.value);
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