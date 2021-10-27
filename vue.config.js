const webpack = require('webpack')

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/aiq-entrega/' : '/',
  transpileDependencies: [
    'vuetify'
  ],
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        'process.browser': 'true'
      }),
    ]
  }
}
