module.exports = function (api) {
  api.cache(true);

  const presets = [
    [
      'babel-preset-gatsby',
      {
        targets: {
          browsers: ['>0.25%', 'not dead']
        }
      }
    ]
  ];

  const plugins = [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.jsx', '.js', '.json'],
        alias: {
          root: './',
          assets: './src/assets/',
          components: './src/components/',
          lib: './src/lib/',
          styles: './src/styles/',
          templates: './src/templates/',
          utils: './src/utils/'
        }
      }
    ]
  ];

  return {
    presets,
    plugins
  };
};
