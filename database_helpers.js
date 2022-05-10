/****** HELPER FUNCTIONS MANAGING MONGODB INTERACTIONS ******/

async function insertNewUser(client, databaseAndCollection, user) {
    /* Inserts the new username and password into the User database */
    try {
        await client.connect();
        await client.db(databaseAndCollection.db).collection(databaseAndCollection.collection).insertOne(user);
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}


async function verifyReturningUser(client, databaseAndCollection, username, password) {
    /* Verify the username and password exists in the User database */
    let result = {}
    try {
        await client.connect();
        let filter = {username: username, password: password};
        result = await client.db(databaseAndCollection.db).collection(databaseAndCollection.collection).findOne(filter);
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
        return result;
    }
}

async function verifyExistingUsername(client, databaseAndCollection, username) {
    /* Verify the username is not already taken */
    let result = {}
    try {
        await client.connect();
        let filter = {username: username};
        result = await client.db(databaseAndCollection.db).collection(databaseAndCollection.collection).findOne(filter);
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
        return result;
    }
}

async function updateUserTransactions(client, databaseAndCollection, username, transaction) {
    /* Updates the transactions to the existing user in the User database */
    let result = {}
    try {
        await client.connect();
        let query = {
            username: username
        };
        let newTransactions = { 
            $push: {transactions: transaction} 
        };
        result = await client.db(databaseAndCollection.db).collection(databaseAndCollection.collection).updateOne(query, newTransactions)
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
        return result;
    }
}

async function getUserData(client, databaseAndCollection, username) {
    /* Get the user's data based off the user's username */
    let result = {}
    try {
        await client.connect();
        let filter = {username: username};
        result = await client.db(databaseAndCollection.db).collection(databaseAndCollection.collection).findOne(filter);
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
        return result;
    }
}

function getUpdatedBalance() {
    /* TO BE IMPLEMENTED: Calculates the balance from the user's transactions */
    return 0;
}

module.exports = { insertNewUser, verifyReturningUser, verifyExistingUsername, updateUserTransactions, getUserData, getUpdatedBalance };