const { json } = require('express/lib/response');
var yf = require('yahoo-finance');

// Function that takes in symbol and date as parameter and returns net gain/loss on single stock position
// first index: 0 index corresponds to today's and last will represent date user bought his/her stock 
function spitNetGainSingleStock(ticker, date) {
    var answer;

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    var netGain;

    today = yyyy + "-" + mm + "-" + dd;

    yf.historical({
        symbol: ticker,
        from: date,
        to: today,
    }, function (error, result) {
        answer = result;
        let tryThis = JSON.parse(JSON.stringify(result[0]));
        // console.log(tryThis);
        console.log(tryThis["close"]);
        console.log(typeof tryThis["close"]);

        let todayPrice = JSON.stringify(result[0], null, 2);
        let userBoughtPrice = JSON.stringify(result[result.length - 1], null, 2);
        // console.log(todayPrice);
        // console.log(userBoughtPrice);
         // calculate net gain/loss
        //  console.log(todayPrice["close"]);
        //  console.log(typeof userBoughtPrice);
        netGain = Number(todayPrice["close"]) - Number(userBoughtPrice["close"]);
        // console.log(netGain)
    });
    return netGain;
}


console.log(spitNetGainSingleStock("TSLA", "2022-01-03"));
