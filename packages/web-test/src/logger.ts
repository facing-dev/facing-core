import {createInfoLogger,setupConsoleLogger} from '@simler/logger'
let Logger = createInfoLogger('web-test')
setupConsoleLogger(Logger)
export default Logger