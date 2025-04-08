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
        let result = `${this.title} by ${this.author}, ${this.pages} pages`; 
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
let readedBookNum = 0;
let unReadedBookNum = 0;

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

/////////////////////////////////////////////////////////////////

// "Add a new book!" button opens the dialog modally
showButton.addEventListener("click", () => {
    bookDialog.showModal();
});

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
            createTable();
            createProgressBar();
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
        bookDialog.returnValue = "cancel";
        bookDialog.close();
    }
});


// If the new book is successfully added and the number of books
// increases from zero to nonzero in library, the table of library will be created  
function createTable() {

    // Make caption with main information of table
    // The caption is not positioned in the table for the scrollable design
    const tableSpan = document.createElement("span");
    tableSpan.setAttribute("id", "tableSpan");
    tableSpan.textContent = "The information of books in library"

    // Make a div container for the scrollableTable design
    const tableContainer = document.createElement("div");
    tableContainer.setAttribute("id", "scrollableTable");

    // Make the table
    let headers = ["Index", "Author", "Title", "Number of pages", "Already read?", "Delete"];
    const libraryTable = document.createElement("TABLE");  //makes a table element for the page
    libraryTable.setAttribute("id", "libraryTable");

    let libraryHeader = libraryTable.createTHead();
    let libraryHeaderRow = libraryHeader.insertRow(0);
    for(let i = 0; i < headers.length; i++) {
        let newThElement = libraryHeaderRow.insert_th_Cell(i);
        newThElement.innerHTML = headers[i];
        newThElement.setAttribute("scope", "col");
    }

    libraryTable.createTBody();
    
    tableContainer.append(libraryTable);
    bookList.appendChild(tableSpan);
    bookList.appendChild(tableContainer);
}

function createProgressBar(){
    const prgressInfo = document.createElement("div");
    prgressInfo.setAttribute("id", "prgressInfo");

    const prgressBarLabel = document.createElement("label");
    prgressBarLabel.setAttribute("for", "reading");
    prgressBarLabel.textContent = "Reading progress: 0 / 0";

    const prgressBar = document.createElement("progress");
    prgressBar.setAttribute("id", "reading");
    prgressBar.setAttribute("max", "100");
    prgressBar.setAttribute("value", "0");

    bookList.appendChild(prgressInfo);
    prgressInfo.appendChild(prgressBarLabel);
    prgressInfo.appendChild(prgressBar);
}

// Call thus function insert <th> in the table instead of <td>
HTMLTableRowElement.prototype.insert_th_Cell = function(index) 
  {
  let cell = this.insertCell(index);
  let c_th = document.createElement('th');
  cell.replaceWith(c_th);
  return c_th;
}

// If the new book is successfully added, the table of library 
// will increase 1 row and the content of new row is related to 
// the new book
function addNewRow(author, title, pages, alreadyReadResult) {
    bookNum += 1;
    const libraryBody = document.querySelector("#libraryTable tbody");
    // The position of new row is the next row in the end of table
    let newRow = libraryBody.insertRow(bookNum-1);
    // Setting cells of the new row
    let cell0 = newRow.insert_th_Cell(0);
    cell0.textContent = `${bookNum}`;
    cell0.setAttribute("scope", "row");
    newRow.insertCell(1).textContent = `${author}`;
    newRow.insertCell(2).textContent = `${title}`;
    newRow.insertCell(3).textContent = `${pages}`;
    // The data attributes in cell4 and cell5 (data-readresult-rows, data-deleteicon-rows)
    // indicates the row index nuber of the new row
    let cell4 = newRow.insertCell(4);
    cell4.innerHTML = alreadyReadResult
                                    ? "<input type='checkbox' checked/>"
                                    : "<input type='checkbox'/>";
    cell4.setAttribute("data-readresult-rows", bookNum);
    let cell5 = newRow.insertCell(5);
    cell5.innerHTML = "<img src='./pictures/trash-can.svg' alt='delete-icon'>";
    cell5.setAttribute("data-deleteicon-rows", bookNum);

    // Set the class of the new row (book) based on state of reading 
    if(alreadyReadResult){
        newRow.setAttribute("class", "readedBook");
        readedBookNum += 1;
    }
    else{
        newRow.setAttribute("class", "unReadedBook");
        unReadedBookNum += 1;
    }

    updateProgressBar();
}

// if the deletion icon in specific row is clicked, the row will be deelted
bookList.addEventListener('click', function (event){
    let target = event.target;

    if (document.querySelector("#libraryTable") != null) {
        const libraryTableBody = document.querySelector("#libraryTable tbody");
        const readResultCheckboxes = document.querySelectorAll("[data-readresult-rows]");
        const deleteicons = document.querySelectorAll("[data-deleteicon-rows]");

        // The clicked target is delete icon (have data attribute "data-deleteicon-rows")
        if((target.parentNode).dataset.deleteiconRows){
            // Retrive the index of row from the data attribute (data-deleteicon-rows)
            // in the container of clicked deletion icon
            const cellNum = Number((target.parentNode).dataset.deleteiconRows);
            const currentTableRow = document.querySelector(`#libraryTable tbody tr:nth-child(${cellNum})`);
            
            // delete the specific row in the table
            libraryTableBody.removeChild(currentTableRow);
            // delete the corresponding object of row in array
            if(myLibrary[cellNum-1].alreadyRead){
                readedBookNum -= 1;
            }
            else{
                unReadedBookNum -= 1;
            }

            myLibrary.splice(cellNum-1, 1);
            

            // if there are remaining rows below the deleted row after the deletion,
            // update the row information;
            if(cellNum != bookNum){
                updateCellIndex(cellNum);
            }

            bookNum -= 1;

            // if there are no rows after deletion, display original message indicating
            // library is empty (the deleted row is the ONLY row in the table)
            if(bookNum == 0){
                showEmptyMsg()
            }
        }

        // The clicked target is read checkbox (have data attribute "data-readresult-rows")
        if((target.parentNode).dataset.readresultRows){
            // Retrive the index of row from the data attribute (data-readresult-rows)
            // in the container of clicked read checkbox
            const cellNum = Number((target.parentNode).dataset.readresultRows);            
            const currentTableRow = document.querySelector(`#libraryTable tbody tr:nth-child(${cellNum})`);

            let newReadState = target.checked;
            // If the checkbox in specific row is clicked (the reading state is changed),
            // change the "alreadyRead" property of the corresponding object in the array
            myLibrary[cellNum-1].alreadyRead = newReadState;

            // change the class of the current row(book) based on state of reading
            if(newReadState){
                currentTableRow.setAttribute("class", "readedBook");
                readedBookNum += 1;
                unReadedBookNum -= 1;
            }
            else{
                currentTableRow.setAttribute("class", "unReadedBook");
                readedBookNum -= 1;
                unReadedBookNum += 1;
            }
        }

        updateProgressBar();
    }
});

function updateProgressBar(){
    const prgressBarLabel = document.querySelector("#prgressInfo label");
    prgressBarLabel.textContent = `Reading progress: ${readedBookNum} / ${bookNum}`;

    const prgressBar = document.querySelector("#prgressInfo progress");
    prgressBar.setAttribute("max", `${bookNum}`);
    prgressBar.setAttribute("value", `${readedBookNum}`);
}

// Update the information of the index number, and update values of two data attributes
// The values will be the new row index of current row
function updateCellIndex(cellNum){
    const updatedTableRows = document.querySelectorAll(`#libraryTable tbody tr:nth-child(n + ${cellNum})`);

    if(updatedTableRows){
        updatedTableRows.forEach((updatedTableRow) => {
            const indexCell = updatedTableRow.querySelector("th:first-child");
            const readCell = updatedTableRow.querySelector("td:nth-child(5)");
            const deleteCell = updatedTableRow.querySelector("td:nth-child(6)");
            let newIndex = Number(indexCell.textContent) - 1;

            indexCell.textContent = `${newIndex}`;
            readCell.dataset.readresultRows = newIndex;
            deleteCell.dataset.deleteiconRows = newIndex;
        });
    }
}

// If the table become empty after deletion of rows, show some 
// message indicating empty situation
function showEmptyMsg(){
    while (bookList.firstChild) {
        bookList.removeChild(bookList.firstChild);
    }

    const librarySpan = document.createElement("span");
    librarySpan.setAttribute("id", "emptyLibrary");
    librarySpan.textContent = "The library is empty. Try add some books and enjoy reading."
    bookList.appendChild(librarySpan);
}