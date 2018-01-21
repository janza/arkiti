const React = require('react')

module.exports = class extends React.Component {
  render () {
    const {foo, bar} = this.props
    return {foo, bar}
  }
}
