import { createWarnLogger,setupConsoleLogger } from '@facing/logger/src/index'
const Logger  =  createWarnLogger('@facing/observer')
setupConsoleLogger(Logger)
export default Logger