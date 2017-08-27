In ES5, a class was defined using a **class function**. For example:

```javascript runnable
function Component(props) {
    this.props = props || {};
    this.state = {};
}

var c = new Component({title: "hello!"});
console.log(JSON.stringify(c.props));
```

In order to add methods to a class, ES5 requires us to modify the class's prototype if we're adding an instance method, or the class function if we're adding a static method, like this:

```javascript runnable
// { autofold
function Component(props) {
    this.props = props || {};
    this.state = {};
}
// }

/* instance method */
Component.prototype.setState = function setState(newState) {
    this.state = newState;
};

/* static method */
Component.isComponent = function isComponent(candidate) {
    return typeof candidate.setState === "function";
}

var c = new Component({title: "hello!"});
console.log(Component.isComponent(c));
console.log(JSON.stringify(c.state));
c.setState({counter: 0});
console.log(JSON.stringify(c.state));
```

So far this isn't too bad, although programmers coming from a classical OOP perspective are probably squinting a little bit at the use of `prototype` in the above examples. The easiest way to think of a prototype is that all instances of the `Component` class will have the same prototype, and thus the same methods. Since JavaScript is a dynamic language, it is possible to modify the prototype after some instances have been created. Even instances that were created before the prototype was modified will see the changes to the prototype.

Now, what if we wanted to create a subclass of `Component`... say, `Button`? ES5 requires us to wire up a subclass's prototype chain so that all the subclassed instances can inherit methods properly. Doing so isn't that pretty, as seen in the next snippet.

```javascript runnable
// { autofold
function Component(props) {
    this.props = props || {};
    this.state = {};
}
Component.prototype.setState = function setState(newState) {
    this.state = newState;
};

Component.isComponent = function isComponent(candidate) {
    return typeof candidate.setState === "function";
}
// }

function Button(props) {
    Component.call(this, props);                        // (A)
}

Button.prototype = Object.create(Component.prototype); // (B)
Button.prototype.constructor = Component;

Button.prototype.render = function render() {
    var borderChars = this.state.selected ? "><" : "[]";
    return borderChars[0] + " " + this.props.title + " " + borderChars[1];
};

var button = new Button({title: "Click me!"});
console.log(Component.isComponent(button));
console.log(button.render());

button.setState({selected: true});
console.log(button.render());
```
