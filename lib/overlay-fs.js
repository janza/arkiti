const fs = require('fs')
const MemoryFileSystem = require('memory-fs')

var mock = {}

;[
  'statSync',
  'readdirSync',
  'mkdirpSync',
  'mkdirSync',
  'rmdirSync',
  'unlinkSync',
  'readlinkSync',

  'stat',
  'readdir',
  'mkdirp',
  'mkdir',
  'rmdir',
  'unlink',
  'readlink',

  'meta',
  'existsSync',
  'readFileSync',
  '_remove',
  'writeFileSync',
  'join',
  'normalize',
  'exists',
  'readFile',
  'writeFile'
].forEach(function (name) {
  mock[name] = function () {
    console.log('CALLED', name)
  }
})

module.exports = data => {
  const memFs = new MemoryFileSystem()
}
