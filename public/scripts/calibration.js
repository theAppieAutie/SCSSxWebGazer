window.onload = function() {
    const overlay = document.getElementById('overlay');
    webgazer.setRegression('ridge')
            .setTracker('TFFacemesh')
            .showVideo(false)
            .showFaceOverlay(false)
            .showFaceFeedbackBox(false)
            .showPredictionPoints(true)
            .applyKalmanFilter(true)
            .begin()
    setInterval(() => {
        webgazer.getCurrentPrediction()
                .then(resolve => {
                    const timestamp = Date.now();
                    webgazer.storePoints(resolve.x, resolve.y, timestamp)
                })
                .catch(err => {
                    console.log("Error", err)
                })
    }, 100);
    // Set up calibration points and their event listeners
    setupCalibrationPoints();
};

function setupCalibrationPoints() {
    const points = document.getElementsByClassName('calibration-point');
    for (let point of points) {
        point.addEventListener('click', function() {
            let rect = point.getBoundingClientRect();
            webgazer.recordScreenPosition(rect.left + window.scrollX, rect.top + window.scrollY, 'click');
            // Provide feedback to user about the calibration progress
            point.style.backgroundColor = 'green';
            point.classList.add('calibrated');
            setUpArrays()
            // Repeat calibration to improve accuracy
            setTimeout(() => {
                point.style.backgroundColor = 'red';
            }, 2000);
        });
    }
}

function setUpArrays() {
    const points = webgazer.getStoredPoints();
    const xPoints = Object.values(points[0])
    const yPoints = Object.values(points[1])

    for (let i = 0; i < xPoints.length; i++) {
        console.log(checkGazeSection(xPoints[i], yPoints[i]));
    }

}

function checkCalibrationCompletion() {
    const points = document.getElementsByClassName('calibration-point');
    let allCalibrated = true;
    for (let point of points) {
        if (!point.classList.contains('calibrated')) {
            allCalibrated = false;
            break;
        }
    }
    if (allCalibrated) {
        document.getElementById('instructions').innerText = "Calibration complete. Move your gaze to test.";
    }
}

function checkGazeSection(x, y) {
    const sections = [
        {color: "red", id: "Top Left", x1: 0, x2: window.innerWidth / 3, y1: 0, y2: window.innerHeight / 2},
        {color: "orange", id: "Middle Top", x1: window.innerWidth / 3, x2: 2 * window.innerWidth / 3, y1: 0, y2: window.innerHeight / 2},
        {color: "yellow", id: "Top Right", x1: 2 * window.innerWidth / 3, x2: window.innerWidth, y1: 0, y2: window.innerHeight / 2},
        {color: "green", id: "Bottom Left", x1: 0, x2: window.innerWidth / 3, y1: window.innerHeight / 2, y2: window.innerHeight},
        {color: "blue", id: "Middle Bottom", x1: window.innerWidth / 3, x2: 2 * window.innerWidth / 3, y1: window.innerHeight / 2, y2: window.innerHeight},
        {color: "purple", id: "Bottom Right", x1: 2 * window.innerWidth / 3, x2: window.innerWidth, y1: window.innerHeight / 2, y2: window.innerHeight},
    ];


    for (let section of sections) {
        if (x >= section.x1 && x <= section.x2 && y >= section.y1 && y <= section.y2) {
            // console.log(`Section gaze is in ${section.id}`);
            return section.id
        }
    }
}


