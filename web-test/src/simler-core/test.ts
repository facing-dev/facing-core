import Logger from '@/logger'
import { Simler, Component } from "@simler/simler-core"


import temp from './test.temp'

@Component({
    render: temp
})
export class TestComp extends Simler {
    constructor() {
        super()
        Logger.debug('TestComp constructor', this)
        setInterval(()=>{
            this.num++
            this.$render()
        },1000)

    }
    num = 8
  
}


// Logger.debug(TestComp)
// let ins = new TestComp()
// Logger.debug('ind', ins)