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
        if (alreadyRead){
            result += "have read";
        }
        else {
            result += "not read yet";
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

/*
bookDialog.addEventListener("cancel", (e) => {
    outputBox.value = "dialog was canceled with ESC";
});

cancelBtn.addEventListener("click", (e) => {
    outputBox.value = "cancel buttin is clicked";
});

confirmBtn.addEventListener("click", (e) => {
    outputBox.value = "ok buttin is clicked";
});
*/

// If user click "OK" button in form of dialog, it will triger 
// a close behavior for dialog
dialogForm.addEventListener('submit', function(event) {
    const submitBtn = event.submitter;

    // We don't want to submit this fake form
    event.preventDefault();

    // Have to send the submitter value of form, as the returnValue of dialog.
    bookDialog.close(submitBtn.value);
});

// If the close behavior for dialog is triggered, it will create form
// or add a new row in form when "Ok" is clicked before form closed
bookDialog.addEventListener("close", (e) => {

    if(bookDialog.returnValue == 'confrm'){
        // Retrieve data in form
        const author = document.querySelector('#author');
        const title = document.querySelector('#title');
        const pages = document.querySelector('#pages');
        const alreadyRead = document.querySelector('input[name="read"]:checked');
                
        let result = `${title.value} by ${author.value}, ${pages.value} pages`;
        let alreadyReadResult = (alreadyRead.value == "read_yes") ? true : false;

        console.log(result);

        addBookToLibrary(author.value, title.value, pages.value, alreadyReadResult);

        if(bookNum == 0){
            while (bookList.firstChild) {
                bookList.removeChild(bookList.firstChild);
            }
            createTable()
        }

        addNewRow(author.value, title.value, pages.value, alreadyReadResult)
    }

    dialogForm.reset();
});

/////////////////////////////////


// Users can click outside region of modal to close dialog
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
function addNewRow(author, title, pages, alreadyReadResult) {
    bookNum += 1;
    const libraryTable = document.querySelector("#libraryTable");
    // The position of new row is the next row in the end of table
    let newRow = libraryTable.insertRow(bookNum);
    // Setting cells of the new row
    newRow.insertCell(0).textContent = `${bookNum}`;
    newRow.insertCell(1).textContent = `${author}`;
    newRow.insertCell(2).textContent = `${title}`;
    newRow.insertCell(3).textContent = `${pages}`;
    // The data attributes in cell4 and cell5 (data-readresult-rows, data-deleteicon-rows)
    // indicates the row index nuber of the current row
    let cell4 = newRow.insertCell(4);
    cell4.innerHTML = alreadyReadResult
                                    ? "<input type='checkbox' checked/>"
                                    : "<input type='checkbox'/>";
    cell4.setAttribute("data-readresult-rows", bookNum);
    let cell5 = newRow.insertCell(5);
    cell5.innerHTML = "<img src='./pictures/trash-can.svg' alt='delete-icon'>";
    cell5.setAttribute("data-deleteicon-rows", bookNum);
}

// if the deletion icon in specific row is clicked, the row will be deelted
bookList.addEventListener('click', function (event){
    let target = event.target;

    if (document.querySelector("#libraryTable") != null) {
        const libraryTableHead = document.querySelector("#libraryTable thead");
        const readResultCheckboxes = document.querySelectorAll("[data-readresult-rows]");
        const deleteicons = document.querySelectorAll("[data-deleteicon-rows]");

        if((target.parentNode).dataset.deleteiconRows){
            // Retrive the index of row from the data attribute(data-deleteicon-rows)
            // in the container of clicked deletion icon
            const cellNum = Number((target.parentNode).dataset.deleteiconRows);
            const currentTableRow = document.querySelector(`#libraryTable thead tr:nth-child(${cellNum+1})`);
            
            // delete the specific row in the table
            libraryTableHead.removeChild(currentTableRow);
            // delete the corresponding object of row in array
            myLibrary.splice(cellNum-1, 1);
            

            // if there are remaining rows below the deleted row after the deletion,
            // update the row information;
            if(cellNum != bookNum){
                updateCells(cellNum);
            }

            bookNum -= 1;

            // if there are no rows after deletion, display original message indicating
            // library is empty (the deleted row is the ONLY row in the table)
            if(bookNum == 0){
                showEmptyMsg()
            }
        }
    }
});


// Update the information of the index number, and update values of two data attributes
// The values will be the new row index of current row
function updateCells(cellNum){
    const updatedTableRows = document.querySelectorAll(`#libraryTable thead tr:nth-child(n + ${cellNum+1})`);

    if(updatedTableRows){
        updatedTableRows.forEach((updatedTableRow) => {
            const indexCell = updatedTableRow.querySelector("td:first-child");
            const readCell = updatedTableRow.querySelector("td:nth-child(5)");
            const deleteCell = updatedTableRow.querySelector("td:nth-child(6)");
            let newIndex = Number(indexCell.textContent) - 1;

            indexCell.textContent = `${newIndex}`;
            readCell.dataset.readresultRows = newIndex;
            deleteCell.dataset.deleteiconRows = newIndex;
        });
    }
}

//如果table為空，顯示原版的span
//根據already read 是否被打勾來切換顏色
//根據already read 是否被打勾來切換array的read
function showEmptyMsg(){

}