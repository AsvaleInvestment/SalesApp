const database = require("./database.js")
const path = require("path")
const {validateExecutiveAccountFields} = require("./utils.js")



// Get the executive accounts page route
async function getAccountExecutivesPage(req,res){
    res.status(200).sendFile(path.join(__dirname + "/assets/html/Account_Executive.html"));
}

// Get All The executives accounts route
async function api_getAllAccountExecutive(req,res){
    let accounts = await database.getAllExecutiveAccounts();
    res.status(200).json(accounts);
}

// Get Executives by Firstname
async function api_getAccountExecutiveByFirstname(req,res){
    let Firstname = req.params.Firstname;

    let output = await database.getAccountsByFirstname(Firstname);
    if (output.error){
        res.sendStatus(502)
    }
    else if (output.data.length === 0){
        res.sendStatus(204);
    }else{
        res.status(200).json(output.data);
    }
}

// Add an executive account route
async function api_addAccountExecutive(req,res){
    // Get account fields
    let {Firstname, Lastname, Active, Email, Linkedin, Birthday} = req.body;
    
    // Add server side validation for each field
    Birthday = new Date(Birthday)
    try {
        Active = JSON.parse(Active);
    } catch (error) {
        res.status(400).send("'Active' must be a boolean");
        return;
    }
    let {errorMessage} = validateExecutiveAccountFields(Firstname, Lastname, Active, Email, Linkedin, Birthday);
    if (errorMessage){
        res.status(400).send(errorMessage)
        return;
    }

    // Check if the executive account already exist
    let accountExists = await database.executiveAccountExist(Email)
    if (accountExists){
        res.status(400).send("Email Already exists!")
        return;
    }

    // Save executive account
    let saved = await database.addExecutiveAccount(Firstname, Lastname, Active, Email, Linkedin, Birthday)

    if (saved) res.status(201).send("Created!");
    else res.status(500).send("Failed!");
}

// Edit an executive account route
async function api_editAccountExecutive(req,res){
    // Get account fields
    let id = req.params.id;
    let {Firstname, Lastname, Active, Email, Linkedin, Birthday} = req.body;

    // Add server side validation for each field
    Birthday = new Date(Birthday)
    try {
        Active = JSON.parse(Active);
    } catch (error) {
        res.status(400).send("'Active' must be a boolean");
        return;
    }
    let {errorMessage} = validateExecutiveAccountFields(Firstname, Lastname, Active, Email, Linkedin, Birthday);
    if (errorMessage){
        res.status(400).send(errorMessage);
        return;
    }

    // Edit executive account
    let {status} = await database.editExecutiveAccount(id, Firstname, Lastname, Active, Email, Linkedin, Birthday)

    res.sendStatus(status);
}

// Delete an executive account route
async function api_deleteAccountExecutive(req,res){
    // Get account id
    let id = req.params.id;

    // Delete account
    let {status} = await database.deleteExecutiveAccount(id)

    res.sendStatus(status);
}

module.exports = {getAccountExecutivesPage,
                api_getAllAccountExecutive, 
                api_getAccountExecutiveByFirstname,
                api_addAccountExecutive, 
                api_editAccountExecutive, 
                api_deleteAccountExecutive}