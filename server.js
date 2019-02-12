const express = require('express')
const AWS = require('aws-sdk');
const elasticsearch = require('elasticsearch');

const config = require('./config/secrets.config');

// Express server
const app = express();
AWS.config.update({
  credentials: new AWS.Credentials(config.secrets.ACCESS_KEY_ID, config.secrets.ACCESS_SECRET_ID),
  region: 'us-west-2'
});

const options = {
  log: ['error', 'trace'],
  host: 'search-campfinder-public-jl7pwiopy2opwo3e3zhw5k7ba4.us-west-2.es.amazonaws.com', // array of amazon es hosts (required)
  connectionClass: require('http-aws-es'), // use this connector (required)
  amazonES: AWS.config, // set an aws config e.g. for multiple clients to different regions
  httpOptions: {} // set httpOptions on aws-sdk's request. default to aws-sdk's config.httpOptions
}

const PORT = process.env.PORT || 4000;


app.post('/search/activity', (req, res) => {

  const term = req.body.searchTerm;

  client.search({
    index: config.indexes.CAMP_ACTIVITY,
    body: {
      query: {
        match: {
          "activity": term
        }
      }
    }
  }).then(response => {
    const data = response.hits.hits;
    res.status(400).send({
      data
    });
  }).catch(error => {
    console.log('error from elastic-search ' + error);
    res.status(400).send({
      error
    });
  });
});

const client = new elasticsearch.Client(options);
app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))