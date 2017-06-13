var webpack = require('webpack');

var definePlugin = new webpack.DefinePlugin({
    WEBPACK_SAGA_PORT: '8090' //the port the socket server is listening on. cant be 8080 because we are using it
});

module.exports = {
  entry: [
    'webpack-dev-server/client?http://0.0.0.0:8080',
    'webpack/hot/only-dev-server',
    './src/index.js'
  ],
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'react-hot!babel'
  },
  {
    test: /\.(?:ico|gif|png|jpg|jpeg|webp)$/,
    loader: 'url-loader'
  }
  ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  output: {
    path: __dirname + '/dist',
    publicPath: '/',
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: './dist',
    hot: true
  },
  plugins: [
    definePlugin,
    new webpack.HotModuleReplacementPlugin()
  ]
};
