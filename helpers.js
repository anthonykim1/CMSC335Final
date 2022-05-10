/****** JS HELPER FUNCTIONS ******/

function arrayToHTMLTable(items) {
    let htmlTable = "<table class='table table-dark table-striped'><tr><th>Date</th><th>Stock</th><th>Number of Stock Purchases</th></tr>";
    if (items != []) {
        items.forEach(function(elem) {
            htmlTable += "<tr><td>" + elem.date + "</td><td>" + elem.stock + "</td><td>" + elem.numStock + "</td></tr>";
        });
    }
    htmlTable += "</table>";
    return htmlTable;
}

module.exports = { arrayToHTMLTable };