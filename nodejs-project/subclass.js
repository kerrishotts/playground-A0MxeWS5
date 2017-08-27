// { autofold
class Rect {
    constructor(w, h) {
        this.w = w;
        this.h = h;
    }
    
    calculateArea() {
        return this.w * this.h;
    }
}
// }

class Square { // extend the Rect class (expand the above if needed) so that 
               // the constructor can accept a single argument (length), but
               // still calculates the area correctly (you should not need
               // to override `calculateArea`).
}

// { autofold
module.exports = {
    Rect,
    Square
}
