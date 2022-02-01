import Logger from '../logger'
import * as Slot from '../slot/slot'

export  class Component{
    constructor() {
        Logger.debug('Component base constructor',this)
        let slot = Slot.create({
            component:this
        })
        
    }
}