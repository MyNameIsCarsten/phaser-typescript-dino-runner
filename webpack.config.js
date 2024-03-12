const path = require('path');

module.exports = {
  entry: './src/game.ts', // Your main TypeScript file
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  output: {
    filename: 'bundle.js', // The bundled JavaScript file
    path: path.resolve(__dirname, 'dist')
  },
  mode: 'development', // Change to 'production' for production builds
  devServer: {
    static: {
        directory: path.join(__dirname, 'dist'),
        publicPath: '/',
        serveIndex: true, // This will serve an index file (like index.html) from static.directory
        watch: true,
    },
    compress: true,
    port: 9000,
  },
};
