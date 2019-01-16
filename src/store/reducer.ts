import { DImage } from './../utils/image';
import { handleActions } from 'redux-actions'
import { IState, IVIN, PART, LOSS } from './model';
import Types from './type'

export const initPart: PART.IPart = {
  location: <PART.IPartImage>{},
  feature: <Array<PART.IPartImage>>[{}] 
}

export const initialState: IState = {
  VIN: <IVIN>{},
  status: {
    vin_detecting: false,
    vin_querying: false,
    checking: false
  },
  parts: {},
  losses: []
}

export default handleActions<IState, any>({
  [Types.RESET_STORE]: (state, { payload }) => ({ ...initialState }),

  [Types.UPDATE_VIN]: (state, { payload }) => ({
    ...state,
    VIN: payload.VIN,
    status: {
      ...state.status,
      ...payload.status
    }
  }),

  [Types.TOGGLE_VIN_DETECT_STATUS]: (state, { payload }) => ({
    ...state,
    status: {
      ...state.status,
      vin_detecting: payload.status
    }
  }),

  [Types.TOGGLE_VIN_QUERY_STATUS]: (state, { payload }) => ({
    ...state,
    status: {
      ...state.status,
      vin_querying: payload.status
    }
  }),

  [Types.SELECT_PART_DIRECTION]: (state, { payload }) => ({
    ...state,
    parts: {
      ...state.parts,
      [payload.key]: []
    }
  }),

  [Types.CLEAR_PART_DIRECTION]: (state, { payload }) => {
    delete state.parts[payload.key]
    return {
      ...state,
      parts: {
        ...state.parts
      }
    }
  },

  [Types.UPDATE_PART_CLASS_IMAGE]: (state, { payload }) => {
    return {
      ...state,
      parts: {
        ...state.parts,
        ...payload.parts
      }
    }
  },

  [Types.PUT_LOSSES]: (state, { payload }) => ({
    ...state,
    losses: payload.losses
  })
}, initialState)