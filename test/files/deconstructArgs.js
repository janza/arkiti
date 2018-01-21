const React = require('react')

module.exports = class extends React.Component {
  constructor (prop) {
    const {foo, bar} = prop
    return {foo, bar}
  }
}
