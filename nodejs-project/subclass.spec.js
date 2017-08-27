var assert = require("assert");
const {Rect, Square} = require("./subclass.js");

it("calculates area of a square correctly", function () {
  try {
      [4, 10, 9, 0, 1, 450, 32].forEach(l => assert.equal(l * l, (new Square(l)).calculateArea()));
  } catch (error) {
    printMessage("Hint 💡", "That's not quite right. Did you call `super` correctly? 🤔");
    throw error;
  }
});

function printMessage(channel, message) {
  console.log('\nTECHIO> message --channel "' + channel + '" "' + message + '"');
}
