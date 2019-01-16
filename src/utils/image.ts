import { getBase64 } from "../utils";
import { getImageUrl } from "../utils/request";

export interface ImageID {
  image_id: string
}

export class DImage {

  imageType: string = null

  image: File | ImageID | string = null

  isImageID(): boolean {
    return this.imageType === 'image_id' && this.image && !!(this.image as ImageID).image_id
  }

  isFile(): boolean {
    return this.imageType === 'blob' && this.image && !!(this.image as Blob).size
  }

  source: string = null

  constructor(image: File | ImageID | string) {
    if (image instanceof File || image instanceof Blob) {
      this.imageType = 'blob'
    } else if (image && (<ImageID>image).image_id) {
      this.imageType = 'image_id'
    } else {
      this.imageType = 'string'
    }
    this.image = image
  }

  async getSource() {
    if (this.imageType === 'blob') {
      return await getBase64(this.image as File)
    } else if (this.imageType === 'image_id') {
      return getImageUrl((<ImageID>this.image).image_id)
    } else {
      return this.image as string
    }
  }

  async syncSource(): Promise<DImage> {
    this.source = await this.getSource()
    return this
  }

  getName(): string {
    if (this.imageType === 'blob') {
      return (this.image as File).name
    } else if (this.imageType === 'image_id') {
      return (this.image as ImageID).image_id
    } else {
      const url = this.image as string
      return url.slice(url.lastIndexOf('/') + 1);
    }
  }

  async getMeta(): Promise<{ source: string, width: number, height: number }> {
    const source = await this.getSource()
    const cImage = new Image()
    cImage.src = source
    return new Promise<{ source: string, width: number, height: number }>((resolve, reject) => {
      cImage.addEventListener('load', () => {
        resolve({ source, width: cImage.width, height: cImage.height })
      })
    })
  }

  async load() {
    const source = await this.getSource()
    const cImage = new Image()
    cImage.src = source
    return new Promise<DImage>((resolve, reject) => {
      cImage.addEventListener('load', () => {
        resolve(this)
      })
      cImage.addEventListener('error', (err) => {
        reject('加载图片失败')
      })
    })
  }
}