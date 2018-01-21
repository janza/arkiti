const path = require('path')

const webpack = require('webpack')
const test = require('tape')
const babel = require('babel-core')

const propDetector = require('../lib/propDetector')

const tests = {
  '../components/Editor': ['content'],
  'files/simpleTest': ['test'],
  'files/constructorParam': ['test'],
  'files/selfParams': ['test'],
  'files/renameParams': ['test'],
  'files/deconstructParams': ['foo', 'bar'],
  'files/deconstructArgs': ['foo', 'bar'],
  'files/deconstructMethodParam': ['foo', 'bar'],
  'files/compound': ['foo', 'bar']
}
const babelConfig = {
  plugins: [
    ['transform-react-jsx', {}],
    [propDetector, {}]
  ]
}

Object.keys(tests).forEach(function (fileName) {
  const props = tests[fileName]
  test(`Detect props for ${fileName}`, t => {
    t.plan(2)
    babel.transformFile(
      path.join(__dirname, `./${fileName}.js`),
      babelConfig,
      (err, result) => {
        t.error(err)
        t.deepEquals(
          Array.from(result.metadata.props || []).sort(),
          props.sort()
        )
        console.log(result.code)
      }
    )
  })
})

test('webpack', t => {
  webpack(
    {
      entry: path.join(__dirname, './files/compound.js'),
      output: {
        path: path.resolve(__dirname),
        filename: 'my-first-webpack.bundle.js'
      },
      module: {
        rules: [
          {
            test: /\.js/,
            use: {
              loader: 'babel-loader',
              options: babelConfig
            }
          }
        ]
      }
    },
    (err, stats) => {
      t.error(err)
      t.notok(stats.hasErrors(), stats.toString())
      t.end()
    }
  )
})
