import express, { json } from 'express';
import { mongoHelper, mongoUri } from '../infra/db/mongodb/helpers/mongo-helper';
import { loginRoutes } from './routes/login-routes';

export const server = express();

mongoHelper.connect(mongoUri)
  .then(() => {

    server.use(json());
    server.use('/api', loginRoutes);

    server.listen(3001, () => {
      console.log('Server is running');
    });
  });
