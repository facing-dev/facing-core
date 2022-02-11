import { Component } from './component/component'
import { VNode, VNodeComponent } from './vdom/vnode/vnode'
import {get as getSlot} from './slot/slot'
export class Application {
    #vnode: VNodeComponent | null = null
    mount(el: HTMLElement, componentConstructor: typeof Component) {
        const ins = new componentConstructor()
        const slot = getSlot(ins)
        if(!slot){
            throw ''
        }
        slot.parent=el
        slot.render()
    }
}