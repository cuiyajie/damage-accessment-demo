import { DImage } from './../utils/image';

export type Rect = [number, number, number, number]

export interface IVIN {
  vin: string,
  image?: DImage,
  car_info: string,
  rect: Rect
}

export namespace PART {
  export interface IPartImage {
    image?: DImage,
    error?: string,
    result?: any
  }

  export interface IPart {
    location: IPartImage,
    feature: IPartImage[]
  }

  export type IParts = { [key: string]: IPart[] }
}

export namespace LOSS {
  export interface ILoss {
    part_image_id: string,
    detail_image_id: string,
    conflict: boolean,
    parts: IPartLoss[]
  }
  
  export interface IPartLoss {
    part_class: number,
    part_name: string,
    detail_rect: Rect,
    subparts: ISubPartLoss[]
  }
  
  export interface ISubPartLoss {
    subpart_name: string,
    score: number,
    repair_plan: string[],
    losses: IMetaLoss[]
  }
  
  export interface IMetaLoss {
    type: string,
    score: number
  }

  export interface IVariantMetaLoss {
    rowKey?: string,
    part_image_id: string,
    detail_image_id: string,
    part_class: number,
    part_name: string,
    detail_rect: Rect,
    subpart_name: string,
    repair_plan: string[],
    type: string,
    score: number,
    imageRowSpan?: number,
    partRowSpan?: number,
    lossRowSpan?: number
  }
}

export interface IState {
  VIN: IVIN,
  status: {
    vin_detecting: boolean,
    vin_querying: boolean,
    checking: boolean
  },
  parts: PART.IParts,
  losses: LOSS.ILoss[]
}