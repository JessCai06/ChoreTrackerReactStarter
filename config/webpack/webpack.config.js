const { generateWebpackConfig, merge } = require("shakapacker");

// See the shakacode/shakapacker README and docs directory for advice on customizing your webpackConfig.
var path = require("path");

const webpackConfig = generateWebpackConfig();

module.exports = merge(webpackConfig, {
  resolve: {
    alias: {
      // Force all modules to use the same jquery version.
      jquery: path.resolve(__dirname, "../../node_modules/jquery/src/jquery"),
    },
  },
});
