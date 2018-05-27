var gulp = require('gulp');
var webpack = require("webpack");
var WebpackDevServer = require("webpack-dev-server");
var less = require('gulp-less');
var path = require('path');
var gutil = require("gulp-util");
var open = require('gulp-open');
var connect = require('gulp-connect');

var devPort = "8080";

gulp.task('hot', function (callback) {
    var compiler = webpack({
        devtool: 'eval',
        //devtool: 'cheap-module-eval-source-map',
        entry: [
            'webpack-dev-server/client?http://localhost:' + devPort,
            'webpack/hot/only-dev-server'
        ],
        output: {
            path: path.join(__dirname, 'dist'),
            filename: 'bundle.js',
            publicPath: '/static/'
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoErrorsPlugin()
        ],
        resolve: {
            extensions: ['', '.js', '.jsx']
        },
        module: {
            loaders: [
                {
                    test: /\.jsx?$/,
                    loaders: ['react-hot', 'babel'],
                    exclude: /node_modules/
                },
                {
                    test: /\.css/,
                    loader: "style-loader!css-loader"
                },
                {
                    test: /\.less/,
                    loader: "style-loader!css-loader!less-loader"
                }
            ]
        }
    });

    new WebpackDevServer(compiler, {
        publicPath: '/static/',
        hot: true,
        historyApiFallback: true,
        stats: {
            colors: true
        }
    }).listen(devPort, "localhost", function (err) {
            if (err) throw new gutil.PluginError("webpack-dev-server", err);
            gutil.log("[webpack-dev-server]", "http://localhost:" + devPort + "/webpack-dev-server/index.html");
        });
});


gulp.task('uri', function () {
    gulp.src(__filename)
        .pipe(open({uri: "http://localhost:" + devPort + "/webpack-dev-server/index.html"}));
});


gulp.task('webserver', function() {
    connect.server();
});

gulp.task('default', ['webserver']);
gulp.task('dev', ['hot' , 'uri']);