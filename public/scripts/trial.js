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
const timePerPacket = (config.packetTimeOnScreen * 1000) * packetArray.length <= timeForTrial ? config.packetTimeOnScreen : (timeForTrial / packetArray.length) / 1000; 



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
  dot.style.opacity = "0";
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


function animatePackets() {
  console.log("animating packets")
  const packets = document.querySelectorAll('.dot');
  packets.forEach((packet, index) => {
    let delayTime = (index + 1) * timePerPacket / 2;
    console.log(delayTime)
    packet.style.animation = `dot-move ${timePerPacket}s linear ${delayTime}s 1`;
  })
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

const sections = [
  {color: "red", id: "LEFT --- TOP", x1: 0, x2: window.innerWidth / 3, y1: 0, y2: window.innerHeight / 2},
  {color: "orange", id: "MIDDLE --- TOP", x1: window.innerWidth / 3, x2: 2 * window.innerWidth / 3, y1: 0, y2: window.innerHeight / 2},
  {color: "yellow", id: "RIGHT --- TOP", x1: 2 * window.innerWidth / 3, x2: window.innerWidth, y1: 0, y2: window.innerHeight / 2},
  {color: "green", id: "LEFT --- BOTTOM", x1: 0, x2: window.innerWidth / 3, y1: window.innerHeight / 2, y2: window.innerHeight},
  {color: "blue", id: "MIDDLE --- BOTTOM", x1: window.innerWidth / 3, x2: 2 * window.innerWidth / 3, y1: window.innerHeight / 2, y2: window.innerHeight},
  {color: "purple", id: "RIGHT --- BOTTOM", x1: 2 * window.innerWidth / 3, x2: window.innerWidth, y1: window.innerHeight / 2, y2: window.innerHeight},
];

window.addEventListener('load',() => {
  let lastUpdate = 0;
  const intervalForChecks = 200;
  webgazer.params.moveTickSize = 100;
  webgazer.params.dataTimestep = 200;
  webgazer.setRegression('ridge')
          .showVideoPreview(false)
          .showPredictionPoints(false)
          .applyKalmanFilter(false)
          .saveDataAcrossSessions(true)
          .setGazeListener((data, time) => {
            if (data == null) {
              return;
            }
            if (time - lastUpdate > intervalForChecks) {
              lastUpdate = time;
              const x = data.x;
              const y = data.y;
            }

          })
          .begin()
          .then(() => {
            startTrial();
          });
  function checkGazeSection(x, y) {
    for (let section of sections) {
        if (x >= section.x1 && x <= section.x2 && y >= section.y1 && y <= section.y2) {
            console.log(section.id)
            break;
        }
    }
  }
})
