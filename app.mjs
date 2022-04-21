import express from "express";
import path from "path";
import logger from "morgan";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";

import routes from "./routes/index.mjs";

import { graphqlHTTP } from "express-graphql";

import {schema} from "./data/schema.mjs";
import { fetchArtistsByName } from "./data/resolvers.mjs";

const app = express();

// view engine setup
app.set('views', path.join('.', 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join('.', 'public')));

app.use('/', routes);


const rootValue = {
    hi: () => 'Hello world!',
    queryArtists: ({ byName }) => fetchArtistsByName(byName)
};

// API middleware

app.use('/graphql', cors(), graphqlHTTP(req => ({
    schema,
    graphiql: true,
    rootValue,
    pretty: process.env.NODE_ENV !== 'production',
})));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


export default app;
