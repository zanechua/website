module.exports = function (api) {
    api.cache(true);
  
    const presets = [
        ["babel-preset-gatsby", {
            "targets": {
                "browsers": [">0.25%", "not dead"]
            }
        }]
    ];
  
    const plugins = [
        ["@babel/plugin-proposal-decorators", { "legacy": true }]
    ];
  
    return {
      presets,
      plugins
    };
  };
  