
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri =  process.env.MONGODB


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Database collections
const company = client.db("Company");
const executiveAccounts = company.collection("Executive_Accounts");


// Testing database connection
async function testConnection() {
  try {
    //send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("You successfully connected to MongoDB!");
  }
  catch (err){
    console.error("Connection to mongoDB failed!");
  }
}
testConnection();


// Database manipulation functions
async function executiveAccountExist(Email){
    try {
      let account = await executiveAccounts.findOne({Email})
      if (account === null) return false;
      else return true;
    } catch (error) {
      return {error}
    }
}

async function getAllExecutiveAccounts(){
    try{
        let allExecutives = await executiveAccounts.find().toArray();
        return allExecutives;
    }catch (err){
        console.error("an error at database > getExecutiveAccounts :\n\n" + err);
    }
}

async function getAccountsByFirstname(Firstname){
  try{
    const query = {Firstname:{$regex:`${Firstname}`,$options:"i"}};
    let accounts = await executiveAccounts.find(query).toArray()
    return {data:accounts};
  }catch (err){
    console.error("error at database > getAccountsByFirstname :\n\n" + err);
    return {error:"db error"}
  }
}

async function addExecutiveAccount(Firstname, Lastname, Active, Email, Linkedin, Birthday){
    try{
        await executiveAccounts.insertOne({Firstname, Lastname, Active, Email, Linkedin, Birthday});
        return true;
    }catch(err){
        console.error("creating executive account failed at database > addExecutiveAccount:\n\n" + err);
        return false;
    }
}

async function editExecutiveAccount(id, Firstname, Lastname, Active, Email, Linkedin, Birthday){
    try{
      const filter = {"_id": new ObjectId(id)};
      let updateDoc = {
          $set:{
            Firstname,
            Lastname,
            Active,
            Email,
            Linkedin,
            Birthday
          }
      };
      let output = await executiveAccounts.findOneAndUpdate(filter,updateDoc);
      if (output === null){
        return {status:404};
      }
      return {status:200}
    }catch(err){
      console.error("an error at database > editExecutiveAccount :\n\n" + err);
      return {status:500};
    }
}

async function deleteExecutiveAccount(id){
    try {
      const query = {"_id": new ObjectId(id)};
      let output = await executiveAccounts.findOneAndDelete(query);
      if (output.value === null){
          return {status:404};
      }

      return {status:200}
    } catch (error) {
      return {status:404}
    }
}


module.exports = {getAllExecutiveAccounts,
                getAccountsByFirstname,
                addExecutiveAccount,
                editExecutiveAccount,
                deleteExecutiveAccount,
                executiveAccountExist}