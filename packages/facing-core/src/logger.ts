import {createLogger,setupConsoleLogger} from '@facing/logger'
const Logger = createLogger('@facing/facing-core')
setupConsoleLogger(Logger)
export default Logger