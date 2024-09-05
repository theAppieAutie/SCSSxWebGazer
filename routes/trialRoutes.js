// imports

const express = require('express');
const path = require('path');
const fs = require('fs');
const {startTrial, stopTrial} = require('../controllers/trialController');

const router = express.Router();

async function convertBlobToFile(blob) {
  const arrayBuffer = await blob.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  
  const tempFilePath = path.join(__dirname, 'temp', 'facetracking.mp4');
  
  fs.mkdirSync(path.dirname(tempFilePath), {recursive:true});
  fs.writeFileSync(tempFilePath, buffer);

  return tempFilePath
}


// GET /game: Render the game page based on user group
router.get('/trial', async (req, res) => startTrial(req, res));

  
  //  handle adding data to Experiment
router.post("/addTrial", async (req, res) => stopTrial(req, res));


module.exports =   router;