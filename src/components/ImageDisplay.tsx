import * as React from 'react'
import ImageZoom from 'react-medium-image-zoom'

export default class ImageDispaly extends React.Component<{ src: string }, any> {

  render() {
    const { src } = this.props
    return <ImageZoom image={{ src }} defaultStyles={{ zoomImage: { objectFit: 'contain' } }}></ImageZoom>
  }
}