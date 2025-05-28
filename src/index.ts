import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';
import router from './router';

const app = express();

app.use(
  cors({
    credentials: true,
  })
);

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

server.listen(4000, () => {
    console.log('Server running on port 4000')
})

const MONGO_URL = 'mongodb+srv://mabalaji99:yC55KNJbEWuusd53@personal.oho3ri2.mongodb.net/?retryWrites=true&w=majority&appName=personal';

mongoose.Promise = Promise;
mongoose.connect(MONGO_URL).then(() => console.log('DB connection successful'));
mongoose.connection.on('error', (error: Error) => console.log(error));

app.use('/', router());