In ES5, a class was defined using a **class function**. For example:

```javascript runnable
function Shape(id) {
    this._kind = "shape";
    this.id = id;
    this.points = [];
}

var shape = new Shape("aShape");
console.log(shape.id);
```

In order to add methods to a class, ES5 requires us to modify the class's prototype, like this:

```javascript runnable
// { autofold
function Shape(id) {
    this._kind = "shape";
    this.id = id;
    this.points = [];
}
// }

Shape.prototype.addPoint(x, y) {
    this.points.push({x: x, y: y});
}

Shape.prototype.addPoints(points) {
    points.forEach((function (point) {
        this.points.push(point);
    }).bind(this));
}

var shape = new Shape("rect0");
shape.addPoints([
    {x: 10, y: 10},
    {x: 10, y: 20},
    {x: 20, y: 20},
    {x: 20, y: 10}
]);
console.log(JSON.stringify(shape.points));
```

