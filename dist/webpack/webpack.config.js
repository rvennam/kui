const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')
// const Visualizer = require('webpack-visualizer-plugin')
const CompressionPlugin = require('brotli-webpack-plugin')

module.exports = {
  context: path.resolve(path.join(__dirname, '../../')),
  entry: {
    main: './app/build/webapp/bootstrap/webpack.js',
    'editor.worker': './app/plugins/modules/editor/node_modules/monaco-editor/esm/vs/editor/editor.worker.js',
    'json.worker': './app/plugins/modules/editor/node_modules/monaco-editor/esm/vs/language/json/json.worker',
    'css.worker': './app/plugins/modules/editor/node_modules/monaco-editor/esm/vs/language/css/css.worker',
    'html.worker': './app/plugins/modules/editor/node_modules/monaco-editor/esm/vs/language/html/html.worker',
    'ts.worker': './app/plugins/modules/editor/node_modules/monaco-editor/esm/vs/language/typescript/ts.worker'
  },
  target: 'web',
  node: {
    fs: 'empty'
  },
  externals: [
    'tape', // modules/composer/node_modules/safer-buffer
    'dns', // modules/openwhisk/node_modules/retry/example/dns.js
    'tls', // needed by request
    'ansi-to-html', // needed by bash-like; not needed in a browser
    'readline',
    'chokidar',
    'fsevents',
    'fs-extra',
    'original-fs',
    'shelljs',
    'lodash',
    'node-docker-api',
    'docker-modem',
    'async',
    'module',
    'net',
    'webworker-threads', // wskflow
    'child_process',
    'xml2js', // used by ./app/plugins/modules/composer/@demos/combinators/http.js
    'nyc',
    'electron'
  ],
  devServer: {
    headers: { 'Access-Control-Allow-Origin': '*' }
  },
  optimization: {
    /* splitChunks: {
      // maxAsyncRequests: 6
      // minSize: 1000000
    }, */
    /* splitChunks: {
      chunks: 'all',
      cacheGroups: {
        default: false,
        vendors: false,
        editor: {
          priority: 10,
          test: /modules\/editor/
        },
        composer: {
          priority: 10,
          test: /modules\/composer/
        },
        'misc-modules': {
          priority: 5,
          test: /app\/plugins\/modules\//
        },
        'core-plugins': {
          priority: 1,
          test: /app\/plugins\//
        },
        'activation-visualizations': {
          priority: 10,
          test: /modules\/activation-visualizations/
        },
        'wskflow': {
          priority: 10,
          test: /modules\/wskflow/
        }
      }
    }, */
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {}
        }
      })
    ]
  },
  module: {
    rules: [
      //
      // typescript exclusion rules
      { test: /\/src\/*\.ts/, use: 'ignore-loader' },
      { test: /\/node_modules\/typescript\//, use: 'ignore-loader' },
      { test: /\/node_modules\/@babel\//, use: 'ignore-loader' },
      { test: /\/node_modules\/@types\//, use: 'ignore-loader' },
      // end of typescript rules
      //
      // the following elide terser from modules/plugin
      { test: /\/modules\/field-installed-plugins\//, use: 'ignore-loader' },
      { test: /\/modules\/field-installed-plugins\/node_modules\/buffer-from/, use: 'ignore-loader' },
      { test: /\/modules\/field-installed-plugins\/node_modules\/commander/, use: 'ignore-loader' },
      { test: /\/modules\/field-installed-plugins\/node_modules\/source-map/, use: 'ignore-loader' },
      { test: /\/modules\/field-installed-plugins\/node_modules\/terser/, use: 'ignore-loader' },
      { test: /\/terser\/tools/, use: 'ignore-loader' },
      // end of modules/plugin rules
      //
      // we don't want to pull in both the dynamic imports and the static imports
      // otherwise the splitter (seeing the static imports) won't be as effective
      // { test: /app\/content\/js\/static-import.js$/, use: 'raw-loader' },
      //
      { test: /\/modules\/editor\/node_modules\/monaco-editor\/min/, use: 'raw-loader' },
      { test: /\/modules\/editor\/plugin\/lib\/cmds\/edit-amd\.js/, use: 'raw-loader' },
      { test: /beautify-html\.js/, use: 'ignore-loader' },
      { test: /package-lock\.json/, use: 'ignore-loader' },
      { test: /jquery\.map/, use: 'ignore-loader' },
      { test: /sizzle\.min\.map/, use: 'ignore-loader' },
      { test: /app\/plugins\/bin/, use: 'ignore-loader' }, // no need for app/plugins/bin/ files
      { test: /\/modules\/queue-view\//, use: 'ignore-loader' },
      { test: /\/modules\/openwhisk-debug\/node_modules/, use: 'ignore-loader' }, // no need for openwhisk-debug plugin
      { test: /\/node_modules\/fsevents\//, use: 'ignore-loader' },
      { test: /\/node_modules\/nan\//, use: 'ignore-loader' },
      { test: /translation-demo\/composition.js$/, use: 'ignore-loader' },
      { test: /@seed/, use: 'ignore-loader' },
      { test: /\.DOCS/, use: 'ignore-loader' },
      { test: /\/docs\//, use: 'ignore-loader' },
      { test: /\/examples\//, use: 'ignore-loader' },
      // { test: /modules\/composer\/@demos\/.*\.js/, use: 'raw-loader' },
      // DANGEROUS: some node modules must have critical files under src/: { test: /\/src\//, use: 'ignore-loader' },
      { test: /\/test\//, use: 'ignore-loader' },
      { test: /\/tests\//, use: 'ignore-loader' },
      { test: /AUTHORS/, use: 'ignore-loader' },
      { test: /LICENSE/, use: 'ignore-loader' },
      { test: /license.txt/, use: 'ignore-loader' },
      { test: /\.md$/, use: 'ignore-loader' },
      { test: /\.markdown$/, use: 'ignore-loader' },
      { test: /~$/, use: 'ignore-loader' },
      { test: /\.tsx?$/, use: 'ignore-loader' },
      // end of ignore-loader
      //
      { test: /\.css$/, use: [ 'style-loader', 'css-loader' ] },
      { test: /\.sh$/, use: 'raw-loader' },
      { test: /\.html$/, use: 'raw-loader' },
      { test: /\.yaml$/, use: 'raw-loader' },
      { test: /monaco-editor\/min\/vs\/loader\.js/, use: 'raw-loader' },
      { test: /JSONStream\/index.js$/, use: 'shebang-loader' }
    ]
  },
  /* resolve: {
    alias: {
      '@cloudshell': path.resolve(__dirname, 'app')
    }
  }, */
  /* externals: [
    function (context, request, callback) {
      console.error('!!!!!!!!!!!!!', request)
      if (/^\//.test(request)) {
        callback(null, `commonjs ${request}`)
      } else {
        callback()
      }
    }
  ], */
  plugins: [
    new CompressionPlugin({ deleteOriginalAssets: true }),
    /* new Visualizer({ filename: './webpack-stats.html' }), */
    {
      apply: compiler => {
        compiler.hooks.compilation.tap('CloudShellHtmlBuilder', compilation => {
          compilation.hooks.afterHash.tap('CloudShellHtmlBuilder', () => {
            const hash = compilation.hash
            const main = `main.${hash}.bundle.js`
            console.log('CloudShellHtmlBuilder using this build hash', hash)
            const Builder = require('../../app/bin/build.js')
            new Builder({ main }).build()
          })
        })
      }
    }
  ],
  output: {
    globalObject: 'self', // for monaco
    path: path.resolve(__dirname, 'build'),
    filename: '[name].[hash].bundle.js'
  }
}
