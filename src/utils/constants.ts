export const enumPartDirection = {
  FRONT: 0,
  LEFT: 2,
  BACK: 4,
  RIGHT: 6,
  TOP: 8,
  TOPFRONT: 80,
  TOPBACK: 84
}

export const mapPartDirection = {
  [enumPartDirection.FRONT]: '前侧',
  [enumPartDirection.LEFT]: '左侧',
  [enumPartDirection.BACK]: '后侧',
  [enumPartDirection.RIGHT]: '右侧',
  [enumPartDirection.TOP]: '顶部',
  [enumPartDirection.TOPBACK]: '后侧(行李箱盖、挡风玻璃)',
  [enumPartDirection.TOPFRONT]: '前侧(发动机盖、挡风玻璃)'
}

/*
FRONT_FADONGJIGAI -> TOP_FRONT_FADONGJIGAI
BACK_XINGLIXIANGGAI -> TOP_BACK_XINGLIXIANGGAI
FRONT_DANGFENGBOLI -> TOP_FRONT_DANGFENGBOLI
BACK_DANGFENGBOLI -> TOP__BACK_DANGFENGBOLI
*/

export const enumPartClass = {
  UNKNOWN: 0,
  FRONT_BAOXIANGANG: 1,
  BACK_BAOXIANGANG: 2,
  FRONT_BAOXIANGANG_ZHONGWANG: 3,
  TOPFRONT_FADONGJIGAI: 4,
  TOPFRONT_DANGFENGBOLI: 5,
  TOPBACK_DANGFENGBOLI: 6,
  TOPBACK_XINGLIXIANGGAI: 7,
  TOP_CHEDING: 8,
  LEFT_FRONT_DADENG: 9,
  RIGHT_FRONT_DADENG: 10,
  LEFT_BACK_WEIDENG: 11,
  RIGHT_BACK_WEIDENG: 12,
  LEFT_FRONT_ZIBAN: 13,
  RIGHT_FRONT_ZIBAN: 14,
  LEFT_FRONT_CHEMEN: 15,
  RIGHT_FRONT_CHEMEN: 16,
  LEFT_FRONT_CHEMENBOLI: 17,
  RIGHT_FRONT_CHEMENBOLI: 18,
  LEFT_BACK_CHEMENBOLI: 19,
  RIGHT_BACK_CHEMENBOLI: 20,
  LEFT_BACK_ZIBAN: 21,
  RIGHT_BACK_ZIBAN: 22,
  LEFT_BACK_SHIJINGZONGCHENG: 23,
  RIGHT_BACK_SHIJINGZONGCHENG: 24,
  LEFT_FRONT_LUNGU: 25,
  LEFT_BACK_LUNGU: 26,
  RIGHT_FRONT_LUNGU: 27,
  RIGHT_BACK_LUNGU: 28,
  LEFT_FRONT_LUNTAI: 29,
  LEFT_BACK_LUNTAI: 30,
  RIGHT_FRONT_LUNTAI: 31,
  RIGHT_BACK_LUNTAI: 32,
  LEFT_DINGBIAN: 33,
  RIGHT_DINGBIAN: 34,
  BACK_XINGLINGXIANG_PINGHENGWEIYI: 35,
  LEFT_B_ZHUWAISHIBAN: 36,
  RIGHT_B_ZHUWAISHIBAN: 37,
  LEFT_DIBIAN: 38,
  RIGHT_DIBIAN: 39,
  LEFT_BACK_CHEMEN: 40,
  RIGHT_BACK_CHEMEN: 41,
  LEFT_BACK_ZIBAN_LUNMEIZHUANGSHIBAN: 42,
  RIGHT_BACK_ZIBAN_LUNMEIZHUANGSHIBAN: 43,
  LEFT_FRONT_ZIBAN_LUNMEIZHUANGSHIBAN: 44,
  RIGHT_FRONT_ZIBAN_LUNMEIZHUANGSHIBAN: 45
}

export const mapPartClass = {
  [enumPartClass.UNKNOWN]: '未知',
  [enumPartClass.FRONT_BAOXIANGANG]: '前保险杠',
  [enumPartClass.BACK_BAOXIANGANG]: '后保险杠',
  [enumPartClass.FRONT_BAOXIANGANG_ZHONGWANG]: '前保险杠中网',
  [enumPartClass.TOPFRONT_FADONGJIGAI]: '前发动机盖',
  [enumPartClass.TOPFRONT_DANGFENGBOLI]: '前挡风玻璃',
  [enumPartClass.TOPBACK_DANGFENGBOLI]: '后挡风玻璃',
  [enumPartClass.TOPBACK_XINGLIXIANGGAI]: '后行李箱盖',
  [enumPartClass.TOP_CHEDING]: '车顶',
  [enumPartClass.LEFT_FRONT_DADENG]: '左前侧大灯',
  [enumPartClass.RIGHT_FRONT_DADENG]: '右前侧大灯',
  [enumPartClass.LEFT_BACK_WEIDENG]: '左后侧尾灯',
  [enumPartClass.RIGHT_BACK_WEIDENG]: '右后侧尾灯',
  [enumPartClass.LEFT_FRONT_ZIBAN]: '左前翼子板',
  [enumPartClass.RIGHT_FRONT_ZIBAN]: '右前翼子板',
  [enumPartClass.LEFT_FRONT_CHEMEN]: '左前车门',
  [enumPartClass.RIGHT_FRONT_CHEMEN]: '右前车门',
  [enumPartClass.LEFT_FRONT_CHEMENBOLI]: '左前车门玻璃',
  [enumPartClass.RIGHT_FRONT_CHEMENBOLI]: '右前车门玻璃',
  [enumPartClass.LEFT_BACK_CHEMENBOLI]: '左后车门玻璃',
  [enumPartClass.RIGHT_BACK_CHEMENBOLI]: '右后车门玻璃',
  [enumPartClass.LEFT_BACK_ZIBAN]: '左后翼子板',
  [enumPartClass.RIGHT_BACK_ZIBAN]: '右后翼子板',
  [enumPartClass.LEFT_BACK_SHIJINGZONGCHENG]: '左侧后视镜总成',
  [enumPartClass.RIGHT_BACK_SHIJINGZONGCHENG]: '右侧后视镜总成',
  [enumPartClass.LEFT_FRONT_LUNGU]: '左前轮毂',
  [enumPartClass.LEFT_BACK_LUNGU]: '左后轮毂',
  [enumPartClass.RIGHT_FRONT_LUNGU]: '右前轮毂',
  [enumPartClass.RIGHT_BACK_LUNGU]: '右后轮毂',
  [enumPartClass.LEFT_FRONT_LUNTAI]: '左前轮胎',
  [enumPartClass.LEFT_BACK_LUNTAI]: '左后轮胎',
  [enumPartClass.RIGHT_FRONT_LUNTAI]: '右前轮胎',
  [enumPartClass.RIGHT_BACK_LUNTAI]: '右后轮胎',
  [enumPartClass.LEFT_DINGBIAN]: '左侧顶边',
  [enumPartClass.RIGHT_DINGBIAN]: '右侧顶边',
  [enumPartClass.BACK_XINGLINGXIANG_PINGHENGWEIYI]: '后行李箱平衡尾翼',
  [enumPartClass.LEFT_B_ZHUWAISHIBAN]: '左侧B柱外饰板',
  [enumPartClass.RIGHT_B_ZHUWAISHIBAN]: '右侧B柱外饰板',
  [enumPartClass.LEFT_DIBIAN]: '左侧底边',
  [enumPartClass.RIGHT_DIBIAN]: '右侧底边',
  [enumPartClass.LEFT_BACK_CHEMEN]: '左后车门',
  [enumPartClass.RIGHT_BACK_CHEMEN]: '右后车门',
  [enumPartClass.LEFT_BACK_ZIBAN_LUNMEIZHUANGSHIBAN]: '左后侧翼子板轮眉装饰板',
  [enumPartClass.RIGHT_BACK_ZIBAN_LUNMEIZHUANGSHIBAN]: '右后侧翼子板轮眉装饰板',
  [enumPartClass.LEFT_FRONT_ZIBAN_LUNMEIZHUANGSHIBAN]: '左前翼子板轮眉装饰板',
  [enumPartClass.RIGHT_FRONT_ZIBAN_LUNMEIZHUANGSHIBAN]: '右前翼子板轮眉装饰板'
}

export const mapError = {
  'INVALID_ARGUMENT':	'请求参数错误',
  'DETECTION_FAILED':	'图片检测失败',
  'DOWNLOAD_ERROR':	'网络地址图片获取失败',
  'UNAUTHORIZED':	'未授权或授权失败',
  'RATE_LIMIT_EXCEEDED':	'调用频率超出限额',
  'NOT_FOUND':	'请求路径错误',
  'INTERNAL_ERROR':	'服务器内部错误'
}
