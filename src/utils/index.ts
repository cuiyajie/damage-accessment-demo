import EXIF = require('exif-js')

export async function getBase64(file: File): Promise<string> {
	const reader = new FileReader();
	return new Promise<string>((resolve) => {
		try {
			reader.readAsArrayBuffer(file);
			reader.addEventListener('load', (ev) => {
				const blob = new Blob([ev.target['result']]);
				window.URL = window.URL || window['webkitURL'];
				const blobURL = window.URL.createObjectURL(blob);
				const image = new Image();
				image.src = blobURL;
				image.addEventListener('load', () => {
					resolve(blobURL);
				});
			});
		} catch (e) {
			reader.addEventListener('load', function () {
				resolve(reader.result);
			});
			reader.readAsDataURL(file);
		}
	})
}

export function handleResize(canvas: HTMLCanvasElement, targetSize: number, name: string): Promise<File> {
  const { width: cw, height: ch } = canvas
  let canvas2: HTMLCanvasElement
  if (cw > targetSize || ch > targetSize) {
    const ratio = Math.min(targetSize / cw, targetSize / ch)
    canvas2 = document.createElement('canvas')
    canvas2.width = cw * ratio;
    canvas2.height = ch * ratio;
    const ctx2 = canvas2.getContext('2d')
    ctx2.drawImage(canvas, 0, 0, cw, ch, 0, 0, canvas2.width, canvas2.height);
  } else {
    canvas2 = canvas
  }
  return new Promise<File>((resolve, reject) => {
    canvas2.toBlob(blob => {
      const f: any = blob
      f.lastModifiedDate = new Date()
      f.name = name
      resolve(f as File)
    }, 'image/jpeg', .7)
  })
}

export const handleRotate = function(image: HTMLImageElement): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas');
  const { width: iw, height: ih } = image
  const size = Math.max(iw, ih)
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  ctx.drawImage(image, (size - iw) / 2, (size - ih) / 2);

  return new Promise<HTMLCanvasElement>((resolve, reject) => {
    // rotate
    EXIF.getData(image, () => {
      const orientation = EXIF.getTag(image, 'Orientation');
      let newW = iw, newH = ih;
      ctx.save();
      ctx.clearRect(0, 0, size, size)
      ctx.translate(size / 2, size / 2)
      switch(orientation) {
        case 6: 
          ctx.rotate(90 * Math.PI / 180);
          newW = ih;
          newH = iw;
          break;
        case 3:  
          ctx.rotate(Math.PI);
          break;
        case 8:
          ctx.rotate(-90 * Math.PI / 180);
          newW = ih;
          newH = iw;
          break;
        default:;
      }
      ctx.drawImage(image, -iw/2, -ih/2, iw, ih)
      ctx.restore()
      const canvas2 = document.createElement('canvas')
      canvas2.width = newW
      canvas2.height = newH
      const ctx2 = canvas2.getContext('2d')
      ctx2.drawImage(canvas, (size - newW) / 2, (size -newH) / 2, newW, newH, 0, 0, newW, newH);
      resolve(canvas2)
    })
  })
}

export const handleImage = async function handleImage(file: File, targetSize: number): Promise<File> {
  //handle origin image
  const image = new Image()
  image.src = await getBase64(file)
  return new Promise<File>((resolve, reject) => {
    image.addEventListener('load', async () => {
      resolve(await handleResize(await handleRotate(image), 4000, file.name))
    })
  })
}


export class CustomError extends Error {
	
	type: string = ''

	constructor(type: string, reason: string) {
		super(reason)
    this.type = type
	}
}