import { Logger } from '@facing/logger/src/index'
export default class Counter {
    constructor(public logger: Logger) {

    }
    count = 1
    assert(count: number, ...args: any[]) {
        this.assertNoGrow(count,...args)
        this.grow()
    }
    assertNoGrow(count: number, ...args: any[]){
        this.logger.assert(this.count === count, ...args)
    }
    grow(){
        this.count++
    }
}