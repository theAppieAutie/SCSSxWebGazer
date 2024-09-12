// imports

const express = require('express');
const {startTrial, stopTrial} = require('../controllers/trialController');

const router = express.Router();


// GET /game: Render the game page based on user group
router.get('/trial', async (req, res) => startTrial(req, res));

  
  //  handle adding data to Experiment
router.post("/addTrial", async (req, res) => stopTrial(req, res));


module.exports =   router;