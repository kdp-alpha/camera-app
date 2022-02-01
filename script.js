let video = document.querySelector("video");
let recordBtnCont = document.querySelector(".record-btn-cont");
let recordBtn = document.querySelector(".record-btn");
let captureBtnCont = document.querySelector(".capture-btn-cont");
let captureBtn = document.querySelector(".capture-btn");
let recorder;
let transperentColor = "transparent"
let chunks=[]; // will store media data in chunks
let recordFlag = false
let constraints = {
    video: true,
    audio: true
}
navigator.mediaDevices.getUserMedia(constraints)
.then((stream) =>{

    video.srcObject = stream

    recorder = new MediaRecorder(stream);

    recorder.addEventListener("start",(e) => {
        chunks = [];
    })


    recorder.addEventListener("dataavailable",(e)=>{
        chunks.push(e.data);
    })

    recorder.addEventListener("stop",(e)=>{
        //conversion of media chunks data to video

        let blob = new Blob(chunks, {type : "video/mp4"});
        // let videourl = URL.createObjectURL(blob);

        if(db) {
            let videoID = shortid();
            let dbTransaction = db.transaction("video","readwrite");
            let videoStore = dbTransaction.objectStore("video")
            let videoEntry = {
                id: `video-${videoID}`,
                blobData: blob
            }
            videoStore.add(videoEntry)
        }
        // let a = document.createElement("a");
        // a.href = videourl
        // a.download = "stream.mp4"
        // a.click();
    })
})

recordBtnCont.addEventListener("click",(e)=>{
    if(!recorder) return;

    recordFlag =! recordFlag

    if(recordFlag) // start recording
    {
        recorder.start();
        recordBtn.classList.add("scale-record");
        startTimer();
    }
    else{
        recorder.stop();
        recordBtn.classList.remove("scale-record");
        stopTimer();
    }

})

let timerid;
let counter = 0;
let timer = document.querySelector(".timer")
    function startTimer() {
        timer.style.display = "block"
    function displayTimer(){
        let totalsecond = counter;
        let hours = Number.parseInt(totalsecond /3600)
        totalsecond = totalsecond % 3600;

        let minutes = Number.parseInt(totalsecond/60);
        totalsecond = totalsecond%60;

        let seconds = totalsecond

        hours = (hours < 10) ? `0${hours}` : hours
        minutes = (minutes < 10) ? `0${minutes}` : minutes
        seconds = (seconds < 10) ? `0${seconds}` : seconds

        timer.innerText = `${hours}:${minutes}:${seconds}`

        counter++;
    }   
    timerid = setInterval(displayTimer,1000)
}

function stopTimer() {
    
    timer.style.display = "none"
    clearInterval(timerid)
    timer.innerText = "00:00:00";
}


captureBtn.addEventListener("click",(e) => {

    captureBtn.classList.add("scale-capture");

    let canvas = document.createElement("canvas");
    canvas.height = video.videoHeight;
    canvas.width = video.videoWidth;

    let tool = canvas.getContext("2d");

    tool.drawImage(video,0,0,canvas.width,canvas.height); 
    tool.fillStyle = transperentColor; 
    tool.fillRect(0,0,canvas.width,canvas.height);
    let imageURL = canvas.toDataURL();

    if(db) {
        let imageID = shortid();
        let dbTransaction = db.transaction("image","readwrite");
        let imageStore = dbTransaction.objectStore("image")
        let imageEntry = {
            id: `img-${imageID}`,
            url: imageURL
        }
        imageStore.add(imageEntry)
    }



    // let a = document.createElement("a");
    // a.href = imageURL;
    // a.download = "image.jpg";
    // a.click();
    setTimeout(()=>{
        captureBtn.classList.remove("scale-capture");
    },500)
  
})


let filterlayer = document.querySelector(".filter-layer")
let allFilter = document.querySelectorAll(".filter");
allFilter.forEach((filterelem)=>{
    filterelem.addEventListener("click",(e) => {
        transperentColor = getComputedStyle(filterelem).getPropertyValue("background-color");
        filterlayer.style.backgroundColor = transperentColor

    })
})


