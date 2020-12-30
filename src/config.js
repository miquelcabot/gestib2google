import * as configJson from './config.json'

const config = () => {
  return configJson[sessionStorage.getItem('domain')]
}

export {config}
