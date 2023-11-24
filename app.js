require('dotenv').config({path:__dirname+'/.env'});


const express = require("express");
const app = express();
const routes = require("./routes.js");
const PORT = process.env.PORT || 5000;


app.use(express.urlencoded({ extended: true }));
app.use(express.static('./assets'));


// api
app.get("/api/Executive_Account", routes.api_getAllAccountExecutive);
app.get("/api/Executive_Account/:Firstname", routes.api_getAccountExecutiveByFirstname);
app.post("/api/Executive_Account", routes.api_addAccountExecutive);
app.put("/api/Executive_Account/:id", routes.api_editAccountExecutive);
app.delete("/api/Executive_Account/:id", routes.api_deleteAccountExecutive);


// pages
app.get("/", routes.getAccountExecutivesPage);




app.listen(PORT, ()=>{
    console.log("\x1b[33m" + "server is on port " + PORT + "\x1b[0m");
});