import React from 'react'
import 'isomorphic-fetch'

import Editor from './Editor'

export default class extends React.Component {
  constructor (props) {
    super()
    this.state = { content: '' }
  }

  async componentWillReceiveProps (newProps) {
    // eslint-disable-next-line no-undef
    const res = await fetch(`http://localhost:3000/api/fs?fileName=${newProps.fileName}`)
    const json = await res.json()
    this.setState({ content: json.content })
  }

  render () {
    return this.state.content ? <Editor content={this.state.content} /> : ''
  }
}
