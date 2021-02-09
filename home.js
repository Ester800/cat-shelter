const url = require('url');
const fs = require('fs'); // File System
const path = require('path');
const qs = require('querystring');
const formidable = require('formidable');
const breeds = require ('../data/breeds.json'); // Imported the breeds json so we can use it! 
const cats = require('../data/cats.json');
const { request } = require('http');
const globalPath = __dirname.toString().replace('handlers', '');


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
      
      fs.readFile(filePath, (err, data) => {
        if (err) {
          console.log(err);
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.write('404 File not found');
          res.end();
          return;
        }

        const id = pathname.split('/').pop();
        console.log(pathname);
        console.log(id);
        cat = cats.find((cat) => cat.id === id);
        console.log(cat);
        let editForm = `<form action="/cats-edit/${id}" method="POST" class="cat-form" enctype="multipart/form-data">
        <h2>Edit Cat</h2>
        <label for="name">Name</label>
        <input name="name" type="text" id="name" value="${cats[id].name}">
        <label for="description">Description</label>
        <textarea name="description" id="description">${cats[id].description}</textarea>
        <label for="image">Image</label>
        <input name="upload" type="file" id="image">
        <label for="group">Breed</label>
        <select name="breed" id="group">
          {{catBreeds}} 
        </select>
        <button type="submit">Submit</button>
        </form>`
         
        const placeholder = breeds.map(breed => `<option value="${breed}">${breed}</option`);
        editForm = editForm.replace('{{catBreeds}}', placeholder);

        const modifiedData = data.toString().replace('{{edit}}', editForm);

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(modifiedData);
        res.end();
      });


      //const index = fs.createReadStream(filePath);

      // index.on('data', (data) => {
      //   // console.log(data);
      //   // let currentCat = JSON.parse(data);
      //   // console.log(currentCat);
      //   // currentCat.push(parsedData);
      //   // let updatedCat = JSON.stringify(currentCat);
      //   // console.log(updatedCat);
      //   // let catBreedPlaceHolder = breeds.map( (breed) => `<option value"${breed}">${breed}</option>`);

      //   let catId = 1;
      //   let modifiedData = data.toString().replace('{{id}}', catId);
      //   modifiedData = modifiedData.replace('{{name}}', currentCat.name);
      //   modifiedData = modifiedData.replace('{{description}}', currentCat.description);

      //   const breedsAsOptions = breeds.map((b) => `<option value="${b}">${b}</option>`);
      //   modifiedData = modifiedData.replace('{{catBreeds}}', breedsAsOptions.join('/'));

      //   modifiedData = modifiedData.replace('{{breed}}', currentCat.breed);

      //   res.write(modifiedData)
      // });
      // index.on('end', () => { 
      //   res.end();
      // });
      // index.on('error', (err) => {
      //   console.log(err);
      // });


  } else if (pathname.includes('/cats-edit') && req.method === "POST") {
    let form = new formidable.IncomingForm();

    form.parse(req, (err, fields, files) => {
      console.log(files.upload.name);
      if (err) {
        console.log(err);
        return;
      }
      const oldPath = files.upload.path;
      const newPath = path.normalize(path.join(globalPath, `/content/images/${files.upload.name}`));

      fs.rename(oldPath, newPath, err => {
        if (err) {
          console.log(err)
          return;
        }
        console.log(`Image successfully uploaded to: ${newPath}`);
      });

      fs.readFile('./data/cats.json', 'utf-8', (err, data) => {
        if (err) {
          console.log(err);
          return;
        }

        const id = pathname.split('/').pop();
        let allCats = JSON.parse(data);
        for (const cat of allCats) {
          if (cat.id === id) {
            cat.name = fields.name;
            cat.description = fields.description;
            cat.breed = fields.breed;
            cat.image = files.upload.name;
          }
        };

        const json = JSON.stringify(allCats);
        fs.writeFile('./data/cats.json', json, (err) => {
          if (err) {
            console.log(err);
            return;
          }
          console.log(`Cat ID:${id} successfully edited!`);
        })
      })
      res.writeHead(301, { 'location': '/' })
    })
    
  } else {
    return true;
  }
} 