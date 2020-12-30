import * as configJson from './config.json'

const config = () => {
  const config = configJson[sessionStorage.getItem('domain')]
  config.domain = sessionStorage.getItem('domain')
  return config
}

export {config}
