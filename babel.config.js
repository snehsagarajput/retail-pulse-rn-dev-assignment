module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    'react-native-reanimated/plugin',
    [
      'module-resolver',
      {
        root: ['./src/'],
        alias: {
          components: './src/components',
          assets: './src/assets',
          context: './src/context',
          hooks: './src/hooks',
          screens: './src/screens',
          styles: './src/styles',
          utils: './src/utils',
        },
        extensions: ['.js', '.jsx', '.ios.js', '.android.js'],
      },
    ],
  ],
};
