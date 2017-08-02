const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin"); 

const BUILD_DIR = path.resolve(__dirname, 'dist');//node中将相对路径转为绝对路径
const APP_DIR = path.resolve(__dirname, 'src/app');

let config = {
  entry: {
    index:APP_DIR + '/index.jsx',
    troom:APP_DIR + '/troom.jsx',
    // 将第三方依赖单独打包
    vendor: [
      'react',
      'react-dom',
      // 'react-redux',
      // 'react-router',
      // 'redux',
      // 'es6-promise',
      // 'axois',
      // 'immutable'
    ]
  },
  output: {
    path: BUILD_DIR,
    filename: '[name].js'
  },//模块加载器会把所有的模块最终打包生成一个巨大的XXX.js


  module: {
    rules: [
    { 
      test: /\.(js|jsx)$/, 
      exclude: /node_modules/, 
      use: ['babel-loader']
    },

    { 
      test: /\.scss$/, 
      use:ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: ['css-loader','sass-loader']     
    })
    },

    {
      test:/\.(gif|png|jpe?g|svg)$/i,
      use:['file-loader?limit=5000&name=images/[name].[ext]',
          'image-webpack-loader'
      ]//当图片大小小于这个限制的时候，会自动启用base64编码图片。减少http请求,提高性能
    }

  ]
  },

  resolve:{
    extensions:['.js','.jsx']
  },

  plugins: [

      // 定义为生产环境，编译 React 时压缩到最小
      new webpack.DefinePlugin({
        'process.env':{
          'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        }
      }),

      new webpack.optimize.UglifyJsPlugin({//代码压缩 
        compress: {
          warnings: false//在UglifyJs删除没有用到的代码时输出警告 
        }
      }),

      //抽离css样式,防止将样式打包在js中引起页面样式加载错乱的现象
      new ExtractTextPlugin({
        filename:'[name].bundle.css',
        //disable:true,
        allChunks:true
      }),

      //用于提取公共代码块，vendor是一般规则的命名，也可以写成其他的。
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        filename: '[name].[chunkhash:8].js'//忽略则以name为输出的文件名，否则以此为输出文件名
      }),

      //html模块加载
      new HtmlWebpackPlugin({
        title: 'index',
        filename: 'index.html',
        template: 'src/templates/template.html',
        chunks:['index','vendor']// 每个html引用的js模块，也可以在这里加上vendor等公用模块
      }),
      new HtmlWebpackPlugin({  
        title:'3d room',
        filename: 'troom.html',
        template: 'src/templates/template.html',
        chunks:['troom','vendor']//需要引入的chunk，不配置就会引入所有页面的资源
      }),

      // 为组件分配ID，通过这个插件webpack可以分析和优先考虑使用最多的模块，并为它们分配最小的ID
      new webpack.optimize.OccurrenceOrderPlugin(),

      // 可在业务 js 代码中使用 __DEV__ 判断是否是dev模式（dev模式下可以提示错误、测试报告等, production模式不提示）
      new webpack.DefinePlugin({
        __DEV__: JSON.stringify(JSON.parse((process.env.NODE_ENV == 'dev') || 'false'))
      })
    ]
}

module.exports = config;