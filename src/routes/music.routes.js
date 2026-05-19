const express = require ('express');
const musicController = require('../controller/music.controller');
const multer = require('multer');


const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();


router.post('/upload', upload.single('file'), musicController.createMusic);
router.get('/getallmusic', musicController.getAllMusic);
// router.get('/getmusicbyid/:id', musicController.getMusicById);
// router.get('/getmusicbyartist/:artistId', musicController.getMusicByArtist);







module.exports = router;