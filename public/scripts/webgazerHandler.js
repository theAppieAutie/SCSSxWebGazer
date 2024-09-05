
function checkGazeSection(x, y) {
    const sections = [
        {id: "Section 1", x1: 0, x2: window.innerWidth / 3, y1: 0, y2: window.innerHeight / 2},
        {id: "Section 2", x1: window.innerWidth / 3, x2: 2 * window.innerWidth / 3, y1: 0, y2: window.innerHeight / 2},
        {id: "Section 3", x1: 2 * window.innerWidth / 3, x2: window.innerWidth, y1: 0, y2: window.innerHeight / 2},
        {id: "Section 4", x1: 0, x2: window.innerWidth / 3, y1: window.innerHeight / 2, y2: window.innerHeight},
        {id: "Section 5", x1: window.innerWidth / 3, x2: 2 * window.innerWidth / 3, y1: window.innerHeight / 2, y2: window.innerHeight},
        {id: "Section 6", x1: 2 * window.innerWidth / 3, x2: window.innerWidth, y1: window.innerHeight / 2, y2: window.innerHeight},
    ];

    for (let section of sections) {
        if (x >= section.x1 && x <= section.x2 && y >= section.y1 && y <= section.y2) {
            console.log(`Gaze in ${section.id}`);
            break;
        }
    }
}

function initialiseWebGazer() {
    webgazer.setRegression('ridge')
            .setGazeListener(function(data, elapsedTime) {
                if (data == null || !data.x || !data.y) {
                    return;
                }
                const x = data.x;
                const y = data.y;

                checkGazeSection(x,y);
            })
            .showVideo(false)
            .showPredictionPoints(false)
            .begin();
    webGazerInit = true;
}

function pauseWebGazer() {
    webgazer.pause();
    console.log("webgazer paused");
}

function resumeWebGazer() {
    webgazer.resume();
    console.log("Webgazer continued");
}

function endWebGazer() {
    // clean up stored data
    webgazer.end()
}


