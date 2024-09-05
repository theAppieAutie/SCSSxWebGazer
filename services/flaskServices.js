const fetch = require('node-fetch');
const dotenv = require('dotenv');


dotenv.config(); // load environmental vars from .env


// one parameter to start or stop
const handleRecording = async (route) => {

    if (typeof(route) !== typeof('string')){
        return "Error: argument must be type string";
    }

    const baseUrl = process.env.FLASK_SERVER;
    const url = baseUrl + route;
    console.log(url);
    try {
        const response = await fetch(url);
        if (!response.ok){
            throw new Error(`Error: ${response.statusText}`);
        } else {
            return;
        }
    } catch (err) {
        console.error('Fetch error: ', err);
        throw err;
    }
}

const downloadVideo = async () => {
    const baseUrl = process.env.FLASK_SERVER;
    const url = `${baseUrl}download`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        };
        const blob = await response.blob();
        return blob;
    } catch (err) {
        console.error("Download error:", err);
    }
}

const flaskServices = {
    downloadVideo,
    handleRecording
};

module.exports =  flaskServices;

