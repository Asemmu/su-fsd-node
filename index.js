const express = require('express');
const fs = require('fs');
const app = express();
const { parse } = require("csv-parse");
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3002');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
});
app.get('/readData', (req, res) => {
    const filter = req.query.filter;
    let resultData = [];
    fs.createReadStream("./data.csv")
        .pipe(parse({ delimiter: ";", from_line: 1 }))
        .on("data", function (row) {

            const date = row[0];
            const name = row[1];
            resultData.push({ date: date, name: name });


        })
        .on("end", () => {

            resultData.forEach(data => {
                var pureName = data.name.split(".");
                var num = isNaN(parseInt(pureName[0].match(/^\d+/g), 10)) ? NaN : parseInt(pureName[0].match(/\d+/g), 10);
                var lastnum = isNaN(parseInt(pureName[0].match(/\d$/g), 10)) ? NaN : parseInt(pureName[0].match(/\d+/g), 10);


                var letr = pureName[0].match(/[a-zA-Z]+/g);


                data.num = num ;
                data.letter = letr.toString();
                data.lastnum = lastnum;
            })

            if (filter == "Date") {
                resultData.sort((a, b) => { return new Date(a.date) - new Date(b.date); });
            }
            else if (filter == "Ascending") {

                resultData.sort((a, b) => {
                
                    return (a.num - b.num ||  a.lastnum - b.lastnum ||  a.letter.localeCompare(b.letter) )
                })

            }
            else if (filter == "Descending") {
                resultData.sort((a, b) => {
                
                    return (b.num - a.num ||  b.lastnum - a.lastnum ||  b.letter.localeCompare(a.letter))
                })
            }
            let result = resultData.map(ele => ({ name: ele.name, date:ele.date}));
            res.json(result);
        })

});
app.listen(3000, () => {
    console.log('App listening on port 3000!');
});