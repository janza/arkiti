const express = require('express')
const fs = require('fs')
const path = require('path')
// const babel = require('babel-core')
// const detective = require('babel-plugin-detective')
const compiler = require('../lib/compiler')

const router = express.Router()

router.get('/fs', (req, res) => {
  fs.readFile(req.query.fileName, (err, content) => {
    if (err) return res.json({ contents: `Error: ${err}` })
    res.json({ content: content.toString() })
  })
})

router.get('/deps', (req, res) => {
  fs.readFile(req.query.fileName, (err, fileContents) => {
    if (err) return res.json({error: err})

    compiler.run(fileContents, (err, output) => {
      if (err) return res.json({error: err})

      res.json({contents: output.stats + output.contents.toString()})
    })
  })
})

router.get('/dir', (req, res) => {
  const dir = req.query.dir
  fs.readdir(dir, (err, files) => {
    if (err) {
      res.status(500)
      return res.send({ error: 'Failed to get directory content' })
    }
    Promise.all(
      files.map(fileName => {
        const fullPath = path.join(dir, fileName)
        return new Promise((resolve, reject) => {
          fs.stat(fullPath, (err, stats) => {
            if (err) return reject(err)
            resolve({
              fullPath,
              fileName,
              isDir: stats.isDirectory()
            })
          })
        })
      })
    ).then(files => {
      res.json({ children: files })
    })
  })
})

module.exports = router
