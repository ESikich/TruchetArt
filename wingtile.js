class wingtile {
  constructor(motif, phase, boundary, color) {
    //motif is the pattern, phase is white on black or black on white

    this.motif = motif;
    this.phase = phase;
    this.boundary = boundary;
    this.color = color;

    if (this.phase) {
      let tempcol;
      tempcol = this.color[1];
      this.color[1] = this.color[0];
      this.color[0] = tempcol;
    }
  }

  drawtile() {
    let x = this.boundary.x;
    let y = this.boundary.y;
    let w = this.boundary.w;
    let h = this.boundary.h;
    let smallr =  w / 6;
    let bigr =  w / 3;
    let arcd = 2 * 2 * w / 3;

    noStroke();
    //stroke(this.color[1]);
    rectMode(CENTER);
    fill(this.color[1]);
    rect(x, y, w, h);
    fill(this.color[0]);

    switch (this.motif) {

      case "\\":
        arc(x + w/2, y - h/2, arcd, arcd, PI / 2, PI);
        arc(x - w/2, y + h/2, arcd, arcd, 3 * PI / 2, 2 * PI);

        break;
      case "/":
        arc(x - w/2, y - h/2, arcd, arcd, 0, PI / 2);
        arc(x + w/2, y + h/2, arcd, arcd, PI, 3 * PI / 2);

        break;
      case "-":
        rect(x, y, w, smallr*2);
        break;
      case "|":
        rect(x, y, smallr*2, h);
        break;
      case "+.":

        break;
      case "x.":

        fill(this.color[0]);
        rect(x, y, w, h);
        break;
      case "+":
        rect(x, y, w, smallr*2);
        rect(x, y, smallr*2, h);
        break;
      case "fne":
        arc(x + w/2, y - h/2, arcd, arcd, PI / 2, PI);

        break;
      case "fsw":
        arc(x - w/2, y + h/2, arcd, arcd, 3 * PI / 2, 2 * PI);

        break;
      case "fnw":
        arc(x - w/2, y - h/2, arcd, arcd, 0, PI / 2);

        break;
      case "fse":
        arc(x + w/2, y + h/2, arcd, arcd, PI, 3 * PI / 2);

        break;
      case "tn":

        fill(this.color[0]);
        rect(x, y - smallr, w, bigr*2);
        break;
      case "ts":

        fill(this.color[0]);
        rect(x, y + smallr, w, bigr*2);

        break;
      case "te":

        fill(this.color[0]);
        rect(x + smallr, y, bigr*2, h);
        break;
      case "tw":

        fill(this.color[0]);
        rect(x - smallr, y, bigr*2, h);
        break;
      default:
    }
    
    fill(this.color[1]);
    circle(x - w/2, y - h/2, bigr);
    circle(x + w/2, y - h/2, bigr);
    circle(x - w/2, y + h/2, bigr);
    circle(x + w/2, y + h/2, bigr);

    fill(this.color[0]);
    circle(x, y - h/2, smallr);
    circle(x + w/2, y, smallr);
    circle(x, y + h/2, smallr);
    circle(x - w/2, y, smallr);
  }
}
