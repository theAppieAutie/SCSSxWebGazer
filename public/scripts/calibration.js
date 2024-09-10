window.onload = async function() {
        //start the webgazer tracker
        await webgazer.setRegression('ridge') /* currently must set regression and tracker */
                    //   .setTracker('clmtrackr')
                      .setGazeListener(function(data, clock) {
                        //   console.log(data); /* data is an object containing an x and y key which are the x and y prediction coordinates (no bounds limiting) */
                        //   console.log(clock); /* elapsed time in milliseconds since webgazer.begin() was called */
                       })
                       .showVideoPreview(false)
                       .showPredictionPoints(false)
                       .applyKalmanFilter(true)
                       .saveDataAcrossSessions(true)
                       .begin();
        webgazer
}

const proceed = () => {
    
    window.confirm("Thank you. You are ready to proceed");
    window.location.href = '/information/rules';
}

const calibrateWebGazer = point => {
    const rect = point.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    webgazer.recordScreenPosition(x, y);
}

const updateUserFeedback = point => {
    if (!calibrationPointsClicks[point.id]) {
        calibrationPointsClicks[point.id] = 0;
    }
    calibrationPointsClicks[point.id]++;
    if (calibrationPointsClicks[point.id] === 5) {
        point.style.backgroundColor = "red";
    }
    let numOfClicks = Object.values(calibrationPointsClicks);
    if (numOfClicks.length === points.length && numOfClicks.every(num => num >= 5)) {
        proceed();
    }
}

let calibrationPointsClicks = {};

const points = document.getElementsByClassName('calibration-point');

for (let i = 0; i < points.length; i++) {
    points[i].addEventListener('click', () => {
        let point = points[i]
        calibrateWebGazer(point);
        updateUserFeedback(point);
    })

}