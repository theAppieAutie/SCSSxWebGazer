import { initializeClassificationButtons, confirmClassification } from './classification.js';
import {config} from "./config.js";


//  object holding censored item list to add blur
const censoredOptions = {
  'RIO' : {
        0 : 'info-portnumber',
        1 : 'info-protocol',
        2 : 'info-certificates'
  },
  'SIO' : {
    0 : 'info-checksum',
    1 : 'info-time',
    2 : 'info-ip',
    3 : 'info-country'
  }
}

// Function to change game styles based on the group
const adjustGameStyles = () => {
  const game = document.getElementById("game");
  game.style.maxWidth = "60vw";
  game.style.maxHeight = "60vh";
  game.style.marginRight = "1vw";
};

document.addEventListener("DOMContentLoaded", adjustGameStyles());

// initiate advisor recommendations and attach to packets
const numberWrong= Math.round((100 - config.advisorAccuracy) / 100 * packetArray.length);
let advisorArray = packetArray.map((x) => x.packetType);
let count = 0;
while (count < numberWrong) {
  let index = Math.floor(Math.random() * advisorArray.length);
  if (advisorArray[index] === packetArray[index].packetType) {
    
    switch (advisorArray[index]) {
      case "hostile":
        advisorArray[index] = Math.random() < .50 ? "trusted" : "suspect";
        break;
      case "trusted":
        advisorArray[index] = Math.random() < .50 ? "suspect" : "hostile";
        break;
      case "suspect":
        advisorArray[index] = Math.random() < .50 ? "hostile" : "trusted";
    }
    count++;
  }
}

for (let i = 0; i < packetArray.length; i++) {
  conditionText === "No Advisor" ? packetArray[i]["recommendation"] = "" : packetArray[i]["recommendation"] = advisorArray[i];
  packetArray[i]["acceptedRecommendation"] = false;
}


// Initialize variables and elements
const gameObj = document.getElementById("game");
const panelsElement = document.getElementsByClassName("panels")[0];
let selectedDotInfo = null;
let dotElement = null;
const timeForTrial = config.trialLength * 60000;
const timePerPacket = (config.packetTimeOnScreen * 1000) * packetArray.length <= timeForTrial ? config.packetTimeOnScreen * 1000 : timeForTrial / packetArray.length; 



// set up trial view
if (group !== "A") {
  panelsElement.style.flexDirection = "row-reverse";
}
if (config.censoring) {
  document.getElementById(censoredOptions[censoredInfo][censoredArrayNumber]).classList.add("blur");
}
document.getElementById("condition").textContent = `Condition: ${conditionText}`;

if (conditionText === "No Advisor") {
  document.getElementById("accept").classList.add("hide");
  document.getElementById("advice").classList.add("hide");
}

// Initialize classification buttons
initializeClassificationButtons();

// Attach confirmation event
document.getElementById("trusted").addEventListener("click", () => confirmClassification(dotElement, selectedDotInfo, "trusted"));
document.getElementById("suspect").addEventListener("click", () => confirmClassification(dotElement, selectedDotInfo, "suspect"));
document.getElementById("hostile").addEventListener("click", () => confirmClassification(dotElement, selectedDotInfo, "hostile"));

let selectedDot = null;

const selectDot = (dotElement) => {
  if (selectedDot) {
    selectedDot.classList.remove('selected');
  }
  selectedDot = dotElement;
  selectedDot.classList.add('selected');
};


// Function to update connection information
const updateConnectionInfo = (info) => {
  document.getElementById('info-ip').textContent = `IP Address: ${info.ipAddress}`;
  document.getElementById('info-country').textContent = `Country: ${info.country}`;
  document.getElementById('info-checksum').textContent = `Checksum: ${info.checkSum}`;
  document.getElementById('info-protocol').textContent = `Protocol: ${info.protocol}`;
  document.getElementById('info-time').textContent = `Connection Time: ${info.time}`;
  document.getElementById('info-certificates').textContent = `Certificates: ${info.certificates}`;
  document.getElementById('info-portnumber').textContent = `Port Number: ${info.portNumber}`;
  document.getElementById('info-classification').textContent = `Classification: ${info.classification}`;
  document.getElementById('advice').textContent = `Recommendation: ${info.recommendation}`;
};


//  create packet elements
let packetElements = [];
for (let packet of packetArray) {
  console.log(packet.location)
  const dot = document.createElement('div');
  dot.classList.add('dot');
  dot.style.left = `${packet.location[0]}%`
  dot.style.top = `${packet.location[1]}%`
  packetElements.push(dot);
  dot.style.visibility = 'hidden';
  gameObj.appendChild(dot);

  dot.addEventListener('animationend', () => {
    dot.remove();
  });
  dot.addEventListener('click', function() {
    updateConnectionInfo(packet);
    selectDot(this);
    selectedDotInfo = packet;
    dotElement = this;
    document.getElementById("accept").addEventListener("click", function() {
      packet["acceptedRecommendation"] = true;
      confirmClassification(dotElement, selectedDotInfo, packet.recommendation);
    });
  })
}

function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function animatePackets() {
  console.log("animating packets")
  for (let i = 0; i < packetElements.length; i++) {
    const dot = packetElements[i];
    dot.style.animation = `dot-move ${timePerPacket}ms linear 1`;
    await delay(timePerPacket / 2); // Adjust the delay as needed
  }
  await delay(timePerPacket);
  endTrial()
}



// Define the `start` function to initialize the game
const startTrial = () => {
  // Create and add the central point without click events
  const visualCenterDot = document.createElement('div');
  visualCenterDot.classList.add('center-dot');
  gameObj.appendChild(visualCenterDot);

  animatePackets();
};
  
// handle end of the trial
const endTrial = () => {
  // pauseWebGazer();
  let inputs = [];
  for (let [k,v] of packetArray.entries()) {
    if (v.classification !== v.recommendation) {
      v.acceptedRecommendation = false;
    }
    inputs.push({user : v.classification, advisor : v.recommendation, accepted : v.acceptedRecommendation, time : v.inputTime});
  }
  handleInput(inputs);

}

// handle participant input
function handleInput(data) {
  const trialEndTime = new Date().toISOString();
  fetch('/trial/addTrial', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({input:data, trialEndTime})
  }) .then(response => {
    if(response.redirected) {
      window.location.href = response.url;
    }
  })
  .catch(err => {
    console.error(err)
  })

}

// Execute the `start` function after a delay
setTimeout(startTrial, 500);
