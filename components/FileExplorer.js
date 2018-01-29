import React from 'react'
import 'isomorphic-fetch'
import { Treebeard } from 'react-treebeard'

export default class extends React.Component {
  constructor (props) {
    super()
    this.state = {
      data: {
        name: 'root',
        id: props.directory,
        toggled: true,
        loading: true,
        children: []
      }
    }
    this.onToggle = this.onToggle.bind(this)
    this.loadDir(props.directory)
  }

  async loadDir (dir) {
    // eslint-disable-next-line no-undef
    const res = await fetch(`http://localhost:3000/api/dir?dir=${dir}`)
    const json = await res.json()
    this.setState({
      data: this.addChildrenToDir(
        this.state.data,
        dir,
        json.children.map(file => ({
          id: file.fullPath,
          children: file.isDir ? [] : null,
          name: file.fileName
        }))
      )
    })
  }

  addChildrenToDir (data, id, childrenToAdd) {
    if (data.id === id) {
      return Object.assign({}, data, {
        loading: false,
        children: childrenToAdd
      })
    }
    data.children.map(child => {
      return this.addChildrenToDir(child, id, childrenToAdd)
    })
  }

  onToggle (node, toggled) {
    console.log(node)
    if (this.state.cursor) {
      this.state.cursor.active = false
    }
    node.active = true
    if (!node.children) {
      this.setState({ cursor: node })
      this.props.onFileOpen(node.id)
      return
    }
    node.toggled = toggled
    if (!node.children.length) {
      this.loadDir(node.id)
    } else {
      this.setState({ cursor: node })
    }
  }

  render () {
    return <Treebeard data={this.state.data} onToggle={this.onToggle} />
  }
}
