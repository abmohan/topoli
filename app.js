var express = require('express');
var mongoose = require('mongoose');

// setup mongoose (defaults to localhost collection if env var doesn't exist)
var uristring = process.env.MONGOLAB_URI || 'mongodb://localhost/HelloMongoose';
mongoose.connect(uristring, function(err, res) {
  if (err) {
    console.log("ERROR connection to", uristring, ":", err);
    return;
  } 

  console.log("Succussfully connected to:", uristring);
});

// setup express
var app = express();
app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

app.get('/', function(request, response) {
  response.send('Hello World!')
})

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
