import { enumPartClass, enumPartDirection } from '../../utils/constants';
import { IState, PART, IVIN } from '../../store/model';
import * as React from 'react';
import './PartSelect.css';
import { Button } from '@antd';
import { connect, Dispatch } from 'react-redux';
import { push } from 'react-router-redux';
import * as _ from 'lodash';
import ActionTypes from '../../store/type'
import displayCarParts from '../../utils/part';
const classNames = require('classnames');

interface SelectPageProps {
  VIN: IVIN,
  parts: PART.IParts,
  dispatch: Dispatch<any>
}

class PartSelect extends React.Component<SelectPageProps, any> {
  
  componentWillMount() {
    const { VIN, dispatch: d } = this.props
    if (!VIN || !VIN.vin) {
      d(push('home'))
    }
  }

  onPrev = () => {
    this.props.dispatch(push('home'))
  }

  onNext = () => {
    this.props.dispatch(push('upload'))    
  }

  selectPart = (carSubPart) => {
    const { dispatch: d, parts } = this.props
    const direction = (carSubPart.match(/^(.*?)_/) || [])[1]
    if (direction && enumPartDirection[direction] !== undefined) {
      d({ 
        type: ActionTypes[parts[direction] ? 'CLEAR_PART_DIRECTION' : 'SELECT_PART_DIRECTION'], 
        payload: { key: direction } 
      })
    }
  }

  partSelected = (carSubPart: string): boolean => {
    const { parts } = this.props
    const direction = (carSubPart.match(/^(.*?)_/) || [])[1]
    return !!(direction && parts[direction])
  }

  render() {
    const { parts } = this.props

    return <div id="select" className="outer-container">
      <div className="logo o-c-logo"></div>
      <div className="container">
        <div className="c-header">选择车辆损伤部位</div>
        <div className="car-part">
          <span className="car-part-dir"></span>
          { _.map(displayCarParts, cpName => <div key={ cpName } 
              className={ classNames({ 
                'cp-cell': true,
                [`cp-${cpName}`]: true,
                'active': this.partSelected(cpName)
              }) } 
              onClick={ this.selectPart.bind(this, cpName) }>
            </div>) 
          }
        </div>
        <div className="btn-list">
          <Button icon="arrow-left" shape="circle" onClick={ this.onPrev } className="btn-arrow mr50"></Button>
          <Button icon="arrow-right" type="primary" shape="circle" onClick={ this.onNext } disabled={ !Object.keys(parts).length } className="btn-arrow"></Button>
        </div>
      </div>
    </div>
  }
}

export default connect((state: any) => {
  const global: IState = state.global
  return {
    VIN: global.VIN,
    parts: global.parts
  } 
})(PartSelect)