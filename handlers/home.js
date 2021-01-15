const url = require('url');
const fs = require('fs'); // File System
const path = require('path');
const qs = require('querystring');
const formidable = require('formidable');
const breeds = require ('../data/breeds.json'); // Imported the breeds json so we can use it! 
const cats = require('../data/cats.json');


module.exports = (req, res) => {
  const pathname = url.parse(req.url).pathname;
  //console.log("[home.js 10]home pathname is ", pathname);
  if (pathname === '/' && req.method === 'GET') {
    // Implement the logic for showing the home html view
    let filePath = path.normalize(
      path.join(__dirname, '../views/home/index.html')
    );
    fs.readFile(filePath, (err, data) => {
      let modifiedCats = cats.map((cat) =>  `<li>
        <img src="${path.join('./content/images/' + cat.image)}" alt="${cat.name}"></img>
        <h3>${cat.name}</h3>
        <p><span>Breed: </span>${cat.breed}</p>
        <p><span>Description: </span>${cat.description}</p>
        <ul class="buttons">
          <li class="btn edit"><a href="/cats-edit/${cat.id}">Change Info</a></li>
          <li class="btn delete"><a href="cats-find-new-home/${cat.id}">New Home</a></li>
          </ul>
      </li>`);
      let modifiedData = data.toString().replace('{{cats}}', modifiedCats);

      if(err) {
        console.log(err);
        res.write(404, {
          "Content-Type": "text/plain"
        });
        res.write(404);
        res.end();
        return
      } 
      res.writeHead(200, {
        "Content-Type": "text/html" 
      });
      res.write(modifiedData);
      res.end();
    });


  } else if (pathname === '/cats/add-cat' && req.method === 'GET') {
    let filePath = path.normalize(path.join(__dirname, '../views/addCat.html'));

    const index = fs.createReadStream(filePath);

    index.on('data', (data) => {
      console.log("the breeds are currently ", breeds)
      let catBreedPlaceHolder = breeds.map( (breed) => `<option value"${breed}">${breed}</option>`);
      console.log(catBreedPlaceHolder)
      let modifiedData = data.toString().replace('{{catBreeds}}', catBreedPlaceHolder)
                                            //         	<option value="Fluffy Cat">Fluffy Cat</option>
      res.write(modifiedData)
    });
    index.on('end', () => { 
      res.end();
    });
    index.on('error', (err) => {
      console.log(err);
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
      console.log(err);
    });


  } else if (pathname === '/cats/add-cat' && req.method === 'POST') {
    let form = new formidable.IncomingForm();

      form.parse(req, (err, fields, files) => {
        console.log(files.upload.name);
        if (err) {
          console.log(err);
          return
        }
        const oldPath = files.upload.path;
        const newPath = path.normalize(path.join('./content/images', files.upload.name));
        console.log(files);

        fs.rename(oldPath, newPath, err => {
          if (err) { 
            console.log(err);
            return
          }
          console.log('Files were uploaded successfully');
        })

        fs.readFile('./data/cats.json', 'utf-8', (err, data) => {
          if (err) {
            console.log(err)
            return
          }

          const allCats = JSON.parse(data);
          allCats.push({ id: cats.length + 1, ...fields, image: files.upload.name});
          const json = JSON.stringify(allCats);
          fs.writeFile('./data/cats.json', json, () => { 
            res.writeHead(301, { location: '/'});
            res.end();
          });
        });
      });

  
  } else if (pathname === '/cats/add-breed' && req.method === 'POST') {
    let formData = "";

    req.on('data', (data) => {
      //console.log("the breed form data is ", data.toString());
      formData += data
      //console.log("the new data is ", formData)
      //console.log('I want the form data to be just "testing"')
      let parsedData = qs.parse(formData);
      //console.log("the parsed data is ", parsedData.breed)

      fs.readFile("./data/breeds.json", 'utf8' , (err, data) => {
        if (err) {
          console.error(err)
          return
        }
        let currentBreeds = JSON.parse(data);
        currentBreeds.push(parsedData.breed);
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


  } else if (pathname.includes('/cats-edit') && req.method === "GET") {
      let filePath = path.normalize(path.join(__dirname, '../views/editCat.html'));
      
      const index = fs.createReadStream(filePath);

      index.on('data', (data) => {
        // console.log(data);
        // let currentCat = JSON.parse(data);
        // console.log(currentCat);
        // currentCat.push(parsedData);
        // let updatedCat = JSON.stringify(currentCat);
        // console.log(updatedCat);
        // let catBreedPlaceHolder = breeds.map( (breed) => `<option value"${breed}">${breed}</option>`);

        let catId = 1;
        let modifiedData = data.toString().replace('{{id}}', catId);
        modifiedData = modifiedData.replace('{{name}}', currentCat.name);
        modifiedData = modifiedData.replace('{{description}}', currentCat.description);

        const breedsAsOptions = breeds.map((b) => `<option value="${b}">${b}</option>`);
        modifiedData = modifiedData.replace('{{catBreeds}}', breedsAsOptions.join('/'));

        modifiedData = modifiedData.replace('{{breed}}', currentCat.breed);

        res.write(modifiedData)
      });
      index.on('end', () => { 
        res.end();
      });
      index.on('error', (err) => {
        console.log(err);
      });


  }  else {
    return true;
  }
} 