const React = require('react')

export default class extends React.Component {
  constructor () {
    super()
    this.state = { metadata: '' }
  }
  async componentWillReceiveProps (newProps) {
    const { fileName } = newProps
    // eslint-disable-next-line no-undef
    const res = await fetch(
      `http://localhost:3000/api/deps?fileName=${fileName}`
    )
    const {metadata, props} = await res.json()
    this.setState({ metadata, props })
  }

  render () {
    return this.state.metadata
      ? <div>
        {
          this.state.metadata.strings.map((dep, i) =>
            <div key={i}>
              {dep}
            </div>
          )
        }
        {
          this.state.props.map((prop, i) =>
            <div key={i}>
              {prop}
            </div>
          )
        }
      </div>
      : null
  }
}
