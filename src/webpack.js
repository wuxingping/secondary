/**
 * Created by Lenovo on 2019/10/25.
 */
var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
module.exports = {
    mode: 'development',
    //入口js文件，如果是一个字符串，就是要打包的路径，如果是对象，可以打包成多个模块
    entry: {
        first: './src/first.js',
        second: './src/second.js'
    },
    //输出js文件
    output: {
        //输出文件路径
        path: path.resolve(__dirname, './dist'),
        //输出文件名称，当entry配置多个模块时需要使用[name]，对应entry模块的key
        filename: '[name].js',
        //公共资源公共路径
        publicPath: './'
    },
    //定义对模块的处理规则
    module: {
        //相当于老版本的loaders，配置编译规则
        rules: [
            //es6通过babel编译成es5
            {
                //正则表达式，匹配编译的文件
                test: /\.(js|jsx)$/,
                //排除的文件夹
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babal-loader',
                        options: {
                            presets: [
                                ['env'], 'react', 'es2015', 'stage-0'],
                            plugins: ['transform-runtime', 'add-module-exports'],
                        }
                    }
                ]
            },
            //解析css, 并把css添加到html的style标签里
            {
                test: /.css$/,
                use: [
                    'style-loader', 'css-loader'
                ]
            },
            //解析less, 把less解析成浏览器可以识别的css语言
            {
                test: /.less$/,
                use: [
                    'style-loader', 'css-loader', 'less-loader'
                ]
            },
            //解析图片资源
            {
                test: /.(jpg|png|gif|svg)$/,
                //小于8MB处理成base64
                use: ['url-loader?limit=8192&name=./[name].[ext]']
            },
            //解析文件
            {
                test: /\.(gif|png|jpe?g|eot|woff|ttf|svg|pdf)$/,
                use: ['file-loader'],
            },
        ]
    },
    //定义插件，ExtractTextPlugin是将css独立引入变成link标签引入形式
    plugins: [new ExtractTextPlugin("style.css")],
    //服务器配置
    devServer: {
        //文件路径
        contentBase: path.resolve(__dirname, './dist'),
        //主机地址
        host: 'localhost',
        //是否启动 gzip 压缩
        compress: true,
        //端口号
        port: 8000,
        //是否热加载
        hot:true
    }
};
