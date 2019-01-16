import { Uploader } from './Uploader';
import ImageDispaly from './ImageDisplay';
import { PART } from '../store/model';
import * as React from 'react';
import { Icon, Button, Message } from '@antd';
import { handleImage } from '../utils';
import api from '../utils/api';
import { ICallbackError, postFormData, postFormDataWithCallbackError } from '../utils/request';
import { enumPartDirection } from '../utils/constants';
import { DImage } from '../utils/image';
import { Dispatch } from 'redux';
import ActionTypes from '../store/type';
import * as _ from 'lodash';
const classNames = require('classnames')

interface ImageUploaderProps {
  partImage: PART.IPartImage,
  dir: string,
  type: string,
  title: string,
  onUpload: (partImage: PART.IPartImage | PART.IPartImage[]) => void,
  onClear: () => void
}

interface ImageUploaderState {
  sPartImage: PART.IPartImage,
  uploading: boolean
}

interface ImageUploadResponse {
  image_id: string, 
  conflict: boolean, 
  parts: any[]
}

export class ImageUploader extends React.Component<ImageUploaderProps, ImageUploaderState> {

  componentWillMount() {
    this.setState({ sPartImage: this.props.partImage })
  }

  async componentWillReceiveProps(nextProps: ImageUploaderProps) {
    if (this.props.partImage !== nextProps.partImage) {
      this.setState({ sPartImage: nextProps.partImage })
    }
  }

  state = {
    sPartImage: {} as PART.IPartImage,
    uploading: false
  }

  toggleUploading = (status: boolean) => {
    this.setState({ uploading: status })
  }

  handleDetectError = (handledImage: File, error: string) => {
    this.setState({ uploading: false }, async () => {
      const image = await new DImage(handledImage).syncSource()
      this.props.onUpload({ image, error })
    })
  }

  onUpload = async (files: File[]) => {
    const { dir, onUpload } = this.props
    const { sPartImage } = this.state
    const handledImage = await handleImage(files[0], 4000)
    this.toggleUploading(true)
    try {
      const result = await <Promise<ICallbackError | ImageUploadResponse>> postFormDataWithCallbackError(api.car.recognize_part, {
        direction: enumPartDirection[dir],
        file: handledImage
      })

      if (result && (result as ICallbackError).type === 'CallbackError') {
        const error = result as ICallbackError
        if (error.status === 'DETECTION_FAILED') {
          this.handleDetectError(handledImage, '未监测到部件，请退后几步重新拍摄损伤部件')
        } else {
          throw new Error(error.reason)
        }
      } else if (result && (result as ImageUploadResponse).image_id) {
        const response = result as ImageUploadResponse
        if (response.conflict) {
          this.handleDetectError(handledImage, '损伤部位与所选部位不同，请重新拍摄图片')
        } else if (!response.parts || !response.parts.length) {
          this.handleDetectError(handledImage, '未监测到部件，请退后几步重新拍摄损伤部件')
        } else {
          let image = await new DImage({ image_id: (result as { image_id: string }).image_id }).syncSource()
          await image.load()
          this.setState({ uploading: false }, async () => onUpload({ image, error: '' }))
        }
      } else {
        this.toggleUploading(false)
      }
    } catch (err) {
      Message.error(err.message)
      this.setState({ uploading: false, sPartImage: null })
    }
  }

  onLocalUpload = async (files: File[]) => {
    this.toggleUploading(true)
    const { onUpload }  = this.props
    const images = await Promise.all(_.map(files, async file => {
      const handledImage = await handleImage(file, 4000)
      return new DImage(handledImage).syncSource()
    }))
    onUpload(images.map(image => ({ image })))
    this.toggleUploading(false)
  }

  clearImage = () => {
    const { onClear } = this.props
    onClear && onClear()
  } 

  render() {
    const { type, title } = this.props
    const { sPartImage, uploading } = this.state
    
    if (sPartImage.image) {
      return <div className="u-i-container">
          <div className={ classNames({
            'u-i-c-inner': true,
            'image': true,
            'error': !!sPartImage.error
          }) }>
            <Button className="btn-image-clear" shape="circle" icon="close" onClick={ this.clearImage }></Button>
            { sPartImage.error ? 
                <span><img src={ sPartImage.image.source } />,
                <div className="u-i-c-wrap">
                  <Icon type="exclamation-circle-o"></Icon>
                  { sPartImage.error }
                </div></span> :
             <ImageDispaly src={ sPartImage.image.source }></ImageDispaly> }
          </div>
        </div>
    } else if (uploading) {
      return <div className="u-i-container">
        <div className="u-i-c-inner flex">
          <Icon type="loading"></Icon>
        </div>
      </div>
    } else {
      return <Uploader multiple={ type === 'feature' }
        onFileChange={ type === 'location' ? this.onUpload : this.onLocalUpload }>
            <div className="u-i-container">
              <div className="u-i-c-inner flex">
                <Icon type="camera-o"></Icon>
                { title }
              </div>
            </div>
        </Uploader>
    }
  }
}