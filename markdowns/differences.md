There is a tendency for people to describe the ES2015 class syntax as "sugar". That's true to a certain extent, but there definitely differences between ES5 classes and ES2015 classes that you need to be aware of.

First, and probably least problematic, is the fact that static methods are inherited. This fact should be enough to convince anyone that something different is going on in the depths of the JavaScript engine that this is true (whereas ES5 static methods were never inherited). The fact that static methods are inheritable can actually be really useful, which we'll see in a moment.

The bigger difference is that ES2015 constructors _must be called with `new`_. In ES5 it was a common pattern to allow class functions to also function as **factory functions** if they weren't called with `new`. For example:

```javascript runnable
function Component(props) {
    if (!(this instanceof Component)) {
        return new Component(props);
    }
    this.props = props || {};
    this.state = {};
}

var c = new Component({title: "Hello"});
var d = Component({title: "Hiya!"});
console.log(JSON.stringify(c.props), JSON.stringify(d.props));
```

A lot of developers swear by the ability to create instances of classes using factory patterns rather than having to use `new`. Regardless of whether you agree or not, this is the largest difference between ES2015 and ES5 classes -- you simply have to use `new` whether you want to or not. If you don't, you'll get an error instead.

There is, unfortunately, no great alternative, but it is possible to create factory functions that bring some of this flexibility back. Let's create a static `create` method that will return a new instance without our calling code needing to use `new`:

```javascript runnable
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
    
    static create(props) {
        return new Component(props);
    }
}

const c = Component.create({title: "Hello"});
console.log(JSON.stringify(c.props));
```

This works pretty well _until_ we introduce inheritance. If we want to create a `Button` subclass, we now will have to override the `create` method. But, interestingly enough, since static methods are inherited, wouldn't it be cool if we didn't have to actually override `create`? This way all subclasses would get the ability to use factory functions for free.

There's another ES2015 feature that helps us here, and we'll go over it in more detail some other time, but I can't resist showing this here, since it is so applicable. So, without further ado:

```javascript runnable
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
    
    static create(props) {
        return Reflect.construct(this, [props]); // (A)
    }
}

class Button extends Component {
    render() {
        const borderChars = this.state.selected ? "><" : "[]";
        return `${borderChars[0]} ${this.props.title} ${borderChars[1]}`;
    }
}

const b = Button.create({title: "Hello!"});
console.log(b.render());
```

Notice that in line **(A)** we call `Reflect.construct`. This is similar to invoking `apply` on another function -- we can specify the execution context and arguments with `apply`, and with `Reflect.construct` we specify the _constructor_ and the arguments. The difference is that `Reflect.construct` acts as the `new` operator whereas if we tried to use `apply` on a `constructor` the attempt would fail.

Note also that because static methods are inherited, we get `Button.create` for free. The result is the same as if we had used `new Button(props)` but we can do so without having to use `new`.
