import { INDEXES } from '../../config/secrets.config';

export default function (app, client) {

    app.post('/search/activity', (req, res) => {

        const term = req.body.searchTerm;

        client.search({
            index: INDEXES.CAMP_ACTIVITY,
            body: {
                query: {
                    match: {
                        activity: term
                    }
                }
            }
        }).then(response => {
            const data = response.hits.hits;
            const campids = data.map(item => item._source.campid);
            client.search({
                index: config.indexes.CAMPS,
                body: {
                    query: {
                        constant_score: {
                            filter: {
                                terms: {
                                    idcampdetails: campids
                                }
                            }
                        }
                    }
                }
            }).then(response => {
                res.status(200).send({
                    data: response.hits.hits
                });
            })
        }).catch(error => {
            console.log('error from elastic-search ' + error);
            res.status(400).send({
                error
            });
        });
    });
}