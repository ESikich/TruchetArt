class Rectangle {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }
  contains(point) {
    return (point.x >= this.x - this.w / 2 &&
      point.x < this.x + this.w / 2 &&
      point.y >= this.y - this.h / 2 &&
      point.y < this.y + this.h / 2);
  }

  intersects(range) {
    return !(range.x - range.w / 2 > this.x + this.w / 2 ||
      range.x + range.w / 2 < this.x - this.w / 2 ||
      range.y - range.h / 2 > this.y + this.h / 2 ||
      range.y + range.h / 2 < this.y - this.h / 2);
  }
}

class point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class QuadTree {
  constructor(boundary, tier, r, g, b) {

    //some of this logic sucks like, it shouldnt be repeated in every child

    //idea: main frame body, with array of all descendants. each parent has pointer to its children
    //child just has
    this.boundary = boundary;
    this.divided = false;
    this.divisions = {};
    this.tier = tier;
    this.overbox = false;
    this.motiflist = ["/", "\\", "-", "|", "+.", "x.", "+", "fne", "fsw", "fnw", "fse", "tn", "ts", "te", "tw"];
    let col;

    this.color = [color(r, g/1.25, b / 1.5),
      color(((255 - r) + 128), ((255 - g) + 128), ((255 - b) + 128)/2)
    ];

    //wingtile logic
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
        if (frameCount % int((64*s) / pow(2, this.tier)) == 0) {
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
      this.motifindex = (((this.motifindex + deltaY / abs(deltaY)) % this.motiflist.length) + this.motiflist.length) % this.motiflist.length;
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
      let cv = 128 - pow(2,this.tier);
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

  drawtiles() { //this needs to be a breadth first search{

    let drawqueue = new Queue();
    let traverse = new Queue();
    traverse.enqueue(this);
    //drawqueue.enqueue(this.tile);

    let node;

    while (!traverse.isEmpty()) {
      node = traverse.dequeue();
      if (node.divided) {
        for (let i = 0; i < 4; i++) {
          traverse.enqueue(node.divisions[i]);
        }
      } else {
        //this is a getaround, sloppy code
        node.tile.motif = node.motif;
        drawqueue.enqueue(node.tile);
      }
    }

    while (!drawqueue.isEmpty()) {
      let tile = drawqueue.dequeue();
      tile.drawtile();
    }
  }

  show() {

    let drawqueue = new Queue();
    let traverse = new Queue();
    traverse.enqueue(this);
    //drawqueue.enqueue(this.tile);
    //traverse queue is like O(n^2) space and i'm doing it twice omg

    let node;

    while (!traverse.isEmpty()) {
      node = traverse.dequeue();
      if (node.divided) {
        for (let i = 0; i < 4; ++i) {
          traverse.enqueue(node.divisions[i]);
        }
      } else {
        drawqueue.enqueue(node);
      }
    }

    push()
    noFill();
    strokeWeight(1);
    rectMode(CENTER);

    while (!drawqueue.isEmpty()) {
      let node = drawqueue.dequeue();
      if (node.overbox && !drawqueue.isEmpty()) {
        drawqueue.enqueue(node);
        continue;
      } else if (node.overbox && drawqueue.isEmpty()) {
        stroke(node.edgeHover);
        rect(node.boundary.x, node.boundary.y, node.boundary.w, node.boundary.h);
        node.overbox = false;
      } else {
        stroke(node.edgeNeut)
        rect(node.boundary.x, node.boundary.y, node.boundary.w, node.boundary.h);
      }
    }
    pop()
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
