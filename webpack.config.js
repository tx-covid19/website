const path = require('path');

module.exports = {

  entry: {
    app: './index.js',
    fitbit: './fitbit/index.js'
  },

  output: {
    path: path.resolve(__dirname + '/content'),
    filename: '[name].js',
    publicPath: '/content',
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.ya?ml$/,
        type: 'json',
        use: 'yaml-loader'
      },
      {
        test: /\.s(a|c)ss$/,
        loader: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        use: [
          { 
            loader: 'file-loader',
            options: {
              name: '[folder]/[name].[ext]',
              outputPath: 'img/',
              publicPath: 'content/img/',
            }
          }
        ]
      }
    ],
  },
  devServer: {
    contentBase: path.join(__dirname),
    publicPath: '/content',
    compress: true,
    port: 9000,
    host: '0.0.0.0',
    disableHostCheck: true,
    // liveReload: true,
    hot: true,
    https: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        pathRewrite: {'^/api' : ''}
      }
    }
  },
  mode: 'development'
};