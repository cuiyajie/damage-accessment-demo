import { validateVIN } from '../../utils/validate';
import { Input, Icon, Button, Message } from '@antd';
import * as React from 'react';
import { connect, Dispatch } from 'react-redux';

import { IState, IVIN } from '../../store/model';
import { handleImage } from '../../utils';
import { Uploader } from '../../components/Uploader';
import ActionTypes from '../../store/type'
import api from '../../utils/api';
import { postFormData, post } from '../../utils/request';
import { DImage } from '../../utils/image';
import './Home.css';
import { push } from 'react-router-redux';

interface HomeProps {
  VIN: IVIN,
  vin_detecting: boolean,
  vin_querying: boolean,
  dispatch: Dispatch<any>
}

interface HomeState {
  vinWrapperCss: React.CSSProperties,
  vinCss: React.CSSProperties
}

class Home extends React.Component<HomeProps, HomeState> {

  async componentWillReceiveProps(nextProps: HomeProps) {
    const { VIN } = nextProps
    if (VIN && VIN.image) {
      await this.getStyle(VIN)
    } else {
      this.getDefaultStyle()
    }
  }

  vinCt: HTMLDivElement = null

  getDefaultStyle = () => {
    this.setState({
      vinWrapperCss: {
        height: 0,
        visibility: 'hidden',
        marginTop: 0
      },
      vinCss: {}
    })
  }

  getStyle = async (VIN: IVIN) => {
    const { source, width: ow, height: oh } = await VIN.image.getMeta()
    if (!this.vinCt) {
      return
    }
    const pw = this.vinCt.clientWidth
    const [ x1, y1, x2, y2 ] = VIN.rect
    const ratio = (y2 - y1) / (x2 - x1)
    const zoom = pw / (x2 - x1)
    this.setState({
      vinWrapperCss: {
        height: `${pw * ratio}px`,
        visibility: 'visible',
        marginTop: '20px'
      },
      vinCss: {
        backgroundImage: `url(${source})`,
        backgroundPosition: `-${x1 * zoom}px -${y1 * zoom}px`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: `${ow * zoom}px ${oh * zoom}px`
      }
    })
  }

  state = {
    vinWrapperCss: {},
    vinCss: {}
  }

  handleChooseFile = async (files: File[]) => {
    const { dispatch: d } = this.props
    const handledImage = await handleImage(files[0], 4000)
    d({ type: ActionTypes.TOGGLE_VIN_DETECT_STATUS, payload: { status: true } })
    const result = await <Promise<{ image_id: string, result: IVIN } | null>>postFormData(api.ocr.vin, { file: handledImage })
    if (result) {
      const image = await new DImage({ image_id: result.image_id }).syncSource()
      await image.load()
      d({ type: ActionTypes.UPDATE_VIN, payload: { 
        VIN: { 
          ...result.result, 
          image: new DImage({ image_id: result.image_id }) 
        },
        status: {
          vin_detecting: false
        }} 
      })
    } else {
      d({ type: ActionTypes.TOGGLE_VIN_DETECT_STATUS, payload: { status: false } })
    }
  }

  onVINInput = (e: React.SyntheticEvent<any>) => {
    const { VIN, dispatch: d } = this.props
    d({ type: ActionTypes.UPDATE_VIN, payload: { VIN: { ...VIN, vin: (e.target as HTMLInputElement).value.toUpperCase() } } })
  }

  onNext = async () => {
    const { VIN, dispatch: d } = this.props
    if (!VIN.car_info) {
      if (!validateVIN(VIN.vin || '')) {
        Message.error('请输入17位车辆VIN码')
        return
      }
      d({ type: ActionTypes.TOGGLE_VIN_QUERY_STATUS, payload: { status: true } })
      const result = await <Promise<{ car_info: string }>> post(api.car.query_vin, { vin: VIN.vin })
      if (result && 'car_info' in result) {
        d({ type: ActionTypes.UPDATE_VIN, payload: {
          VIN: {
            ...VIN,
            car_info: result.car_info
          }, 
          status: {
            vin_querying: false
          }}
        })
        d(push('select'))
      } else {
        d({ type: ActionTypes.TOGGLE_VIN_QUERY_STATUS, payload: { status: false } })
      }
    } else {
      d(push('select'))
    }
  }

  render() {
    const { VIN, vin_detecting, vin_querying } = this.props
    const { vinWrapperCss, vinCss } = this.state

    return <div id="home">
      <div className="form-home">
        <div className="logo f-h-logo"></div>
        <div className="f-h-vin" style={ vinWrapperCss }>
          <div ref={ C => { this.vinCt = C } } className="f-h-vin-ct" style={ vinCss }></div>
        </div>
        <div className="f-h-input mt20">
          <Input type="primary"
            placeholder="请输入17位车辆VIN码"
            value={ VIN.vin }
            onPressEnter={ this.onNext }
            onChange={ this.onVINInput }
            suffix={ <Uploader onFileChange={ this.handleChooseFile }><Button className="btn-capture" icon="camera" loading={ vin_detecting }></Button></Uploader> }>
          </Input>
        </div>
        <Button icon="arrow-right" type="primary" shape="circle" loading={ vin_querying } onClick={ this.onNext } className="btn-arrow mt30"></Button>
      </div>
    </div>
  }
}

export default connect((state: any) => {
  const global: IState = state.global
  return {
    VIN: global.VIN,
    vin_detecting: global.status.vin_detecting,
    vin_querying: global.status.vin_querying
  }
})(Home) 

