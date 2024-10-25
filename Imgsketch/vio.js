let video;
let playButton, pauseButton;

function setup() {
    noCanvas();
    video = createVideo(['videoplayback.mp4']);
    video.size(1280, 315);
    video.play();

    playButton = createButton('Play');
    playButton.mousePressed(playVideo);
    playButton.position(10, 10); 

    pauseButton = createButton('Pause');
    pauseButton.mousePressed(pauseVideo);
    pauseButton.position(10, 50); 
}

function draw() {
    background(255);
    image(video, 0, 0);
}

function playVideo() {
    video.play();
}

function pauseVideo() {
    video.pause();
}