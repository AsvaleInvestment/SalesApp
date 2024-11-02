const db = firebase.firestore();
const collection = "Executive_Accounts";



/**
 * @param {String} Firstname the firstname of the account holder
 * @returns accounts in json
 */
async function getAllAccounts_db(Firstname = ""){
    return new Promise((resolve,reject)=>{
        let data = [];
        let query = db.collection(collection).orderBy("Firstname")
                    .startAt(Firstname)
                    .endAt(Firstname + "\uf8ff");

        query.get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                let docData = {"_id": doc.id, ...doc.data()}
                data.push(docData);
            });
            resolve(data);
        })
        .catch((err)=>{
            reject(err)
        });
    })
}

async function addExecutiveAccount(jsonObject){
    return await addExecutiveAccount_db(jsonObject);
}


/**
 * 
 * @param {Object} jsonObject 
 * @returns true if successfull/ false if failed
 */
async function addExecutiveAccount_db(jsonObject){
    return new Promise((resolve,reject)=>{
        db.collection(collection).add(jsonObject)
        .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
            resolve(true)
        })
        .catch((err)=>{
            reject(err)
        });
    })
}


/**
 * @param {String} id 
 * @param {String} Firstname 
 * @param {String} Lastname 
 * @param {String} Active 
 * @param {String} Email 
 * @param {String} Linkedin 
 * @param {String} Birthday 
 */
async function updateAccount_db(objectId, jsonObject){
    return new Promise((resolve,reject)=>{
        db.collection(collection).doc(objectId).update(jsonObject)
        .then(() => {
            resolve(true)
        })
        .catch((err)=>{
            reject(err)
        });
    })
}


/**
 * 
 * @param {String} objectId 
 */
async function deleteAccount_db(objectId){
    return new Promise((resolve,reject)=>{
        db.collection(collection).doc(objectId).delete()
        .then(() => {
            resolve(true);
        })
        .catch((err) => {
            reject(err);
        });
    })
}