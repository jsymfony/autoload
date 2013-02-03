var autoload = require('../index.js');

autoload.register('NS1', __dirname + '/NS1');
autoload.register('NS1', __dirname + '/NS1_extend');

new NS1.SubNS.Foo();
new NS1.SubNS.Bar();
new NS1.SubNS.Baz();