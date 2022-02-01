import {createLogger,setupConsoleLogger} from '@simler/logger'
const Logger = createLogger('@simler/simler-core')
setupConsoleLogger(Logger)
export default Logger