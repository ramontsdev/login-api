import express, { json } from 'express';
import { mongoHelper } from '../infra/db/mongodb/helpers/mongo-helper';
import { environment } from './environment';
import { loginRoutes } from './routes/login-routes';

export const server = express();

mongoHelper.connect(environment.mongoUrl)
  .then(() => {

    server.use(json());
    server.use('/api', loginRoutes);

    server.listen(3001, () => {
      console.log('Server is running');
    });
  });
