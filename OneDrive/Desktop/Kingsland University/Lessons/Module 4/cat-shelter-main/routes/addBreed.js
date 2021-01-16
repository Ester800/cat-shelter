var express = require('express');
var router = express.Router();
const fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('add-breed', { title: 'Add breed form' });
});

router.post('/', (req, res, next) => {
    // TO DO

    console.log('the breed form input is', req.body.breed)

    // console.log('Someone clicked post');
    // let formData = "";

    // req.on('data', (data) => {
    //   //console.log("the breed form data is ", data.toString());
    //   formData += data
    //   //console.log("the new data is ", formData)
    //   //console.log('I want the form data to be just "testing"')
    //   let parsedData = qs.parse(formData);
    //   //console.log("the parsed data is ", parsedData.breed)

      fs.readFile("./data/breeds.json", 'utf8' , (err, data) => {
        if (err) {
          console.error(err)
          return
        }
        let newBreed = req.body.breed;
        let currentBreeds = JSON.parse(data);
        currentBreeds.push(newBreed);
        //console.log("the breeds.json parsed data is the varible currentBreeds " ,currentBreeds);
        let updatedBreeds = JSON.stringify(currentBreeds);
        //console.log("JSON updated ready to save updated breeds", updatedBreeds);

        fs.writeFile('./data/breeds.json', updatedBreeds, 'utf-8', (err) => {
          if (err) {
            console.log(err)
          }
          console.log("The breed was uploaded successfully...")
        })

        res.writeHead(301, { location: '/'});
        res.end();

      })
    });
    //res.render('index');
module.exports = router;