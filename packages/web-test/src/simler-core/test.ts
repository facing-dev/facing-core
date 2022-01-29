import { Simler, Component } from '@simler-core/expose'
import temp from './test.temp'

@Component({
    render:temp
})
export class TestComp extends Simler{
    constructor(){
        super()
        console.log('TestComp cons',this)
    }
}

let t = new TestComp()