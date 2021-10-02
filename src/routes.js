const express = require('express');
const multer = require('multer');


const AcademyController = require('./controllers/AcademyController')
const uploadConfig = require('./config/uploads')

const routes = express.Router();
const upload = multer(uploadConfig);

routes.get('/', (req, res) => {
    res.send('Hello from Node.js app \n');
})



// routes.post('/createAcademy', upload.array("files", 11), AcademyController.createAcademy) //! this is the OG
routes.post('/createAcademy', AcademyController.createAcademy);
routes.post('/createProgram', AcademyController.createProgram);
routes.get('/searchPrograms', AcademyController.searchPrograms);
routes.get('/getPrograms', AcademyController.getPrograms);
routes.get('/program/:id', AcademyController.getProgram)
routes.get('/programsByAcademyId/:id', AcademyController.searchProgramsByAcademyId)

//academies
routes.get('/searchAcademies', AcademyController.searchAcademies);
routes.get('/academy/:id', AcademyController.getAcademy);


module.exports = routes;
