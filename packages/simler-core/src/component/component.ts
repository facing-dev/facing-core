import * as Slot from '../slot/slot'
import { Application } from '../application'


export  class Component{
    constructor() {
        let slot = Slot.create({
            component:this
            // application:opt.application
        })
        console.log('Component cons',this)
    }
}





