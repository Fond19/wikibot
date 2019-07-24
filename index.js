var express = require('express');
var app = express();
var request = require('request');
const bodyParser = require('body-parser');




const accountSid = process.env.SID;
const authToken = process.env.KEY;

const client = require('twilio')(accountSid, authToken);
const MessagingResponse = require('twilio').twiml.MessagingResponse;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));


app.post('/incoming', (req, res) => {
  const twiml = new MessagingResponse();
  var base = 'https://api.duckduckgo.com/?skip_disambig=1&format=json&pretty=1&q=';
  var query = req.body.Body;

  request(base + query, function (error, response, body) {
      body = JSON.parse(body) 

      if(body["Abstract"] == ""){
          body["Abstract"]= body["RelatedTopics"][0]["Text"]
        }   

      var msg = twiml.message(body["Heading"]+"\n\n"+body["Abstract"]);
            res.writeHead(200, {'Content-Type': 'text/xml'});
          res.end(twiml.toString());
    });

  console.log(req.body)
});



app.get('/', function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});


var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

