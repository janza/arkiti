import React from 'react'
import FileReader from '../components/FileReader'
import FileExplorer from '../components/FileExplorer'
import FileGrapher from '../components/FileGrapher'

export default class extends React.Component {
  constructor () {
    super()
    this.state = {
      fileName: './pages/index.js'
    }
    this.onFileOpen = this.onFileOpen.bind(this)
  }
  onFileOpen (fileName) {
    this.setState({ fileName })
  }
  render () {
    return (
      <div
        style={{
          maxWidth: '800px',
          margin: '0 auto'
        }}
      >
        <FileExplorer directory={'./components'} onFileOpen={this.onFileOpen} />

        {this.state.fileName}
        <div style={{display: 'flex'}}>
          <FileReader style={{width: '50%'}} fileName={this.state.fileName} />
          <FileGrapher style={{width: '50%'}} fileName={this.state.fileName} />
        </div>
      </div>
    )
  }
}
