/****** HELPER FUNCTIONS MANAGING MONGODB INTERACTIONS ******/

const { request } = require("http");
const { spitNetGainSingleStock } = require("./stockAPIFunctions");

async function insertNewUser(client, databaseAndCollection, user) {
    /* Inserts the new username and password into the User database */
    try {
        await client.connect();
        await client.db(databaseAndCollection.db).collection(databaseAndCollection.collection).insertOne(user);
    } catch (e) {
        console.error(e);
    } finally {
        // await client.close();
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
        // await client.close();
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
        // await client.close();
        return result;
    }
}

async function updateUserTransactions(client, databaseAndCollection, username, transaction) {
    /* Updates the transactions to the existing user in the User database */
    /* also updates the balance as well */
    let result = {}
    try {
        await client.connect();
        let query = {
            username: username
        };
        let newTransactions = { 
            $push: {transactions: transaction} 
        };

        var netGain;
        let ourInput = await spitNetGainSingleStock(transaction["stock"], transaction["date"], Number(transaction["numStock"])).then(function(result) {netGain = result});
        
        // update user balance by peeking at the previous balance.
        await getUserData(client, databaseAndCollection, username).then(function (result) {
            if (result.balance) {
                if (result.balance[0]) {
                    netGain = netGain + result.balance[0];
                    // console.log(result.balance[0]);
                }
            }
        });
        
        // console.log(netGain);
        // let newBalance = {
        //     $push: {balance: netGain}
        // };
        let newBalance = {
            $push: {
                balance: {
                $each: [netGain],
                $position: 0
            }
        }
        }
        
        await client.db(databaseAndCollection.db).collection(databaseAndCollection.collection).updateOne(query, newBalance);
        result = await client.db(databaseAndCollection.db).collection(databaseAndCollection.collection).updateOne(query, newTransactions)
    } catch (e) {
        console.error(e);
    } finally {
        // await client.close();
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
        // dont close session because we have to call this function else where so keep me logged in 
        // await client.close();
        return result;
    }
}

async function getUpdatedBalance(client, databaseAndCollection, username) {
    /* TO BE IMPLEMENTED: Calculates the balance from the user's transactions */
    /* updating balance implemented together with the updateUserTransaction above */
    /* we simply returning calculated product from above */ 
    try {
        await client.connect();
        await getUserData(client, databaseAndCollection, username).then(async function (result) {
        if (result.balance) {
            if (result.balance[0]) {
                return await result.balance[0];
            }
        }
        return await result.balance[0];
    });
    } catch (error) {
        
    } 
}

module.exports = { insertNewUser, verifyReturningUser, verifyExistingUsername, updateUserTransactions, getUserData, getUpdatedBalance };