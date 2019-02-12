import { INDEXES } from '../../config/secrets.config';

export default function (app, client) {

    app.get('/activity-category/:activityId', (req, res, next) => {

        const activityid = req.params.activityId;

        client.search({
            index: INDEXES.CAMP_ACTIVITY,
            body: {
                query: {
                    match: {
                        activityid
                    }
                }
            }
        }).then(response => {
            res.status(200).send({
                data: response.hits.hits.map(item => {
                    return {
                        campName: item._source.camp,
                        id: item._source.campid
                    }
                })
            });
        }).catch(error => {
            res.status(400).send({ error });
        })

    });
}