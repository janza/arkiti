const React = require('react')
const simpleTest = require('./simpleTest')

module.exports = class CompoundTest extends React.Component {
  constructor (prop) {
    const {foo, bar} = prop
    return <simpleTest foo={foo} bar={bar} />
  }
}
