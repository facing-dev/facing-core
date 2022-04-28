import {createDebugLogger,setupConsoleLogger} from '@facing/logger/src/index'

export  function createLogger(name:string){
    const Logger = createDebugLogger(`web-test ~ ${name}`)
    setupConsoleLogger(Logger)
    return Logger
}