import {createLogger,setupConsoleLogger} from '@simler/logger'
const Logger = createLogger('web-test')
setupConsoleLogger(Logger)
export default Logger