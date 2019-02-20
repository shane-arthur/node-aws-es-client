import express from 'express';
import AWS from 'aws-sdk';
import elasticsearch from 'elasticsearch';
import bodyParser from 'body-parser';
import compression from 'compression';
import { SECRETS, INDEXES } from '../config/secrets.config';
const getAllActivitesRoute = './routes/get-all-activities';
const getCampsPerActivityRoute = './routes/get-all-camps-per-activity';
const searchCampByActivityRoute = './routes/search-camp-by-activity';

// Express server
const app = express();
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
  extended: true
}));
app.use(express.json());
app.use(compression());

AWS.config.update({
  credentials: new AWS.Credentials(SECRETS.ACCESS_KEY_ID, SECRETS.ACCESS_SECRET_ID),
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
const client = new elasticsearch.Client(options);

const setRoutes = (routes) => {
  routes.forEach((route) => {
    require(route).default(app, client); // eslint-disable-line global-require, import/no-dynamic-require
  });
};

/* istanbul ignore next */
const routes = [getAllActivitesRoute, getCampsPerActivityRoute, searchCampByActivityRoute];
setRoutes(routes);


app.listen(PORT, () => console.log(`Camp search server is running on port ${PORT}!`))