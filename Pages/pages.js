let page = 1;
function setup() {
    createCanvas(400, 400);
}

function draw() {
    background(220);


    if (page === 1) {
        page1();
    } else if (page === 2) {
        page2();
    } else if (page === 3) {
        page3();
    } else if (page === 4) {
        page4();
    }

}
function page1() {
    background(220);
    fill(255, 0, 0);
    rect(10, 10, 100, 100);
}

function page2() {
    background(220);
    fill(255, 0, 0);
    rect(100, 100, 100, 100);
}

function page3() {
    background(220);
    fill(255, 0, 0);
    rect(200, 200, 100, 100);
}

function page4() {
    background(220);
    fill(255, 0, 0);
    rect(300, 300, 100, 100);
}
function mousePressed() {
    page++;
    if (page > 4) {
        page = 1;
    }
}