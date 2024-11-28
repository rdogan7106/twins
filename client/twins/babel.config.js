module.exports = {
    presets: ['@babel/preset-env', '@babel/preset-react'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./twins/src'],
          alias: {
            '@': './twins/src',
          },
        },
      ],
    ],
  };
  