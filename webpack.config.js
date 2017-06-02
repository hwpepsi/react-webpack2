const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin"); 

var BUILD_DIR = path.resolve(__dirname, 'dist');
var APP_DIR = path.resolve(__dirname, 'src/app');

var config = {
  entry: {
    index:APP_DIR + '/index.jsx',
    troom:APP_DIR + '/troom.jsx'
  },
  output: {
    path: BUILD_DIR,
    filename: '[name].js'
  },

  module: {
    rules: [
    { test: /\.jsx$/, exclude: /node_modules/, use: ['babel-loader'] },

    { 
      test: /\.scss$/, 
      use:ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: ['css-loader','sass-loader']     
    })
    },

  ]
  },

  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    port: 9000,
    hot:true,
    stats:'errors-only'
  },

  plugins: [
      new ExtractTextPlugin({
        filename:'[name].bundle.css',
        disable:true,
        allChunks:true
      }),
      new HtmlWebpackPlugin({
            title: 'index',
            filename: 'index.html',
            template: 'src/templates/template.html',
            chunks:['index','vendors']
        }),
      new HtmlWebpackPlugin({  
        title:'3d room',
        filename: 'troom.html',
        template: 'src/templates/template.html',
        chunks:['troom','vendors']
      }),

      new webpack.HotModuleReplacementPlugin(),

      new webpack.NamedModulesPlugin(),
    ]
}

module.exports = config;