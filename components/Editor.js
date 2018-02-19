import React from 'react'
// import NoSSR from 'react-no-ssr'
// import ContentEditable from 'react-contenteditable'
// import AceEditor from 'react-ace'

var debounce = function (func) {
  var timeout

  return function debounced () {
    var obj = this
    var args = arguments
    function delayed () {
      func.apply(obj, args)
      timeout = null
    }

    if (timeout) clearTimeout(timeout)

    timeout = setTimeout(delayed, 200)
  }
}

export default class Editor extends React.Component {
  constructor () {
    super()
    this.onChange = debounce(this.onChange.bind(this))
  }
  onChange (val) {
    console.log(val)
  }
  render () {
    return (
      <pre>
        <textarea style={{width: '100%', height: '500px'}} defaultValue={this.props.content} onChange={(e) => this.onChange(e.target.value)} />
      </pre>
    )
  }
}

// <AceEditor
//   mode='javascript'
//   theme='monokai'
//   name='blah2'
//   onChange={this.onChange}
//   fontSize={14}
//   showPrintMargin
//   showGutter
//   highlightActiveLine
//   value={this.props.content}
//   setOptions={{
//     enableBasicAutocompletion: false,
//     enableLiveAutocompletion: false,
//     enableSnippets: false,
//     showLineNumbers: true,
//     tabSize: 2
//   }}
// />
