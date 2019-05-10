let qtree;
let bounds;
let mousepos;
var highlightcheckbox;
var resetbox;
var animatebox;
var speedslider;

function setup() {
  //frameRate(30);
  //clunky



  canvasSize = windowHeight * .5;
  canvasW = canvasSize;
  canvasH = canvasSize;

  canvasSize *= 5 / 3;

  canvasX = canvasSize / 2;
  canvasY = canvasSize / 2;

  cnv = createCanvas(canvasSize, canvasSize);
  let bounds = new Rectangle(canvasX, canvasY, canvasW, canvasH);
  qtree = new QuadTree(bounds, 0, random(0, 255), random(0, 255), random(0, 255));

  mousepos = new point(mouseX, mouseY);

  highlightcheckbox = createCheckbox('Show Zones', false);
  highlightcheckbox.position(width / 2, height);

  resetbox = createCheckbox('Reset', false);
  resetbox.position(width / 3, height);

  animatebox = createCheckbox('Animate', false);
  animatebox.position(width / 2, height + 20);


  speedslider = createSlider(1, 75, 50, 1);
  speedslider.position(width / 2, height + 40);
  speedslider.style('width', '160px');

  cnv.mouseWheel(changemotif);
  background(0);

  qtree.split(new point(width / 2, height / 2));
  redraw();
}

function draw() {
  if (resetbox.checked()) {
    speedslider.remove();
    setup();
  }

  if (animatebox.checked()) {
    val = speedslider.value();
    qtree.scrollAll(val);
  }

  background(qtree.color[0]);
  mousepos = new point(mouseX, mouseY);
  qtree.drawtiles();



  if (highlightcheckbox.checked()) {
    qtree.highlight(mousepos);
    qtree.show();
  }
}

function changemotif(event) {
  mousepos = new point(mouseX, mouseY);
  qtree.scroll(event.deltaY, mousepos);
}

function mouseClicked() {
  qtree.split(mousepos);
  redraw();
}
