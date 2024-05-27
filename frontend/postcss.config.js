module.exports = {
  plugins: {
    autoprefixer: {},
    'postcss-preset-env': {
      autoprefixer: {
        flexbox: 'no-2009',
      },
      stage: 0,
      features: {
        'custom-properties': false,
        'nesting-rules': true, // Enable nesting
      },
    },
  },
};
