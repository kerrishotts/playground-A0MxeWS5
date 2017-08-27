var assert = require("assert");
var Rect = require("./class-method.js").Rect;

it("has a calculateArea method", function () {
  try {
    assert.equal(typeof (new Rect()).calculateArea, "function");
  } catch (error) {
    printMessage("Hint 💡", "Did you forget to define `calculateArea`? 🤔");
  }
});
it("has a calculatePerimeter method", function () {
  try {
    assert.equal(typeof (new Rect()).calculatePerimeter, "function");
  } catch (error) {
    printMessage("Hint 💡", "Did you forget to define `calculatePerimeter`? 🤔");
  }
});

it("calculates area correctly", function () {
  try {
      [{w: 4, h: 4},
       {w: 9, h: 12},
       {w: 1, h: 9},
       {w: 12, h: 4},
       {w: 80, h: 97},
       {w: 1, h: 1}
      ].forEach(({w, h}) => assert.equal(w * h, (new Rect(w, h)).calculateArea()));
  } catch (error) {
    printMessage("Hint 💡", "That's not quite right. Area is calculated as width multipled by height. Try that. 🤔");
    throw error;
  }
});

it("calculates perimeter correctly", function () {
  try {
      [{w: 4, h: 4},
       {w: 9, h: 12},
       {w: 1, h: 9},
       {w: 12, h: 4},
       {w: 80, h: 97},
       {w: 1, h: 1}
      ].forEach(({w, h}) => assert.equal(2 * w + 2 * h, (new Rect(w, h)).calculatePerimeter()));
  } catch (error) {
    printMessage("Hint 💡", "That's not quite right. Perimeter is calculated as twice width plus twice height. Try that. 🤔");
    throw error;
  }
});

function printMessage(channel, message) {
  console.log('\nTECHIO> message --channel "' + channel + '" "' + message + '"');
}
