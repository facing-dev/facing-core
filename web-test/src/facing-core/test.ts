import Logger from './logger'
import { Facing, Component, Observe } from "@facing/facing-core"


import temp from './test.temp'

@Component({
    render: temp
})
export class TestComp extends Facing {
    @Observe
    data = {
        num: 8
    }
    constructor() {
        super()
        Logger.debug('TestComp constructor', this)
        setInterval(() => {
            this.data.num++
        }, 1000)
    }
}


// Logger.debug(TestComp)
// let ins = new TestComp()
// Logger.debug('ind', ins)