import { INDEXES } from '../../config/secrets.config';

export default function (app, client) {

    app.get('/camp/:campId', (req, res) => {

        const idcampdetails = req.params.campId;
        console.log(idcampdetails);

        client.search({
            index: INDEXES.CAMPS,
            body: {
                query: {
                    match: {
                        idcampdetails
                    }
                }
            }
        }).then(response => {
            const data = response.hits.hits;
            res.status(200).send({ data });
        }).catch(error => {
            console.log('error from elastic-search ' + error);
            res.status(400).send({
                error
            });
        });
    });
}