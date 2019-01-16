import { getImageUrl } from '../../utils/request';
import ImageDispaly from '../../components/ImageDisplay';
import { ColumnProps } from 'antd/es/table/Column';
import displayCarParts from '../../utils/part';
import { IState, IVIN, LOSS } from '../../store/model';
import * as React from 'react';
import './Result.css';
import { connect } from 'react-redux';
import * as _ from 'lodash';
import { Dispatch } from 'redux';
import { push } from 'react-router-redux';
import { enumPartClass, mapPartClass } from '../../utils/constants';
import { Table, Button } from '@antd';
import ActionTypes from '../../store/type'

const invertedEnumPartClass = _.invert(enumPartClass)

interface ResultProps {
  VIN: IVIN,
  losses: LOSS.ILoss[],
  dispatch: Dispatch<any>
}

interface ResultState {
  sLossParts: string[]
}

const getSpan = span => span || -1
const setSpan = span => span > 0 ? (span + 1) : Math.abs(span)

class Result extends React.Component<ResultProps, ResultState> {

  componentDidMount() {
    const { VIN, losses, dispatch: d } = this.props
    if (_.isEmpty(VIN)) {
      d(push('home'))
    } else if (_.isEmpty(losses)) {
      d(push('select'))
    } else {
      this.setState({ 
        sLossParts: _.flatten(_.map(losses, loss => loss.parts))
        .map(part => {
          return invertedEnumPartClass[part.part_class].replace('LUNGU', 'LUNTAI')
        })
      })
    }
  }

  state = {
    sLossParts: []
  }

  renderLossFigure = () => {
    const { sLossParts } = this.state
    return <div className="loss-section">
      <div className="l-pin">损伤部件</div>
      <div className="car-part">
        { _.map(sLossParts, (cpName, i) => <div key={i} 
            className={ `cp-cell cp-${cpName} active` }>
          </div>) }
      </div>
    </div>
  }

  handleLossData = (losses: LOSS.ILoss[]): LOSS.IVariantMetaLoss[] => {
    let variantLosses: LOSS.IVariantMetaLoss[] = []
    _.forEach(losses, loss => {
      _.forEach(loss.parts, lossPart => {
        _.forEach(lossPart.subparts, lps => {
          variantLosses = variantLosses.concat(_.map(lps.losses, ll => ({
            detail_image_id: loss.detail_image_id,
            part_image_id: loss.part_image_id,
            part_class: lossPart.part_class,
            part_name: lossPart.part_name,
            detail_rect: lossPart.detail_rect,
            subpart_name: lps.subpart_name,
            repair_plan: lps.repair_plan,
            partRowSpan: 0,
            imageRowSpan: 0,
            lossRowSpan: 0,
            ...ll
          })))
        })
      })
    })

    let imageRowSpan = 0, partRowSpan = 0, lossRowSpan = 0;
    variantLosses.forEach((vl, i) => {
      vl.rowKey = `${i}`
      let next = variantLosses[i + 1]
      if (next) {
        if (vl.detail_image_id === next.detail_image_id) {
          imageRowSpan++
        } else {
          variantLosses[i - imageRowSpan].imageRowSpan = getSpan(imageRowSpan)
          variantLosses[i - partRowSpan].partRowSpan = getSpan(partRowSpan)
          variantLosses[i - lossRowSpan].lossRowSpan = getSpan(lossRowSpan)
          imageRowSpan = 0
          partRowSpan = 0
          lossRowSpan = 0
          return
        }

        if (vl.part_class === next.part_class) {
          partRowSpan++
        } else {
          variantLosses[i - partRowSpan].partRowSpan = getSpan(partRowSpan)
          variantLosses[i - lossRowSpan].lossRowSpan = getSpan(lossRowSpan)
          partRowSpan = 0
          lossRowSpan = 0
          return
        }

        if (vl.subpart_name === next.subpart_name) {
          lossRowSpan++
        } else {
          variantLosses[i - lossRowSpan].lossRowSpan = getSpan(lossRowSpan)
          lossRowSpan = 0
          return
        }
      } else {
        variantLosses[i - imageRowSpan].imageRowSpan = getSpan(imageRowSpan)
        variantLosses[i - partRowSpan].partRowSpan = getSpan(partRowSpan)
        variantLosses[i - lossRowSpan].lossRowSpan = getSpan(lossRowSpan)
      }
    })
    return variantLosses
  }

  getColumns = (): ColumnProps<LOSS.IVariantMetaLoss>[] => {
    return [{
      title: '损伤图片',
      dataIndex: 'detail_image_id',
      render: (text, row, index) => {
        return {
          children: <div className="img-td">
            <div className="img-td-inner"><ImageDispaly src={ getImageUrl(row.detail_image_id) }></ImageDispaly></div>
          </div>,
          props: {
            rowSpan: setSpan(row.imageRowSpan)
          }
        }
      }
    }, {
      title: '损伤部件',
      dataIndex: 'part_class',
      render: (text, row, index) => {
        return {
          children: <span>{ row.part_name }</span>,
          props: {
            rowSpan: setSpan(row.partRowSpan)
          }
        }
      }
    }, {
      title: '损伤类型',
      dataIndex: 'type',
      render: (text, row, index) => <span>{ row.type }</span>
    }, {
      title: '维修方案',
      dataIndex: 'repair_plan',
      render: (text, row, index) => ({
        children: <span>{ row.repair_plan.join('、') }</span>,
        props: {
          rowSpan: setSpan(row.lossRowSpan)
        }
      })
    }]
  }

  renderLossTable = () => {
    const losses = this.handleLossData(this.props.losses)
    return <div className="loss-section">
      <div className="l-pin">损伤详情</div>
      <div className="loss-table-container">
        <Table rowKey="rowKey" 
          className="loss-table"
          bordered={ true } 
          pagination={ false } 
          dataSource={ losses } 
          columns={ this.getColumns() }>
        </Table>
      </div> 
    </div>
  }

  goBack = () => {
    const { dispatch: d } = this.props
    d({ type: ActionTypes.RESET_STORE });
    d(push('home'));
  }

  render() {
    const { VIN, dispatch: d } = this.props
    return <div id="result" className="outer-container">
      <div className="logo o-c-logo"></div>
      <div className="container">
        <div className="c-header">
          { VIN.car_info }
          <span className="c-h-subtitle">{ VIN.vin }</span>
        </div>
        { this.renderLossFigure() }
        { this.renderLossTable() }
        <div className="btn-list">
          <Button className="btn-back" type="primary" size="large" onClick={ this.goBack }>返回首页</Button>
        </div>
      </div>
    </div>
  }
}

export default connect((state: any) => {
  const global: IState = state.global
  return {
    VIN: global.VIN,
    losses: global.losses
  } 
})(Result)