const resolve = require('path').resolve;
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
// const { TsConfigPathsPlugin } = require('awesome-typescript-loader');

const pkg = require('./package.json');

let theme = {};
if (pkg.theme && typeof(pkg.theme) === 'string') {
  let cfgPath = pkg.theme;
  // relative path
  if (cfgPath.charAt(0) === '.') {
    cfgPath = resolve(__dirname, cfgPath);
  }
  const getThemeConfig = require(cfgPath);
  theme = getThemeConfig();
} else if (pkg.theme && typeof(pkg.theme) === 'object') {
  theme = pkg.theme;
}

const webpackConfig = {
  entry: {
    'index': './src/index.tsx'
  },
  output: {
    filename: '[name].js',
  },
  devServer: { 
    inline: true
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      '@antd': resolve(__dirname, 'src/antd'),
      '@images': resolve(__dirname, 'src/assets/images')
    }
  },
  module: {
    rules: [  
      {
        test: /\.tsx?$/,
        use: [
          'babel-loader', 
          {
            loader: 'awesome-typescript-loader',
            options: { 
              useBabel: true
            }
          }
        ]
      }, 
      {
        test: /\.css$/,
        
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              importLoaders: 1
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: loader => [
                require('postcss-import')({ 
                  root: loader.resourcePath,
                  path: [ 
                    resolve(__dirname, 'src/style')
                  ]
                }),
                require('postcss-nested')(),
                require('postcss-mixins')(),
                require('postcss-custom-media')(),
                require('postcss-cssnext')(),
                require('postcss-calc')()
              ]
            }
          }
        ]
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        use: [{
          loader: 'url-loader',
          options: { limit: 10 * 1024 }
        }]
      },
      {
        test: /static\/(.+?)$/,
        use: [{
          loader: 'file-loader',
          options: { name: 'state/[name].[ext]' }
        }]
      }
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    }),
    new BrowserSyncPlugin(
      {
        host: 'localhost',
        port: 3000,
        proxy: 'http://localhost:8080/'
      },
      {
        reload: false
      }
    )
  ]
};

module.exports = () => webpackConfig;







