const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = function override(config, env) {
  // Ensure resolve.fallback exists
  config.resolve = config.resolve || {};
  config.resolve.fallback = {
    ...config.resolve.fallback,
    buffer: require.resolve('buffer/'),
    crypto: require.resolve('crypto-browserify'),
    stream: require.resolve('stream-browserify'),
  };

  // Ensure plugins exist and add NodePolyfillPlugin
  config.plugins = config.plugins || [];
  config.plugins.push(new NodePolyfillPlugin());

  return config;
};
