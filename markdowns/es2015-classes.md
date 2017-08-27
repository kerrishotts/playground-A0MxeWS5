ES2015 introduces a new, _mostly sugar_ syntax for classes. These new classes can interop with ES5 classes, so you don't have to convert your entire codebase in order to use the new syntax. (That said, you will run into difficulty using ES5 class inheritance alongside ES2015 classes.)

> **Note:** There is nothing in ES2015 that _requires_ you to use the new syntax. Even so, it's wise to become familiar with the syntax and understand what's going on, especially as libraries move to using the new syntax.

Let's create a simple class named `Component` (we'll follow the same progression as in the previous section):

```javascript runnable
class Component {
    constructor(props = {}) {
        this.props = props;
        this.state = {};
    }
}

const c = new Component({title: "hello!"});
console.log(JSON.stringify(c.props));
```

A few things have changed from the ES5 version, namely the fact that we have a new `class` structure and the constructor is defined with an explicit `constructor` pseudo-function. This is (mostly) equivalent to the class function we used in the previous section.

> **Note:** You can only define functions within a `class` definition. Properties have to be set in the `constructor`. There is a [stage 3 proposal](https://tc39.github.io/proposal-class-fields/) for adding the necessary syntax to support declaring properties outside of the `constructor`.

Notice that we can create a new instance of `Component` just like we did with ES5, namely using `new`, so how we use instances that are defined using the new syntax doesn't change significantly.

> **Caveat:** I lie, actually, but you'll see the exceptions in the next section.

Now that we have defined a simple class, let's see how we add methods:

```javascript runnable
class Component {
    constructor(props = {}) {
    // { autofold
        this.props = props;
        this.state = {};
    // }
    }
    
    /* instance method */
    setState(newState) {
        this.state = newState;
    }
    
    /* static method */
    static isComponent(candidate) {
        return candidate && typeof candidate.setState === "function";
    }
}

const c = new Component({title: "hello!"});

console.log(Component.isComponent(c));
console.log(JSON.stringify(c.state));

c.setState({counter: 0});
console.log(JSON.stringify(c.state));
```

Methods are added within the `class` definition, but note that we don't include a `function` token. Since only functions are allowed, there is no ambiguity that we're adding a function. This also fits nicely with the shorthand method for defining functions in object literals (also part of ES2015).

Methods are instance methods by default unless one adds the `static` keyword. Static methods are similar to, but not exactly like their ES5 equivalent. We'll cover that difference in the next section.

So, now that we've defined a class, how do we create a subclass? Easy -- we create a new `class` and tell it to `extend` from its superclass, like so:

```javascript runnable
// { autofold
class Component {
    constructor(props = {}) {
        this.props = props;
        this.state = {};
    }
    
    setState(newState) {
        this.state = newState;
    }
    
    static isComponent(candidate) {
        return candidate && typeof candidate.setState === "function";
    }
}
// }

class Button extends Component {
    function render() {
        const borderChars = this.state.selected ? "><" : "[]";
        return `${borderChars[0] ${this.props.title} ${borderChars[1]}`;
    }
}

const button = new Button({title: "Click me!"});
console.log(Component.isComponent(button), Button.isComponent(button));
console.log(button.render());

button.setState({selected: true});
console.log(button.render());
```

