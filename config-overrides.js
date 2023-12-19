const webpack = require('webpack');
module.exports = function override(config, env) {
  config.resolve.fallback = {
    buffer: require.resolve('buffer'),
    http: require.resolve('stream-http'),
    https: require.resolve('https-browserify'),
    url: require.resolve('url'),
  };
  config.plugins.push(
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    })
  );
  return config;
};
