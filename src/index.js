import React from 'react'
import ReactRequest from './render'

const SaveUser = ({ data }) => {
  return <post url="yay" data={data} />
}

class Batata extends React.Component {
  constructor() {
    super()
    this.state = {
      count: 0,
    }

    setInterval(() => {
      console.log('UPDATING>>>>>>>>')
      this.setState({ count: this.state.count + 1 })
    }, 2000)
  }

  render() {
    return <SaveUser data={{ count: this.state.count }} />
  }
}

ReactRequest.render(<Batata />)
