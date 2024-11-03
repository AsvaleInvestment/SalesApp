
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
        const jsonData = await getAllAccount_contactToday(Firstname);
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
    <td>${data.Firstname}</td>
    <td>${data.Lastname}</td>
    <td>${data.Active}</td>
    <td>${data.Email}</td>
    <td>${data.Role}</td>
    <td>${data.Current_Company}</td>
    <td><a href="${data.Linkedin}">${data.Linkedin}</a></td>
    <td>??</td>
    <td>??</td>
    <td>
        <a>
            Details
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