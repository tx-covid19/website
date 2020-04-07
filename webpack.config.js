const path = require('path');

module.exports = {

  entry: './index.js',

  output: {
    path: path.resolve(__dirname + '/content'),
    filename: 'bundle.js',
    publicPath: '/content',
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.s(a|c)ss$/,
        loader: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        use: [
          {
            loader: "file-loader?name=/img/[name].[ext]",
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
    liveReload: true,
  },
  mode: 'development'
};