const React = require('react')

module.exports = class extends React.Component {
  render () {
    const that = this
    return that.props.test
  }
}
