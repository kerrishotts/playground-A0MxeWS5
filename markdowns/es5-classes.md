In ES5, a class is defined using a **class function**. For example:

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
};

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
};
// }

function Button(props) {
    Component.call(this, props);                       // (A)
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

Let's take a closer look at a couple of lines in the previous snippet. In **(A)**, we're calling the constructor for `Component` -- essentially, we're doing a `super()` call (as you might do in another OOP language). The downside is that the hierarchy is rigidly defined here -- the parent of `Button` will always be `Component`. If we later try to insert something between the two, then we'd have to update the constructor for `Button` as well. Plus, it looks a bit repetitive!

**(B)** is where we wire up the prototype chain. Without this, `Button` isn't a subclass of anything, and so wouldn't inherit `setState`. Only by wiring up the prototype chain to include the parent will all `Button` instances inherit `setState`. Notice that again we're rigidly defining the hierarchy.

> **Note:** Static methods are not inherited by ES5 subclasses. As such, we can't call `Button.isComponent`; instead we have to call `Component.isComponent`.

So, how might we override an inherited method? If we don't care about calling the overridden method, we can just assign the method to our subclass's `prototype`. If we _do_ care about calling the overridden method, we have to get creative and call the previous method on the `prototype` chain.

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
};

function Button(props) {
    Component.call(this, props);
}

Button.prototype = Object.create(Component.prototype);
Button.prototype.constructor = Component;

Button.prototype.render = function render() {
    var borderChars = this.state.selected ? "><" : "[]";
    return borderChars[0] + " " + this.props.title + " " + borderChars[1];
};
// }

Button.prototype.setState = function setState(newState) {
    var superSetState = Component.prototype.setState.bind(this); // (A)
    console.log("We're setting state to " + JSON.stringify(newState));
    superSetState(newState);
    console.log("Setting state done!");
};

var button = new Button({title: "Click me!"});
console.log(Component.isComponent(button));
console.log(button.render());

button.setState({selected: true});
console.log(button.render());
```

Notice that in line **(A)** we have to obtain a reference to our parent's `setState` method and then `bind` to _our_ instance (otherwise `this` would be wrong inside the `setState` method). In other OOP languages, you'd be able to call the overridden method pretty simply, and without such a rigidly defined hierarchy.

Now that we've seen how things worked in ES5, let's see the new syntax.

::: Sources

* [Classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes) on MDN
* [Classes in ECMAScript 6](http://2ality.com/2015/02/es6-classes-final.html) by 2ality

:::
