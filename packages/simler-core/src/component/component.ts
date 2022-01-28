import * as Slot from '../slot/slot'
import {Application} from '../application'
export class Component {
    constructor(opt:{
        application:Application
    }) {
        let slot = Slot.create({
            component:this,
            application:opt.application
        })
    }
}
