const fs = require('fs')
const path = require('path')

const MemoryFS = require('memory-fs')
const webpack = require('webpack')

const propDetector = require('../lib/propDetector')

const overwriteFileSystem = files => {
  const findFile = fileName =>
    Object.keys(files)
      .map(file => {
        if (fileName.match(new RegExp(file))) {
          return files[file]
        }
        return false
      })
      .filter(d => d)[0]

  return Object.assign({}, fs, {
    statSync: (fileName, cb) => {
      return fs.statSync(fileName)
    },
    stat: (fileName, cb) => {
      const found = findFile(fileName)
      if (found) {
        const stats = new fs.Stats()
        stats.isFile = () => true
        return cb(null, stats)
      }
      fs.stat(fileName, cb)
    },
    readFile: (fileName, cb) => {
      const found = findFile(fileName)
      if (found) {
        return cb(null, found)
      }
      fs.readFile(fileName, cb)
    },

    readFileSync: fileName => {
      return findFile(fileName) || fs.readFileSync(fileName)
    }
  })
}

module.exports = {
  run: (fileContents, cb) => {
    const memFs = new MemoryFS()
    const compiler = webpack({
      entry: './entry.js',
      output: {
        path: path.join(process.cwd(), 'dist'),
        filename: 'output.js'
      },

      module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /(node_modules|js\/src\/vendors|jquery.cropbox.js)/,
            loader: 'babel-loader',
            options: {
              plugins: [
                ['detective', {}],
                [propDetector, {}]
              ],

              extends: path.join(__dirname, '../.babelrc')
            }
          }
        ]
      }
    })

    compiler.inputFileSystem = overwriteFileSystem({
      'entry.js$': fileContents
    })

    compiler.resolvers.normal.fileSystem = compiler.inputFileSystem
    compiler.resolvers.context.fileSystem = compiler.inputFileSystem

    compiler.outputFileSystem = memFs
    compiler.run((err, stats) => {
      var output = ''
      try {
        output = memFs.readFileSync(
          path.join(process.cwd(), 'dist', 'output.js')
        )
      } catch (readError) {}
      cb(err, {
        stats: stats.toString(),
        contents: output
      })
    })
  }
}
