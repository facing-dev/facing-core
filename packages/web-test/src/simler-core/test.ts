// // import Logger from '../logger'
import { Simler, Component } from "@simler/simler-core"


import temp from './test.temp'

@Component({
    render:temp
})
export class TestComp extends Simler{
    constructor(){
        super()
        // Logger.info('TestComp cons',this)
    }
}

let t = new TestComp()
export default {}