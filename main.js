
//global varbiles for the cardioid
//--------------------------------

let countNum = 1000;
let circleSize = 100.0;
let repNum = 276;
let pointR = 2;
let pointC = 1000;
let alpha = 0.4;
let interTime;
let repNumOffset = 0.001;
let repNumLimit = 700;

//--------------------------------

//media recording
let chunks = [];
let videoStream; 
let mediaRecorder = new MediaRecorder(document.getElementById('canvas').captureStream(30));; 
let video;

//toggles the wobble of the cardioid
let wobbleToggle = true;

//cardioid offsets for moveing it around with the mouse
let offSetX = 0;
let offSetY = 0;


//do not touch----
let T = 1;      //
let c;          //
let ctx;        //
//----------------


//init function
function init() {
    c = document.getElementById('canvas');
    c.width = window.innerWidth;
    c.height = window.innerHeight*0.89;
    if (c.width < 600) {
        countNum = 631;
        pointC = 327;
        repNum = 234;
    }
    if (c.height > c.width) {
    circleSize = c.width/4 - 10;
    c.height = window.innerHeight*0.7;
    }
    else {
        circleSize = c.height/4 - 10;
    }
    ctx = c.getContext('2d');
    videoStream = c.captureStream(30);
    mediaRecorder = new MediaRecorder(videoStream);
    video = document.querySelector("video");
    ctx.translate(c.width/2,c.height/2);
    document.getElementById('countNum').value = countNum ;
    document.getElementById('pointC').value = pointC;
    document.getElementById('repNum').value = repNum;
    window.onresize = (e) => {
        reSize(c,ctx);
    }
    c.onwheel = (e) => {
        let dep = parseInt(circleSize)/22;
        if (e.deltaY > 1) {
            circleSize= parseInt(circleSize)-dep;
            offSetX -= offSetX/22;
            offSetY -= offSetY/22;

        } else {
            circleSize= parseInt(circleSize)+dep;
            offSetX += offSetX/22;
            offSetY += offSetY/22;
        }
    }

    let onDown = false;
    let startX = 0;
    let startY = 0;
    c.onmousedown = (e) => {
        onDown = true;
        startX = e.pageX-offSetX;
        startY = e.pageY-offSetY;
    }
    c.onmousemove = (e) => {
        if (onDown) {
            console.log(e.pageX-startX);
            let _x = e.pageX-startX;
            let _y = e.pageY-startY;
            offSetX=_x;
            offSetY=_y;
        }
    }
    c.onmouseup =(e)=>{
        onDown =false;
    }


    readFromDom();
    updateRepNumOffset();
    document.getElementById('ButtonMinus').addEventListener("click", function() {
        repNum--;
        document.getElementById('repNum').value = repNum;
        refresh();
    });
    document.getElementById('ButtonPlus').addEventListener("click", function() {
        repNum++;
        document.getElementById('repNum').value = repNum;
        refresh();
    });
    document.getElementById('wobbleButton').onclick = (e) => {
        e.preventDefault();
        if (wobbleToggle) {
            e.target.innerText = "wobble off";
        } else {
            e.target.innerText = "wobble on"
        }
        wobbleToggle = !wobbleToggle;
    }

    Array.from(document.getElementsByTagName("input"))
    .forEach((e) => {
        e.addEventListener("keypress", (eve) => {
            if (eve.key ==="Enter") {
                refresh();
            }
        })
    })

    refresh();
    interTime = setInterval(wobble, 50);
}

//resizes the canves when the window is resized
function reSize(c,ctx) {
    c.width = window.innerWidth;
    c.height = window.innerHeight*0.89;
    if (c.height > c.width) {
        c.height = window.innerWidth;
    } 
    ctx.translate(c.width/2,c.height/2);
}

//wobbles the cardioid using a sin wave
function wobble() {
    repNum2 = repNum;
    if (wobbleToggle) {
	x = repNumOffset * Math.sin(((Math.PI)*2) * T / repNumLimit);
	if (T >= 4*repNumLimit) {T = 0;}
    repNum2 = parseFloat(repNum);
    repNum2 += x;
    T++; 
    }
    ctx.clearRect(0-c.width/2,0-c.height/2,c.width,c.height);
    ctx.fillStyle = "#141414";
    ctx.rect(0-c.width/2,0-c.height/2,c.width,c.height);
    ctx.fill();
    ctx.fillStyle = "white";
    drawLines(repNum2);
}

//redraws the cardioid
function refresh() {
    readFromDom();
    ctx.clearRect(0-c.width/2,0-c.height/2,c.width,c.height);
    ctx.fillStyle = "#141414";
    ctx.rect(0-c.width/2,0-c.height/2,c.width,c.height);
    ctx.fill();
    drawLines(repNum);
}

//reads the values from the dom inputs
function readFromDom() {
countNum = document.getElementById('countNum').value;
pointC = document.getElementById('pointC').value;
alpha = document.getElementById('alphaValue').value;
repNum = document.getElementById('repNum').value;
}

//draws a point on the screen
function drawPoint(x,y,s) {
    ctx.beginPath();
    ctx.arc(x, y, s*2, 0, 2 * Math.PI);
    ctx.stroke();
}

//draws a line between two cordinates
function drawLine(a1,a2) {
    ctx.strokeStyle = "rgba(230, 238, 252," + alpha + ")";
    ctx.beginPath(); 
    // Staring point (10,45)
    ctx.moveTo(a1[0]+offSetX,a1[1]+offSetY);
    // End point (180,47)
    ctx.lineTo(a2[0]+offSetX,a2[1]+offSetY);
    // Make the line visible
    ctx.stroke();
    ctx.closePath();

}

//draws the cardioid, takes a offset called rp
function drawLines(rp) {

    for (i=0;i<countNum;i++) {
        t = (i) % pointC;
        t2 = (i+i)*rp % pointC;
        newp = getPointOnCircle(circleSize, pointC, t);
        newp2 = getPointOnCircle(circleSize, pointC, t2);
        drawLine(newp,newp2);
     
    }
}

//returns the xy position of a given point along a circle
function getPointOnCircle(r,pointCount,point) {
    newDeg = (2 * Math.PI)/pointCount;
    x = 2*r * Math.cos(newDeg * point);
    y = 2*r * Math.sin(newDeg * point);
    return [x,y];
}

//draws a outline of the cardioid and draws points on the circles circumference 
//for each number of points --pointCount
function drawCircle(r, pointCount) {
    drawPoint(0,0,circleSize);
    newDeg = (2 * Math.PI)/pointCount;
    for (i = 0; i < pointCount; i++) {
    x = 2*r * Math.cos(newDeg * i);
    y = 2*r * Math.sin(newDeg * i);
	ctx.fillStyle= "white";
    ctx.fillText(i, ((2*r)+40) * Math.cos(newDeg *i), ((2*r)+40) * Math.sin(newDeg*i));
    drawPoint(x,y,pointR);
    }


}

//---------- helper functions -------- 


mediaRecorder.ondataavailable = function(e) {
  chunks.push(e.data);
};
mediaRecorder.onstop = function(e) {
    var blob = new Blob(chunks, { 'type' : 'video/mp4' }); // other types are available such as 'video/webm' for instance, see the doc for more info
     chunks = [];
     var videoURL = URL.createObjectURL(blob);
     video.src = videoURL;
};

function updateRepNumOffset() {
		repNumOffset = scale2(pointC,[0,5000],[0.0005,0.07]);
}
function scale2(value, srcRange, dstRange){
    // value is outside source range return
    if (value < srcRange[0] || value > srcRange[1]){
      return NaN; 
    }
  
    var srcMax = srcRange[1] - srcRange[0],
        dstMax = dstRange[1] - dstRange[0],
        adjValue = value - srcRange[0];
  
    return (adjValue * dstMax / srcMax) + dstRange[0];
  
  }
const scale = (num, in_min, in_max, out_min, out_max) => {
    return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
  }
document.addEventListener("DOMContentLoaded", function() {
    init();
});

