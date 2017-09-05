// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path');

module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    // 构建输出目录 也就是构建后的东西都扔这里
    assetsRoot: path.resolve(__dirname, '../dist'),
    // 资源子目录 除了index.html，其余的js img css都分在这里
    assetsSubDirectory: '.',
    assetsPublicPath: '/',
    productionSourceMap: true,
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
    bundleAnalyzerReport: process.env.npm_config_report,
    pages: require('./page.js').build
  },
  dev: {
    env: require('./dev.env'),
    // 端口
    port: 1001,
    // 自动打开浏览器
    autoOpenBrowser: false,
    // 资源子目录 除了index.html，其余的js img css都分在这里
    assetsSubDirectory: '.',
    // 项目目录 一个杠杠 啥意思呢，是根目录的意思
    assetsPublicPath: '/',
    proxyTable: {},
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false,
    pages: require('./page.js').dev
  }
};
