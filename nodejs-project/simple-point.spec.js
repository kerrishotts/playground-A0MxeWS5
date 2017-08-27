var assert = require('assert');
var Point = require('./simple-point.js').Point;

it('set instance properties correctly', function () {
  try {
    const x = 79, y = 144;
    const point = new Point(x, y);
    assert.equal(point.x, x);
    assert.equal(point.y, y);
  } catch (error) {
    printMessage('Hint 💡', 'Did you forget to set properties on \'this\', or forget to specify parameters? 🤔');
    throw error;
  }
});

function printMessage(channel, message) {
  console.log('\nTECHIO> message --channel "' + channel + '" "' + message + '"');
}
