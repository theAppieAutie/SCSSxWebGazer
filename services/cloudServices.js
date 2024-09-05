// imports
const fetch = require('node-fetch');
const dotenv = require('dotenv');


// set up config vars
dotenv.config();

const dbxConfig = {
  fetch,
  clientId: process.env.DROPBOX_KEY,
  clientSecret : process.env.DROPBOX_SECRET,
  refreshToken : process.env.DROPBOX_REFRESH_TOKEN,
};


const {Dropbox} = require('dropbox');
const dbx = new Dropbox(dbxConfig);


async function uploadVideo(file, urlPath) {
    try {
      await dbx.auth.checkAndRefreshAccessToken()
      const response = await dbx.filesUpload({path: urlPath, contents : file});
      if (response.ok) {
          console.log("uploaded successfully");
      }
    } catch (err) {
        console.error("Error: ", err);
    }
};



const cloudServices = {uploadVideo};


module.exports = cloudServices;