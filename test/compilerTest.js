const test = require('tape')
const compiler = require('../lib/compiler')

test('compiler', t => {
  compiler.run(
    `
  const React = require('react')
  class Test extends React.Component {
    render () {
      return this.props.test
    }
  }
    module.exports = Test
    `,
    (err, contents) => {
      t.isEqual(err, null)
      console.log(contents.stats.toString())
      console.log(contents.contents.toString())
      t.end()
    }
  )
})
