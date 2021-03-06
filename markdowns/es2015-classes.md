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
        this.props = props;
        this.state = {};
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

So, now that we've defined a class, how do we create a subclass? Easy -- we create a new `class` and tell it that it `extends` from its superclass, like so:

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
    render() {
        const borderChars = this.state.selected ? "><" : "[]";
        return `${borderChars[0]} ${this.props.title} ${borderChars[1]}`;
    }
}

const button = new Button({title: "Click me!"});
console.log(Component.isComponent(button), Button.isComponent(button));
console.log(button.render());

button.setState({selected: true});
console.log(button.render());
```

There are two very important differences here from the ES5 version:

* We didn't define a `constructor` -- instead, `Button` will inherit its parent's `constructor`. 
* Static methods are inherited by subclasses -- note `Button.isComponent(button)` evaluates to `true`, wereas ES5 would have complained that `isComponent` wouldn't have been a `function`.

You can override any method (including the constructor) just by defining it in the subclass. Let's do that now:

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

class Button extends Component {
    render() {
        const borderChars = this.state.selected ? "><" : "[]";
        return `${borderChars[0]} ${this.props.title} ${borderChars[1]}`;
    }
}
// }

class BorderedButton extends Button {
    constructor(props) {
        super(props);                                                       // (A)
        if (!this.props.border) this.props.border = "|";
    }
    render() {
        return `${this.props.border}${super.render()}${this.props.border}`; // (B)
    }
}

const bb = new BorderedButton({title: "Hello"});
console.log(bb.render());
```

When overriding a method, ES2015 classes have access to their parent class via `super`. When one overrides a `constructor`, the parent `constructor` is called via `super()`, as in **(A)**. In any other method, one can access the parent's methods via the `super` object as in **(B)**.

> **Important!** You _must_ call `super` before accessing `this` in your constructor or an error will be thrown. Using `super` in any other method isn't a requirement.

What I like about `super` is the fact that you can refer to a parent without rigidly defining the hierarchy. That means you can easily insert classes in between without having to revisit your other classes to change names along the way. That's not to say, of course, that you should build huge hierarchies (since they tend to be brittle for other reasons), but it does make working with whatever hierarchy you have easier.

We've already seen one difference between ES5 and ES2015 (that is, static methods are inherited), so let's go over the rest of the differences in the next section.
