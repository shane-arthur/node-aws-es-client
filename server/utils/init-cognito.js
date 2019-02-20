import AWS from 'aws-sdk';
import elasticsearch from 'elasticsearch';
import { SECRETS } from '../../config/secrets.config';

export const initCognito = () => {
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

    return new elasticsearch.Client(options);
}