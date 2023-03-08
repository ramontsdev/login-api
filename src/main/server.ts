import express, { json } from 'express';
import { mongoHelper, mongoUri } from '../infra/db/mongodb/helpers/mongo-helper';
import { routes } from './routes';

const server = express();

mongoHelper.connect(mongoUri)
  .then(() => {

    server.use(json());
    server.use('/api', routes);

    server.listen(3001, () => {
      console.log('Server is running');
    });
  });
