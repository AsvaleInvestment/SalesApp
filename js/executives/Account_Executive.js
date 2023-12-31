const tableContent = document.getElementById("tableContent");
const spinner = document.getElementById("spinner");
const form_createAccount = document.getElementById("form_createAccount");
const search_button = document.getElementById("search_button");
const search_Firstname = document.getElementById("search_Firstname");

const update_Firstname = document.getElementById("update_Firstname");
const update_Lastname = document.getElementById("update_Lastname");
const update_Active = document.getElementById("update_Active");
const update_Email = document.getElementById("update_Email");
const update_Linkedin = document.getElementById("update_Linkedin");
const update_Birthday = document.getElementById("update_Birthday");
const form_updateAccount = document.getElementById("form_updateAccount");



document.addEventListener("DOMContentLoaded",(ev)=>{
    getAllAccounts();
})


// Get Accounts
search_button.addEventListener("click",async (ev)=>{
    search_button.disabled = true;
    await getAllAccounts(search_Firstname.value);
    search_button.disabled = false;
})
async function getAllAccounts(Firstname = ""){
    tableContent.innerHTML = ""
    spinnerStatus(false);
    try{
        const jsonData = await getAllAccounts_db(Firstname);
        showAccounts(jsonData);
    }catch (err){
        if (! err instanceof SyntaxError){
            alert("unknown error");
            console.error(err);
        }
        console.error(err);
    }
    spinnerStatus(true);
}
function showAccounts(accountsData){
    accountsData.forEach((data,index) => {
        let tr = document.createElement("tr");
        renderAccount(tr,data, index);
        tableContent.appendChild(tr);
    });
}
function renderAccount(tr,data, index){
    tr.dataset.objectId = data["_id"];
    tr.dataset.Firstname = data.Firstname;
    tr.dataset.Lastname = data.Lastname;
    tr.dataset.Active = data.Active;
    tr.dataset.Email = data.Email;
    tr.dataset.Linkedin = data.Linkedin;
    tr.dataset.Birthday = timestampToDate_formInput(data.Birthday.seconds);
    tr.innerHTML = `
    <th>${index+1}</th>
    <td>${data.Firstname}</td>
    <td>${data.Lastname}</td>
    <td>${data.Active}</td>
    <td>${data.Email}</td>
    <td>${data.Linkedin}</td>
    <td>${timestampToDate(data.Birthday.seconds)}</td>
    <td>
        <a class = "link-primary" href="#" onclick="fillUpdateForm(this)" data-bs-toggle="modal" data-bs-target="#updateAccountForm">
            Update
        </a>
    </td>
    <td>
        <a class = "link-danger" href="#" onclick="deleteAccount(this)">
            delete
        </a>
    </td>
    `;
}

// Create Account
form_createAccount.addEventListener("submit", async (ev) => {
    console.log("form submit");
    ev.preventDefault();

    let formData = new FormData(form_createAccount);
    //convert form data to json
    let jsonObject = {};
    for (const [key, value] of formData.entries()) {
        jsonObject[key] = value;
    }
    //convert the birthday date to firestore timestamp
    let birthdayDate = new Date(jsonObject.Birthday);
    let timestamp = firebase.firestore.Timestamp.fromDate(birthdayDate);
    jsonObject.Birthday = timestamp;

    let result = await addExecutiveAccount(jsonObject);
    if (result){
        window.location.reload();
    }else{
        alert("Failed to add a new data")
    }
})
async function addExecutiveAccount(jsonObject){
    return await addExecutiveAccount_db(jsonObject);
}


// Update Account
function fillUpdateForm(updateButton){
    let accountDataElement = updateButton.parentNode.parentNode;
    let data = accountDataElement.dataset;

    //fill the update form
    form_updateAccount.dataset.objectId = data.objectId;
    update_Firstname.placeholder = data.Firstname;
    update_Lastname.placeholder = data.Lastname;
    update_Email.placeholder = data.Email;
    update_Linkedin.placeholder = data.Linkedin;

    update_Firstname.value = "";
    update_Lastname.value = "";
    update_Active.value = data.Active;
    update_Email.value = "";
    update_Linkedin.value = "";
    update_Birthday.value = data.Birthday;
}
form_updateAccount.addEventListener("submit",(ev)=>{
    ev.preventDefault();
    updateExecutiveAccount();
})
async function updateExecutiveAccount(){
    let confirmation = confirm("are you sure?")
    if (confirmation){
        //get all the data ready for the api
        let objectId = form_updateAccount.dataset.objectId;
        let Firstname = update_Firstname.value === "" ? update_Firstname.placeholder : update_Firstname.value;
        let Lastname = update_Lastname.value === "" ? update_Lastname.placeholder : update_Lastname.value;
        let Email = update_Email.value === "" ? update_Email.placeholder : update_Email.value;
        let Linkedin = update_Linkedin.value === "" ? update_Linkedin.placeholder : update_Linkedin.value;
        let Active = update_Active.value;
        let Birthday = update_Birthday.value;
        
        //convert the birthday date to firestore timestamp
        Birthday = firebase.firestore.Timestamp.fromDate(new Date(Birthday));

        //procceed with the api
        let result = await updateAccount_db(objectId, Firstname, Lastname, Active, Email, Linkedin, Birthday);
        if (result){
            window.location.reload();
        }else{
            let message = await request.text();
            alert("Failed: " + message)
        }
    }
}

// Delete Accounts
async function deleteAccount(deleteButton){
    let accountDataElement = deleteButton.parentNode.parentNode;
    let objectID = accountDataElement.dataset.objectId;

    let confirmation = confirm("Are you sure ?")
    if (confirmation){
        let result = await deleteAccount_db(objectID);
        if (result){
            window.location.reload();
        }else{
            let message = await request.text();
            alert("Failed: " + message)
        }
    }
}

//utils functions
function spinnerStatus(hide = true){
    if (hide){
        spinner.style.display = "none";
    }else{
        spinner.style.display = "block";
    }
}
function timestampToDate(timestamp) {
    const inputDate = new Date(timestamp * 1000);
  
    const day = String(inputDate.getDate()).padStart(2, "0");
    const month = String(inputDate.getMonth() + 1).padStart(2, "0");
    const year = inputDate.getFullYear();
  
    return `${day}/${month}/${year}`;
}
function timestampToDate_formInput(timestamp) {
    const inputDate = new Date(timestamp * 1000);
  
    const year = inputDate.getFullYear();
    const month = String(inputDate.getMonth() + 1).padStart(2, "0");
    const day = String(inputDate.getDate()).padStart(2, "0");
  
    return `${year}-${month}-${day}`;
}