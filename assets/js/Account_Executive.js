const tableContent = document.getElementById("tableContent");
const spinner = document.getElementById("spinner");
const form_createAccount = document.getElementById("form_createAccount");



document.addEventListener("DOMContentLoaded",(ev)=>{
    getAllAccounts();
})



// Create Account

form_createAccount.addEventListener("submit", async (ev) => {
    console.log("form submit");
    ev.preventDefault();

    const formData = new FormData(form_createAccount);
    let request = await addExecutiveAccount(formData);
    if (request.ok){
        window.location.reload();
    }else{
        //show error
        let message = await request.text();
        alert("Failed: " + message)
    }
})
async function addExecutiveAccount(formData){
    let urlSearchParams = new URLSearchParams(formData);
    let urlEncodedData = urlSearchParams.toString();

    let request = await fetch("/api/Executive_Account",{
        method:"POST",
        body: urlEncodedData,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
    return request;
}







// Update Account

const update_Firstname = document.getElementById("update_Firstname")
const update_Lastname = document.getElementById("update_Lastname")
const update_Active = document.getElementById("update_Active")
const update_Email = document.getElementById("update_Email")
const update_Linkedin = document.getElementById("update_Linkedin")
const update_Birthday = document.getElementById("update_Birthday")

const form_updateAccount = document.getElementById("form_updateAccount")

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
        
        //procceed with the api
        let request = await updateAccountApi(objectId, Firstname, Lastname, Active, Email, Linkedin, Birthday);
        if (request.ok){
            window.location.reload();
        }else{
            let message = await request.text();
            alert("Failed: " + message)
        }
    }
}

async function updateAccountApi(objectId, Firstname, Lastname, Active, Email, Linkedin, Birthday){
    let formData = new FormData()
    formData.append('Firstname', Firstname);
    formData.append('Lastname', Lastname);
    formData.append('Active', Active);
    formData.append('Email', Email);
    formData.append('Linkedin', Linkedin);
    formData.append('Birthday', Birthday);

    let urlSearchParams = new URLSearchParams(formData);
    let urlEncodedData = urlSearchParams.toString();

    let request = await fetch(`/api/Executive_Account/${objectId}`,{
        method:"PUT",
        body:urlEncodedData,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
    return request;
}




// Delete Accounts
async function deleteAccount(deleteButton){
    let accountDataElement = deleteButton.parentNode.parentNode;
    let objectID = accountDataElement.dataset.objectId;

    let confirmation = confirm("Are you sure ?")
    if (confirmation){
        
        let request = await fetch(`/api/Executive_Account/${objectID}`,{
            method: "DELETE"
        });
        if (request.ok){
            window.location.reload();
        }else{
            let message = await request.text();
            alert("Failed: " + message)
        }
    }
}





// Get Accounts

const search_button = document.getElementById("search_button");
const search_Firstname = document.getElementById("search_Firstname");

search_button.addEventListener("click",async (ev)=>{
    search_button.disabled = true;
    await getAllAccounts(search_Firstname.value);
    search_button.disabled = false;
})

async function getAllAccounts(Firstname = ""){
    tableContent.innerHTML = ""
    spinnerStatus(false);
    try{
        const request = await fetch(`/api/Executive_Account/${Firstname}`);
        if (request.ok){
            const jsonData = await request.json();
            showAccounts(jsonData);
        }else{
            let message = await request.text();
            alert("Failed: " + message)
        }
    }catch (err){
        if (! err instanceof SyntaxError){
            alert("unknown error");
            console.error(err);
        }
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
    tr.dataset.Birthday = formatDateForInput(data.Birthday);
    tr.innerHTML = `
    <th>${index+1}</th>
    <td>${data.Firstname}</td>
    <td>${data.Lastname}</td>
    <td>${data.Active}</td>
    <td>${data.Email}</td>
    <td>${data.Linkedin}</td>
    <td>${formatDate(data.Birthday)}</td>
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



//utils functions
function spinnerStatus(hide = true){
    if (hide){
        spinner.style.display = "none";
    }else{
        spinner.style.display = "block";
    }
}

function formatDate(inputDateString) {
    const inputDate = new Date(inputDateString);
  
    const day = String(inputDate.getDate()).padStart(2, "0");
    const month = String(inputDate.getMonth() + 1).padStart(2, "0");
    const year = inputDate.getFullYear();
  
    return `${day}/${month}/${year}`;
}

function formatDateForInput(inputDateString) {
    const inputDate = new Date(inputDateString);
  
    const year = inputDate.getFullYear();
    const month = String(inputDate.getMonth() + 1).padStart(2, "0");
    const day = String(inputDate.getDate()).padStart(2, "0");
  
    return `${year}-${month}-${day}`;
}