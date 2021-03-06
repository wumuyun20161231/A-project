'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
  dev: {
    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/file': {
        target: 'https://1chalk.com', // 设置你调用的接口域名和端口号 别忘了加http
        secure: false,
        changeOrigin: true,//是否允许跨越
        pathRewrite: {
          '^/file': '' // 这里理解成用‘/dev'代替target里面的地址，后面组件中我们掉接口时直接用dev代替
          // 比如我要调用'http://10.78.8.136:8081/user/login'，直接写‘/dev/user/login'即可
        }
      },
      '/file52': {
        target: 'https://wx.wxtao.club', // 设置你调用的接口域名和端口号 别忘了加http
        secure: false,
        pathRewrite: {
          '^/file52': '' // 这里理解成用‘/dev'代替target里面的地址，后面组件中我们掉接口时直接用dev代替
          // 比如我要调用'http://10.78.8.136:8081/user/login'，直接写‘/dev/user/login'即可
        }
      }
    },
    // Various Dev Server settings
    host: 'localhost', // can be overwritten by process.env.HOST
    // host: '192.168.1.4', // can be overwritten by process.env.HOST
    port: 8088, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: true,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true,

    uglifyJsWarnings: true,
    uglifyJsDropDebugger: false,
    uglifyJsDropConsole: false
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/prdigree/',

    /**
     * Source Maps
     */

    productionSourceMap: false,
    uglifyJsWarnings: false,
    uglifyJsDropDebugger: true,
    uglifyJsDropConsole: true,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
