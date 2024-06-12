module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'module:react-native-dotenv',
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            fonts: './assets/fonts',
            images: './assets/img',
            components: './src/components',
            screens: './src/screens',
            styles: './src/styles',
            routing: './src/Routing',
            state: './src/state',
            types: './src/types',
            interfaces: './src/interfaces',
          },
          extensions: ['.jsx', '.ts', '.tsx'],
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
