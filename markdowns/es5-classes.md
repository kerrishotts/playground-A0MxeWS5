In ES5, a class was defined using a **class function**. For example:

```javascript runnable
function Shape(id, origin) {
    this._kind = "shape";
    this.id = id;
    this.origin = origin || {x: 0, y: 0};
}

var shape = new Shape("aShape", {x: 5, y: 10});
console.log(shape.id);
```

In order to add methods to a class, ES5 requires us to modify the class's prototype if we're adding an instance method, or the class function if we're adding a static method, like this:

```javascript runnable
// { autofold
function Shape(id, origin) {
    this._kind = "shape";
    this.id = id;
    this.origin = origin || {x: 0, y: 0};
}
// }

/* Static method that returns the next unique number in a sequence */
Shape.nextUniqueNumber = function nextUniqueNumber() {
    return (Shape._sequence = (Shape._sequence !== undefined ? Shape._sequence + 1 : 1));
};

/* Instance method that returns a new version of the shape*/
Shape.prototype.clone = function clone(newId) {
    return new Shape(newId || 
        "" + this.id.split("::")[0] + "::" + Shape.nextUniqueNumber(), 
        this.origin);
};

var shape = new Shape("aShape", {x: 5, y: 10});
var anotherShape = shape.clone();

console.log(shape.id, JSON.stringify(shape.origin));
console.log(anotherShape.id, JSON.stringify(anotherShape.origin));
console.log(anotherShape.clone().id);
```

So far this isn't too bad, although programmers coming from a classical OOP perspective are probably squinting a little bit at the use of `prototype` in the above examples. The easiest way to think of a prototype is that all instances of the `Shape` class will have the same prototype, and thus the same methods. Since JavaScript is a dynamic language, it is possible to modify the prototype after some instances have been created. Even instances that were created before the prototype was modified will see the changes to the prototype.

Now, what if we wanted to create a subclass of `Shape`... say, `Rect` (rectangle)? ES5 requires us to wire up a subclass's prototype chain so that all the subclassed instances can inherit methods properly. Doing so isn't that pretty, as seen in the next snippet.

```javascript runnable
// { autofold
function Shape(id, origin) {
    this._kind = "shape";
    this.id = id;
    this.origin = origin || {x: 0, y: 0};
}

Shape.nextUniqueNumber = function nextUniqueNumber() {
    return (Shape._sequence = (Shape._sequence !== undefined ? Shape._sequence + 1 : 1));
};

Shape.prototype.clone = function clone(newId) {
    return new Shape(newId || 
        "" + this.id.split("::")[0] + "::" + Shape.nextUniqueNumber(), 
        this.origin);
};
// }

function Rect(id, origin, size) {
    Shape.call(this, id, origin);                // (A)
    this._kind = "rect";
    this.size = size || {w: 0, h: 0};
}

Rect.prototype = Object.create(Shape.prototype); // (B)
Rect.prototype.constructor = Rect;

var rect = new Rect("rect", {x: 10, y: 10}, {w: 20, h: 10});
var anotherRect = rect.clone();
console.log(JSON.stringify(rect));
console.log(JSON.stringify(anotherRect));
```
