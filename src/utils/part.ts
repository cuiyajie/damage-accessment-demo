import { enumPartClass } from './constants';

const displayCarParts = []

for(let key in enumPartClass) {
  const val = enumPartClass[key]
  if ((val > 0 && val < 25) || (val > 28 && val < 33) || (val > 39 && val < 42)) {
    displayCarParts.push(key)
  }
}

export default displayCarParts