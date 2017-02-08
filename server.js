'use strict';

/* global __dirname */

import chokidar from 'chokidar';
import express from 'express';
import graphQLHTTP from 'express-graphql';
import path from 'path';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import {clean} from 'require-clean';
import {exec} from 'child_process';

var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var ENV = process.env.NODE_ENV || 'development';

const APP_PORT = 4647;
const GRAPHQL_PORT = 4646;

let graphQLServer;
let appServer;

function startAppServer(callback) {

    const webpackConfig = {
        entry: {
            app: './js/app.js'
        },
        module: {
            loaders: [
                {
                    exclude: /node_modules/,
                    loader: 'babel',
                    test: /\.js$/
                }, {
                    test: /\.html$/,
                    include: path.resolve(__dirname, 'views'),
                    loader: 'raw'
                }, {
                    test: /\.css$/,
                    loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
                },
                {
                    test: /\.styl$/,
                    loader: ExtractTextPlugin.extract('style-loader', 'css-loader!stylus-loader')
                }
            ]
        },
        output: {
            path: __dirname + '/public',
            publicPath: '/',
            filename: 'dist/[name].js'
        },
        plugins: [
            new ExtractTextPlugin('dist/[name].css')
        ]
    };

    if (ENV === 'production') {

        webpackConfig.plugins.push(
            new webpack.DefinePlugin({
                'process.env':{
                    'NODE_ENV': JSON.stringify(ENV)
                }
            }),
            new webpack.NoErrorsPlugin(),
            new webpack.optimize.DedupePlugin(),
            new webpack.optimize.UglifyJsPlugin({
                compress:{
                    warnings: false
                }
            })
        );
    }

    const compiler = webpack(webpackConfig);

    appServer = new WebpackDevServer(compiler, {
          contentBase: '/public/',
          proxy: {'/graphql': `http://localhost:${GRAPHQL_PORT}`},
          publicPath: '/',
          stats: {colors: true}
    });

    appServer.use('/', express.static(path.resolve(__dirname, 'public')));

    appServer.listen(APP_PORT, () => {

          console.log(`App is now running on http://localhost:${APP_PORT}`);

          if (callback) {
              callback();
          }
    });
}

function startGraphQLServer(callback) {

    clean('./data/schema');

    const {Schema} = require('./data/schema');
    const graphQLApp = express();

    graphQLApp.use('/', graphQLHTTP({
        graphiql: true,
        pretty: true,
        schema: Schema
    }));

    graphQLServer = graphQLApp.listen(GRAPHQL_PORT, () => {

        console.log(
          `GraphQL server is now running on http://localhost:${GRAPHQL_PORT}`
        );

        if (callback) {
            callback();
        }
    });
}

function startServers(callback) {

    if (appServer) {
        appServer.listeningApp.close();
    }

    if (graphQLServer) {
        graphQLServer.close();
    }

    exec('npm run update-schema', (error, stdout) => {

        console.log(stdout);

        let doneTasks = 0;

        function handleTaskDone() {

            doneTasks++;

            if (doneTasks === 2 && callback) {
                callback();
            }
        }

        startGraphQLServer(handleTaskDone);
        startAppServer(handleTaskDone);
    });
}

const watcher = chokidar.watch('./data/{database,schema}.js');

watcher.on('change', path => {

    console.log(`\`${path}\` changed. Restarting.`);

    startServers(() =>
        console.log('Restart your browser to use the updated schema.')
    );
});

startServers();
