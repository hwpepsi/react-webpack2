const webpack = require('webpack');
const path = require('path');
//const HtmlWebpackPlugin = require('html-webpack-plugin');
//const ExtractTextPlugin = require("extract-text-webpack-plugin"); 

const BUILD_DIR = path.resolve(__dirname, 'dist');
const APP_DIR = path.resolve(__dirname, 'src/app');

let config = {
  entry: {
    index:APP_DIR + '/index.jsx',
    troom:APP_DIR + '/troom.jsx'
  },
  output: {
    path: BUILD_DIR,
    filename: '[name].js'
  },

  //是文件的加载器
  module: {
    rules: [
    //Babel是一个广泛使用的转码器，可以将ES6代码转为ES5代码，从而在现有环境执行。
    { 
      test: /\.(js|jsx)$/, 
      exclude: /node_modules/, 
      use: ['babel-loader'] 
    },

    //样式加载
    { 
      test: /\.scss$/, 
      use: ['style-loader','css-loader','sass-loader'] //use中的执行顺序是从右到左    
     
    },

    //图片加载
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
  },/*定义了解析模块路径时的配置，常用的就是extensions;
  可以用来指定模块的后缀，这样在引入模块时就不需要写后缀，后缀名自动补全;*/

  //webpack-dev-server是一个小型的Node.js Express服务器
  devServer: {
    contentBase: path.join(__dirname, "dist"),//本地服务器所加载的页面所在的目录
    //contentBase: './',//告诉服务器从哪里提供内容。只有在你想要提供静态文件时才需要。
    compress: true,//一切服务都启用gzip压缩
    port: 9000,//默认端口为8080
    hot:true,// 告诉 dev-server 我们在使用 HMR
    inline: true, //可以监控js变化
    stats:'errors-only'//只在发生错误时输出
  },

  //定义插件
  plugins: [
      //抽离css样式,防止将样式打包在js中引起页面样式加载错乱的现象
      /*new ExtractTextPlugin({
        filename:'[name].bundle.css',
        //disable:true,
        allChunks:true
      }),*/
      
      // 可在业务 js 代码中使用 __DEV__ 判断是否是dev模式（dev模式下可以提示错误、测试报告等, production模式不提示）
      new webpack.DefinePlugin({
        __DEV__: JSON.stringify(JSON.parse((process.env.NODE_ENV == 'dev') || 'false'))
      }),

      // html模板插件,定义多页面
      /*new HtmlWebpackPlugin({
            title: 'index',
            filename: 'index.html',
            template: 'src/templates/template.html',
            chunks:['index','vendor']
        }),
      new HtmlWebpackPlugin({  
        title:'3d room',
        filename: 'troom.html',
        template: 'src/templates/template.html',
        chunks:['troom','vendor']
      }),*/

      // 模块热替换,启用HMR
      new webpack.HotModuleReplacementPlugin(),

      // 更新组件时在控制台输出组件的路径而不是数字ID，用在开发模式
      new webpack.NamedModulesPlugin(),
    ]
}

module.exports = config;