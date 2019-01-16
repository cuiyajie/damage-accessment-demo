import api from '../../utils/api';
import { ICallbackError, postFormDataWithCallbackError } from '../../utils/request';
import { mapPartDirection, enumPartDirection, enumPartClass } from '../../utils/constants';
import ImageDispaly from '../../components/ImageDisplay';
import { IState, PART, LOSS } from '../../store/model';
import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import * as _ from 'lodash';
import './PartUpload.css';
import { ImageUploader } from '../../components/ImageUploader';
import { Button, Modal, Icon, Message } from '@antd';
import { initPart } from '../../store/reducer';
import ActionTypes from '../../store/type'
import { push } from 'react-router-redux';
import * as rx from 'rxjs';
import { ImageID } from 'src/utils/image';
const DamageLocation = require('../../assets/images/damage-location.jpg');
const DamageFeature = require('../../assets/images/damage-feature.jpg');

interface PartUploadProps {
  parts: PART.IParts,
  dispatch: Dispatch<any>
}

interface PartUploadState {
  prepare: PART.IParts,
  verifying: boolean
}

interface IReqPart {
  dir: string,
  part: {
    location: PART.IPartImage,
    feature: PART.IPartImage,
    result?: any
  }
}

class PartUpload extends React.Component<PartUploadProps, PartUploadState> {

  componentDidMount() {
    const { parts, dispatch: d } = this.props
    if (_.isEmpty(parts)) {
      d(push('select'))
      return
    }
    this.setState({ prepare: this.prepare(this.props.parts) })
  }

  componentWillReceiveProps(nextProps: PartUploadProps) {
    if (this.props.parts !== nextProps.parts) {
      this.setState({ prepare: this.prepare(nextProps.parts) })
    }
  }

  state = {
    prepare: {} as PART.IParts,
    verifying: false
  }
  
  prepare = (parts: PART.IParts): PART.IParts => {
    let prepare = {}
    Object.keys(enumPartDirection).forEach(key => {
      if (!parts[key])  return
      if (key === 'TOPFRONT') {
        prepare['FRONT'] = [
          ...(parts[key] || []),
          ...(parts['FRONT'] || [])
        ]
      } else if (key === 'TOPBACK') {
        prepare['BACK'] = [ 
          ...(parts[key] || []), 
          ...(parts['BACK'] || []) 
        ]
      } else {
        prepare[key] = [ ...(parts[key] || []) ]
      }
    })

    for(let key in prepare) {
      if (prepare[key] && !prepare[key].length) {
        prepare[key] = [{ ...initPart }]
      }
    }
    return prepare
  }

  addImagePart = (dir: string) => {
    this.setState({
      prepare: {
        ...this.state.prepare,
        [dir]: [
          ...this.state.prepare[dir],
          { ...initPart }
        ]
      }
    })
  }

  onLocationUpload = (dir: string, index: number, partImage: PART.IPartImage) => {
    const { prepare } = this.state
    if (prepare[dir] && prepare[dir][index]) {
      prepare[dir][index] = prepare[dir][index] || ({} as PART.IPart)
      prepare[dir][index].location= partImage
      this.setState({ prepare: { ...prepare } })
    }
  }

  onFeatureUpload = (dir: string, index: number, fIndex: number, partImage: PART.IPartImage[]) => {
    const { prepare } = this.state
    if (prepare[dir] && prepare[dir][index]) {
      prepare[dir][index] = prepare[dir][index] || ({} as PART.IPart)
      const features = prepare[dir][index].feature
      const isTail = (fIndex + 1 === features.length)
      prepare[dir][index].feature = [ ...features.slice(0, fIndex), ...partImage, ...features.slice(fIndex + 1) ]
      if (isTail) {
        prepare[dir][index].feature.push({})
      }
      this.setState({ prepare: { ...prepare } })
    }
  }

  onLocationClear = (dir: string, index: number) => {
    const { prepare } = this.state
    prepare[dir][index].location = {}
    this.setState({ prepare: { ...prepare } })
  }

  onFeatureClear = (dir: string, index: number, fIndex: number) => {
    const { prepare } = this.state
    const features = prepare[dir][index].feature
    prepare[dir][index].feature = [ ...features.slice(0, fIndex), ...features.slice(fIndex + 1) ]
    prepare[dir][index].feature = prepare[dir][index].feature.length ? prepare[dir][index].feature : [{}]
    this.setState({ prepare: { ...prepare } })
  }

  onPrev = () => {
    const { dispatch: d } = this.props
    d({ type: ActionTypes.UPDATE_PART_CLASS_IMAGE, payload: { parts: this.state.prepare } })
    d(push('select'))
  }

  prepareToArray = (): IReqPart[] => {
    const { prepare } = this.state
    let prepareArray: IReqPart[] = []
    let flag = true;
    for(let key in prepare) {
      prepare[key].forEach(pa => {
        if (_.isEmpty(pa.location) && 
           (_.isEmpty(pa.feature) || _.isEmpty(pa.feature[0]))) {
          return
        } else if ( !pa.location.error &&
          pa.location && pa.location.image && pa.location.image.isImageID() &&
          pa.feature && pa.feature.length) {
          prepareArray = prepareArray.concat(
            pa.feature.filter(paf => !_.isEmpty(paf) && !paf.error) 
            .map(paf => ({
              dir: key,
              part: {
                location: pa.location,
                feature: paf
              }
            }
          )))
        } else {
          Message.error('请补充损伤部位或损伤特写图')
          flag = false
          return
        }
      })
      if (!flag) return null
    }
    return prepareArray
  }

  getLossFromPrepare = (): LOSS.ILoss[] => {
    const { prepare } = this.state
    let losses: LOSS.ILoss[] = []
    for(let key in prepare) {
      losses = losses.concat(_.map(_.flatten(prepare[key].map(pp => pp.feature)), pf => pf.result))
    }
    return losses.filter(loss => !_.isEmpty(loss))
  }

  onNext = () => {
    let prepareArray = this.prepareToArray()
    if (prepareArray === null) {
      return
    }
    if (prepareArray.length < 1) {
      Message.error('请补充损伤部位或损伤特写图')
      return
    }
    this.setState({ verifying: true })
    let errorArray = []
    let failCount = 0
    rx.Observable
    .from(prepareArray)
    .filter(pa => _.isEmpty((pa.part.feature || {}).result))
    .mergeMap(pa => rx.Observable.fromPromise(
      postFormDataWithCallbackError(api.car.assess_loss, { 
        direction: enumPartDirection[pa.dir], 
        part_image_id: (pa.part.location.image.image as ImageID).image_id,
        detail_image_file: (pa.part.feature.image.image as Blob) 
      })), (valueFromSource, valueFromPromise) => {
        return {
          source: valueFromSource,
          response: valueFromPromise as (ICallbackError | LOSS.ILoss)
        }
      }, 2)
    .subscribe(result => {
      if (result.response && (result.response as ICallbackError).type === 'CallbackError') {
        const error = result.response as ICallbackError
        if (error.status === 'DETECTION_FAILED') {
          result.source.part.feature.error = '未检测到损伤，请近距离拍摄损伤特写'
        } else {
          errorArray.push(error.reason)
        }
        failCount++;
      } else {
        const res = result.response as LOSS.ILoss
        if (res && !res.conflict && res.parts && res.parts.length) {
          result.source.part.feature.result = result.response;
        } else {
          failCount++;
          result.source.part.feature.error = res.conflict ? '损伤特写不在所选部位上，请重新拍摄图片' : '未检测到损伤，请近距离拍摄损伤特写'
        }
      }
    }, (err) => {}, () => {
      if (errorArray.length > 0) {
        Message.error(errorArray[errorArray.length - 1])
        this.setState({ verifying: false })
      } else {
        this.setState({ verifying: false, prepare: { ...this.state.prepare } }, () => {
          if (failCount === 0) {
            const { dispatch: d } = this.props
            d({ 
              type: ActionTypes.PUT_LOSSES, 
              payload: { losses: this.getLossFromPrepare() } 
            })
            d(push('result'))
          }
        })
      }
    })
  }

  renderSample = () => {
    return <div className="uploader sample">
      <div className="u-header">示意图：</div>
      <div className="u-items">
        <div className="u-item">
          <div className="u-i-container sample-1">
            <div className="u-i-c-inner">
              <ImageDispaly src={ DamageLocation }></ImageDispaly>
            </div>
          </div>
          <div className="u-i-text">
            <p className="u-i-t-title">损伤部位</p>
            <p className="u-i-t-desc">距离车辆损伤部位1米左右拍摄照片</p>
          </div>
        </div>
        <div className="u-item">
          <div className="u-i-container sample-2">
            <div className="u-i-c-inner">
              <ImageDispaly src={ DamageFeature }></ImageDispaly>
            </div>
          </div>
          <div className="u-i-text">
            <p className="u-i-t-title">损伤特写</p>
            <p className="u-i-t-desc">拉近摄像头，近距离拍摄损伤</p>
          </div>
        </div>
      </div>
    </div>
  }

  renderUploaders = () => {
    const { prepare } = this.state
    return _.map(Object.keys(prepare), (dir, i) => {
      return prepare[dir].length ? <div className="uploader" key={ dir }>
        <div className="u-header">{ `${i+1}、${mapPartDirection[enumPartDirection[dir]]}` }</div>
        { _.map(prepare[dir], (part, j) =>  <div className="u-items" key={ j }>
            <div className="u-item"><ImageUploader key={ `${dir}_${j}_location` }
              type="location" 
              onUpload={ this.onLocationUpload.bind(this, dir, j) } 
              onClear={ this.onLocationClear.bind(this, dir, j) }
              dir={ dir } title="损伤部位" partImage={ part.location }/></div>
              { _.map(part.feature, (pf, k) => <div className="u-item" key={ `${j}_${k}` }>
                <ImageUploader key={ `${dir}_${j}_${k}_feature` } 
                  type="feature"
                  onUpload={ this.onFeatureUpload.bind(this, dir, j, k) } 
                  onClear={ this.onFeatureClear.bind(this, dir, j, k) }
                  dir={ dir } title="损伤特写" partImage={ pf } /></div>) }
          </div>) }
        <div className="u-footer">
          <Button icon="plus-circle-o" className="btn-plus" onClick={ this.addImagePart.bind(this, dir) }></Button>
          如未拍全损伤部件，可点击添加一组图片
        </div>
      </div> : null
    })
  }

  renderUploadPage = () => {
    return <div className="container">
      <div className="c-header">上传损伤照片</div>
      { this.renderSample() }
      { this.renderUploaders() }
      <div className="btn-list">
        <Button icon="arrow-left" shape="circle" onClick={ this.onPrev } className="btn-arrow mr50"></Button>
        <Button icon="arrow-right" type="primary" shape="circle" onClick={ this.onNext } className="btn-arrow"></Button>
      </div>
    </div>
  }

  renderLoadPage = () => {
    const { verifying } = this.state
    return <Modal
        visible={ verifying }
        footer={ null }
        className="accessing-modal"
        closable={ false }
        style={{ textAlign: 'center' }}>
        <Icon type="tool" style={{ margin: '15px 0', fontSize: '52px', color: '#68A9DE' }}></Icon><br />
          <span className="accessing">车辆定损中<span className="dots-loading">...</span></span>
        </Modal>
  }

  render() {
    const { verifying } = this.state

    return <div id="upload" className="outer-container">
      <div className="logo o-c-logo"></div>
      { this.renderUploadPage() }
      { this.renderLoadPage() }
    </div>
  }
}

export default connect((state: any) => {
  const global: IState = state.global
  return {
    parts: global.parts
  } 
})(PartUpload)