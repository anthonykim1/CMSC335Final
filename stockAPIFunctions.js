const { json } = require('express/lib/response');
var yf = require('yahoo-finance');


// Function that takes in symbol and date as parameter and returns net gain/loss on single stock position
// first index: 0 index corresponds to today's and last will represent date user bought his/her stock 

// warning: make sure you use .then (when calling from outside) otherwise it wouldnt show properly
async function spitNetGainSingleStock(ticker, date, numStock) {
    var answer;

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    var netGain;

    today = yyyy + "-" + mm + "-" + dd;

    try {
        let we = await yf.historical({
            symbol: ticker,
            from: date,
            to: today,
        }, async function (error, result) {
            
            if (error) {
                console.log("wrong stock symbol probably");
            }
            answer = result;
            let tryThis = await JSON.parse(JSON.stringify(result[0]));
            let todayPrice = await JSON.parse(JSON.stringify(result[0]));
            let userBoughtPrice = await JSON.parse(JSON.stringify(result[result.length-1]));
            netGain = Number(todayPrice["close"]) - Number(userBoughtPrice["close"]); 
        });
    } catch (error) {
        console.log("You are making invalid API calls");
    }
    // let we = await yf.historical({
    //     symbol: ticker,
    //     from: date,
    //     to: today,
    // }, async function (error, result) {
        
    //     if (error) {
    //         console.log("wrong stock symbol probably");
    //     }
    //     answer = result;
    //     let tryThis = await JSON.parse(JSON.stringify(result[0]));
    //     let todayPrice = await JSON.parse(JSON.stringify(result[0]));
    //     let userBoughtPrice = await JSON.parse(JSON.stringify(result[result.length-1]));
    //     netGain = Number(todayPrice["close"]) - Number(userBoughtPrice["close"]); 
    // });
    
    return Math.round (Number(numStock) * netGain);
}

module.exports = { spitNetGainSingleStock };

// example of function call
// spitNetGainSingleStock("TSLA", "2022-01-03").then(function(result) {console.log(result)});
