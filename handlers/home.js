const url = require('url');
const fs = require('fs');
const path = require('path');
const qs = require('querystring');
const formidable = require('formidable');
const cats = require('../data/cats.json');
const breeds = require('../data/breeds.json');


module.exports = (req, res) => {
    const pathname = url.parse(req.url).pathname;

    if(pathname === '/' && req.method === 'GET') {
        let filePath = path.normalize(
            path.join(__dirname, '../views/home/index.html')
        );

        fs.readFile(filePath, (err, data) => {
            if(err) {
                console.log(err);

                res.writeHead(404, {
                    "content-type": "text/plain"
                });

                res.write('add not found');
                res.end();
                return;
            }

            res.writeHead(200, {
                "content-type": "text/html"
            });

            res.write(data);
            res.end();
        });
        
        //res.redirect('/views/home');
    } else if (pathname === '/cats/add-cat' && req.method === 'GET') {
            let filePath = path.normalize(path.join(__dirname, '../views/addCat.html'));
    
            const index = fs.createReadStream(filePath);
    
            index.on('data', (data) => {
                let catBreedPlaceholder = breeds.map((breed) => `<option value="${breed}">${breed}</option>`);
                let modifiedData = data.toString().replace('{{catBreeds}}', catBreedPlaceholder);
                res.write(modifiedData);
            });
    
            index.on('end', () => {
                res.end();
            });
            index.on('error', (err) => {
                console.log('err');
            });

    } else if (pathname === '/cats/add-breed' && req.method === 'GET') {
            let filePath = path.normalize(path.join(__dirname, '../views/addBreed.html'));

            const index = fs.createReadStream(filePath);

            index.on('data', (data) => {
                res.write(data);
            });

            index.on('end', () => {
                res.end();
            });
            index.on('error', (err) => {
                console.log('err');
            });    

    } else if (pathname === '/cats/add-cat' && req.method === 'POST') {
    
            const index = fs.createReadStream(filePath);
    
            index.on('data', (data) => {
                res.write(data);
            });
            index.on('end', () => {
                res.end();
            });
            index.on('error', (err) => {
                console.log('err');
            });  

    } else if (pathname === '/cats/add-breed' && req.method === 'POST') {
        let formData = '';
        req.on('data', (data) => {
            //console.log('the breed form data is ', data.toString());
            formData += data;
            //console.log('the new data is ', formData)
            let parsedData = qs.decode(formData);
            console.log("the parsed data is", parsedData.breed);
    

        fs.readFile('./data/breeds.json', 'utf8', (err, data) => {
            if(err) {
                console.log(err);
                return
            }
            
            let currentBreeds = JSON.parse(data);
            currentBreeds.push(parsedData.breed);
            let updatedBreeds = JSON.stringify(currentBreeds);
            console.log('the updated ready to save data is', updatedBreeds);

            fs.writeFile('./data/breeds.json', updatedBreeds, 'utf-8', () => {
                console.log('The breed was uploaded successfully...');
            });

            res.writeHead(301, { location: '/' });
            res.end();
        });
    });
 
    } else {
        return true;
    }
}
