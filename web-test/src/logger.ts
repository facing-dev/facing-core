import {createLogger,setupConsoleLogger} from '@facing/logger'
const Logger = createLogger('web-test')
setupConsoleLogger(Logger)
export default Logger