const MotifEnum = Object.freeze({ M0: "M0", M1: "M1", M2: "M2" /*others*/ });

const Motif = {
  // object that maps the different motifs to their corresponding drawing function
  motifFunctions: {
    M0: (x, y, w, h, color) => {
      arc(x + w / 2, y - h / 2, arcd, arcd, PI / 2, PI);
      arc(x - w / 2, y + h / 2, arcd, arcd, (3 * PI) / 2, 2 * PI);
    },
    M1: (x, y, w, h, color) => {
      arc(x - w / 2, y - h / 2, arcd, arcd, 0, PI / 2);
      arc(x + w / 2, y + h / 2, arcd, arcd, PI, (3 * PI) / 2);
    },
    M2: (x, y, w, h, color) => {
      rect(x, y, w, smallr * 2);
    },
    M3: (x, y, w, h, color) => {
      rect(x, y, smallr * 2, h);
    },
    M4: (x, y, w, h, color) => {},
    M5: (x, y, w, h, color) => {
      fill(this.color[0]);
      rect(x, y, w, h);
    },
    M6: (x, y, w, h, color) => {
      rect(x, y, w, smallr * 2);
      rect(x, y, smallr * 2, h);
    },
    M7: (x, y, w, h, color) => {
      arc(x + w / 2, y - h / 2, arcd, arcd, PI / 2, PI);
    },
    M8: (x, y, w, h, color) => {
      arc(x - w / 2, y + h / 2, arcd, arcd, (3 * PI) / 2, 2 * PI);
    },
    M9: (x, y, w, h, color) => {
      arc(x - w / 2, y - h / 2, arcd, arcd, 0, PI / 2);
    },
    M10: (x, y, w, h, color) => {
      arc(x + w / 2, y + h / 2, arcd, arcd, PI, (3 * PI) / 2);
    },
    M11: (x, y, w, h, color) => {
      fill(this.color[0]);
      rect(x, y - smallr, w, bigr * 2);
    },
    M12: (x, y, w, h, color) => {
      fill(this.color[0]);
      rect(x, y + smallr, w, bigr * 2);
    },
    M13: (x, y, w, h, color) => {
      fill(this.color[0]);
      rect(x + smallr, y, bigr * 2, h);
    },
    M14: () => {
      fill(this.color[0]);
      rect(x - smallr, y, bigr * 2, h);
    },
  },

  draw: (motif, x, y, w, h, color) => {
    Motif.motifFunctions[motif](x, y, w, h, color);
  },
};

class Queue {
  constructor() {
    this.q = { hed: null, tal: null, s: 0 };
  }
  get len() {
    return this.q.s;
  }
  get emt() {
    return !this.q.s;
  }
  enq(v) {
    let n = { v, n: null };
    if (!this.q.tal) this.q.hed = this.q.tal = n;
    else this.q.tal = this.q.tal.n = n;
    this.q.s++;
  }
  deq() {
    if (!this.q.hed) return;
    let v = this.q.hed.v;
    this.q.hed = this.q.hed.n;
    this.q.s--;
    if (!this.q.hed) this.q.tal = null;
    return v;
  }
}

function isInRange(point, range) {
  return (
    point.x >= range.x - range.w / 2 &&
    point.x < range.x + range.w / 2 &&
    point.y >= range.y - range.h / 2 &&
    point.y < range.y + range.h / 2
  );
}

class Rectangle {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }
  contains(point) {
    return isInRange(point, this);
  }
  intersects(range) {
    return isInRange(this, range);
  }
}

class point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class wingtile {
  constructor(motif, phase, boundary, color) {
    this.motif = motif;
    this.phase = phase;
    this.boundary = boundary;
    this.color = color;

    if (this.phase) {
      [this.color[0], this.color[1]] = [this.color[1], this.color[0]];
    }
  }

  drawtile() {
    let { x, y, w, h } = this.boundary;
    let smallr = w / 6;
    let bigr = w / 3;
    let arcd = (2 * 2 * w) / 3;

    noStroke();
    //stroke(this.color[1]);
    rectMode(CENTER);
    fill(this.color[1]);
    rect(x, y, w, h);
    fill(this.color[0]);

    switch (this.motif) {
      case "\\":
        arc(x + w / 2, y - h / 2, arcd, arcd, PI / 2, PI);
        arc(x - w / 2, y + h / 2, arcd, arcd, (3 * PI) / 2, 2 * PI);

        break;
      case "/":
        arc(x - w / 2, y - h / 2, arcd, arcd, 0, PI / 2);
        arc(x + w / 2, y + h / 2, arcd, arcd, PI, (3 * PI) / 2);

        break;
      case "-":
        rect(x, y, w, smallr * 2);
        break;
      case "|":
        rect(x, y, smallr * 2, h);
        break;
      case "+.":
        break;
      case "x.":
        fill(this.color[0]);
        rect(x, y, w, h);
        break;
      case "+":
        rect(x, y, w, smallr * 2);
        rect(x, y, smallr * 2, h);
        break;
      case "fne":
        arc(x + w / 2, y - h / 2, arcd, arcd, PI / 2, PI);

        break;
      case "fsw":
        arc(x - w / 2, y + h / 2, arcd, arcd, (3 * PI) / 2, 2 * PI);

        break;
      case "fnw":
        arc(x - w / 2, y - h / 2, arcd, arcd, 0, PI / 2);

        break;
      case "fse":
        arc(x + w / 2, y + h / 2, arcd, arcd, PI, (3 * PI) / 2);

        break;
      case "tn":
        fill(this.color[0]);
        rect(x, y - smallr, w, bigr * 2);
        break;
      case "ts":
        fill(this.color[0]);
        rect(x, y + smallr, w, bigr * 2);

        break;
      case "te":
        fill(this.color[0]);
        rect(x + smallr, y, bigr * 2, h);
        break;
      case "tw":
        fill(this.color[0]);
        rect(x - smallr, y, bigr * 2, h);
        break;
      default:
    }

    const coords = [
      [x - w / 2, y - h / 2],
      [x + w / 2, y - h / 2],
      [x - w / 2, y + h / 2],
      [x + w / 2, y + h / 2],
      [x, y - h / 2],
      [x + w / 2, y],
      [x, y + h / 2],
      [x - w / 2, y],
    ];
    for (let i = 0; i < coords.length; i++) {
      fill(i < 4 ? this.color[1] : this.color[0]);
      circle(coords[i][0], coords[i][1], i < 4 ? bigr : smallr);
    }
  }
}

class QuadTree {
  constructor(boundary, tier, r, g, b) {
    this.boundary = boundary;
    this.divided = false;
    this.divisions = {};
    this.tier = tier;
    this.overbox = false;
    this.motiflist = [
      "/",
      "\\",
      "-",
      "|",
      "+.",
      "x.",
      "+",
      "fne",
      "fsw",
      "fnw",
      "fse",
      "tn",
      "ts",
      "te",
      "tw",
    ];
    let col;

    this.color = [
      color(r, g / 1.25, b / 1.5),
      color(255 - r + 128, 255 - g + 128, (255 - b + 128) / 2),
    ];

    this.phase = this.tier % 2;
    this.motifindex = int(random(0, 14));
    this.motif = this.motiflist[this.motifindex];
    this.tile = new wingtile(this.motif, this.phase, this.boundary, this.color);

    this.edgeHover = color(0, 255, 0);
    this.fillHover = color(0, 64, 0);
    this.edgeSelected = color(255);
    this.fillSelected = color(255);
    this.edgeNeut = color(255);
    this.fillNeut = color(0);
    this.edgecol = this.edgeNeut;
    this.fillcol = this.fillNeut;
    this.discovered = false;
  }

  scrollAll(s) {
    for (let i = 0; i < 4; ++i) {
      if (!this.divided) {
        if (frameCount % int((64 * s) / pow(2, this.tier)) == 0) {
          ++this.motifindex;
          if (this.motifindex > this.motiflist.length) this.motifindex = 0;
          this.motif = this.motiflist[this.motifindex];
        }
      } else {
        this.divisions[i].scrollAll(s);
      }
    }
  }

  scroll(deltaY, point) {
    if (!this.boundary.contains(point)) {
      return false;
    }

    if (!this.divided) {
      this.motifindex =
        (((this.motifindex + deltaY / abs(deltaY)) % this.motiflist.length) +
          this.motiflist.length) %
        this.motiflist.length;
      this.motif = this.motiflist[this.motifindex];
    } else {
      for (let i = 0; i < 4; ++i) {
        if (this.divisions[i].scroll(deltaY, point)) {
          return true;
        }
      }
    }
  }

  divide() {
    let subtier = this.tier + 1;
    let x = this.boundary.x;
    let y = this.boundary.y;
    let w = this.boundary.w;
    let h = this.boundary.h;
    let col, r, g, b;

    if (this.tier == 0) {
      r = random(0, 255);
      g = random(0, 63);
      b = random(0, 127);
    } else {
      let cv = 128 - pow(2, this.tier);
      r = (red(this.color[0]) + random(-cv, cv)) / 2;
      g = (green(this.color[0]) + random(-cv, cv)) / 2;
      b = (blue(this.color[0]) + random(-cv, cv)) / 2;
      if (r > 255) r = 255;
      if (g > 255) g = 255;
      if (b > 255) b = 255;
      if (r < 0) r = 0;
      if (g < 0) g = 0;
      if (b < 0) b = 0;
    }

    let ne = new Rectangle(x + w / 4, y - h / 4, w / 2, h / 2);
    this.divisions[0] = new QuadTree(ne, subtier, r, g, b);
    let nw = new Rectangle(x - w / 4, y - h / 4, w / 2, h / 2);
    this.divisions[1] = new QuadTree(nw, subtier, r, g, b);
    let se = new Rectangle(x + w / 4, y + h / 4, w / 2, h / 2);
    this.divisions[2] = new QuadTree(se, subtier, r, g, b);
    let sw = new Rectangle(x - w / 4, y + h / 4, w / 2, h / 2);
    this.divisions[3] = new QuadTree(sw, subtier, r, g, b);
    this.divided = true;
  }

  highlight(point) {
    if (!this.boundary.contains(point)) {
      return false;
    }

    if (!this.divided) {
      this.overbox = true;
    } else {
      for (let i = 0; i < 4; i++) {
        if (this.divisions[i].highlight(point)) {
          return true;
        }
      }
    }
  }

  drawtiles() {
    let drawqueue = new Queue();
    let traverse = new Queue();
    traverse.enq(this);

    let node;

    while (!traverse.emt) {
      node = traverse.deq();
      if (node.divided) {
        for (let i = 0; i < 4; i++) {
          traverse.enq(node.divisions[i]);
        }
      } else {
        node.tile.motif = node.motif;
        drawqueue.enq(node.tile);
      }
    }

    while (!drawqueue.emt) {
      let tile = drawqueue.deq();
      tile.drawtile();
    }
  }

  show() {
    let drawqueue = new Queue();
    let traverse = new Queue();
    traverse.enq(this);

    let node;

    while (!traverse.emt) {
      node = traverse.deq();
      if (node.divided) {
        for (let i = 0; i < 4; ++i) {
          traverse.enq(node.divisions[i]);
        }
      } else {
        drawqueue.enq(node);
      }
    }

    push();
    noFill();
    strokeWeight(1);
    rectMode(CENTER);

    while (!drawqueue.emt) {
      let node = drawqueue.deq();
      if (node.overbox && !drawqueue.emt) {
        drawqueue.enq(node);
        continue;
      } else if (node.overbox && drawqueue.emt) {
        stroke(node.edgeHover);
        rect(
          node.boundary.x,
          node.boundary.y,
          node.boundary.w,
          node.boundary.h
        );
        node.overbox = false;
      } else {
        stroke(node.edgeNeut);
        rect(
          node.boundary.x,
          node.boundary.y,
          node.boundary.w,
          node.boundary.h
        );
      }
    }
    pop();
  }

  split(point) {
    if (!this.boundary.contains(point)) {
      return false;
    }

    if (!this.divided) {
      this.divide();
    } else {
      for (let i = 0; i < 4; i++) {
        if (this.divisions[i].split(point)) {
          return true;
        }
      }
    }
  }
}

function setup() {
  const canvas = {
    size: (windowHeight * 5) / 6,
    w: windowHeight * 0.5,
    h: windowHeight * 0.5,
    x: (windowHeight * 0.5 * 5) / 6,
    y: (windowHeight * 0.5 * 5) / 6,
  };

  cnv = createCanvas(canvas.size, canvas.size);

  let bounds = new Rectangle(canvas.x, canvas.y, canvas.w, canvas.h);
  qtree = new QuadTree(
    bounds,
    0,
    random(0, 255),
    random(0, 255),
    random(0, 255)
  );

  mousepos = new point(mouseX, mouseY);

  highlightcheckbox = createCheckbox("Show Zones", false);
  highlightcheckbox.position(width / 2, height);

  resetbox = createCheckbox("Reset", false);
  resetbox.position(width / 3, height);

  animatebox = createCheckbox("Animate", false);
  animatebox.position(width / 2, height + 20);

  speedslider = createSlider(1, 75, 50, 1);
  speedslider.position(width / 2, height + 40);
  speedslider.style("width", "160px");

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
