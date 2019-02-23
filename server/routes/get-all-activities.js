import { INDEXES } from '../../config/secrets.config';

export default function (app, client) {
    app.get('/activities', (req, res, next) => {

        client.search({
            index: INDEXES.ACTIVITY,
            body: {
                size: 50,
                query: {
                    match_all: {}
                }
            }
        }).then(response => {
            const data = response.hits.hits;
            res.status(200).send({
                data: data.map(item => {
                    return {
                        id: item._source.idactivity,
                        name: item._source.name,
                        camps: []
                    }
                })
            });
        }).catch(error => {
            console.log('error from elastic-search ' + error);
            res.status(400).send({
                error
            });
        });
    });
}