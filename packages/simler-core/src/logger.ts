import {createWarnLogger,setupConsoleLogger} from '@simler/logger'
const Logger = createWarnLogger('@simler/simler-core')
setupConsoleLogger(Logger)
export default Logger