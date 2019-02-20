import express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';
import { initCognito } from './utils/init-cognito';
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

const PORT = process.env.PORT || 4000;
const client = initCognito();

const setRoutes = (routes) => {
  routes.forEach((route) => {
    require(route).default(app, client); // eslint-disable-line global-require, import/no-dynamic-require
  });
};

const routes = [getAllActivitesRoute, getCampsPerActivityRoute, searchCampByActivityRoute];
setRoutes(routes);

app.listen(PORT, () => console.log(`Camp search server is running on port ${PORT}!`))