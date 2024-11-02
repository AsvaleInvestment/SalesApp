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
const update_Location = document.getElementById("update_Location");
const update_Serving = document.getElementById("update_Serving");
const update_Title = document.getElementById("update_Title");
const update_Department = document.getElementById("update_Department");
const update_Exposure = document.getElementById("update_Exposure");
const update_Current_Company = document.getElementById("update_Current_Company");
const update_Last_Contact = document.getElementById("update_Last_Contact");
const update_Last_Comments = document.getElementById("update_Last_Comments");
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
        console.log(jsonData);
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
    tr.dataset.allData = JSON.stringify(data);
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
    
    //changing last contact date to firestore timestamp
    let lastContactDate = new Date(jsonObject.Last_Contact);
    timestamp = firebase.firestore.Timestamp.fromDate(lastContactDate);
    jsonObject.Last_Contact = timestamp;

    console.log(jsonObject);
    let result = await addExecutiveAccount(jsonObject);
    if (result){
        window.location.reload();
    }else{
        alert("Failed to add a new data")
    }
})


// Update Account
function fillUpdateForm(updateButton){
    let accountDataElement = updateButton.parentNode.parentNode;
    let data = JSON.parse(accountDataElement.dataset.allData);

    //fill the update form
    form_updateAccount.dataset.objectId = data["_id"];

    update_Firstname.value = data.Firstname;
    update_Lastname.value = data.Lastname;
    update_Active.value = data.Active;
    update_Email.value = data.Email;
    update_Linkedin.value = data.Linkedin;
    update_Birthday.value = timestampToDate_formInput(data.Birthday.seconds);

    update_Location.value = data.Location;
    update_Serving.value = data.Serving;
    update_Title.value = data.Title;
    update_Department.value = data.Department;
    update_Exposure.value = data.Exposure;
    update_Current_Company.value = data.Current_Company;
    update_Last_Contact.value = timestampToDate_formInput(data.Last_Contact.seconds);
    update_Last_Comments.value = data.Last_Comments;
}
form_updateAccount.addEventListener("submit",(ev)=>{
    ev.preventDefault();
    updateExecutiveAccount();
})
async function updateExecutiveAccount(){
    let confirmation = confirm("are you sure?")
    if (confirmation){
        //get all the data ready for the api
        let formData = new FormData(form_updateAccount);
        //convert form data to json
        let jsonObject = {};
        for (const [key, value] of formData.entries()) {
            jsonObject[key] = value;
        }
        //convert the birthday date to firestore timestamp
        let birthdayDate = new Date(jsonObject.Birthday);
        let timestamp = firebase.firestore.Timestamp.fromDate(birthdayDate);
        jsonObject.Birthday = timestamp;
        
        //changing last contact date to firestore timestamp
        let lastContactDate = new Date(jsonObject.Last_Contact);
        timestamp = firebase.firestore.Timestamp.fromDate(lastContactDate);
        jsonObject.Last_Contact = timestamp;

        //procceed with the api
        let objectId = form_updateAccount.dataset.objectId;
        try {
            let result = await updateAccount_db(objectId, jsonObject);
            if (result){
                window.location.reload();
            }else{
                let message = await request.text();
                alert("Failed: " + message)
            }
        } catch (err) {
            console.error(err);
        }
    }
}

// Delete Accounts
async function deleteAccount(deleteButton){
    let accountDataElement = deleteButton.parentNode.parentNode;
    let data = JSON.parse(accountDataElement.dataset.allData);
    let objectID = data["_id"];

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