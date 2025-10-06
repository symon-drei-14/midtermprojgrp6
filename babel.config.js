module.exports = {
  presets: [
    [
      'module:@react-native/babel-preset',
      {
        unstable_transformProfile: 'hermes-stable',
      },
    ],
  ],
  plugins: [
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
        safe: false,
        allowUndefined: true,
      },
    ],
  ],
};