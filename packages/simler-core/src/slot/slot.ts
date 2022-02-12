import Logger from '../logger'
import { Component } from '../component/component'
import { VNode, VNodeComponent } from '../vdom/vnode/vnode'
import { get as getPrototypeSlot } from './slotPrototype'

// import { updateVNode } from '../vdom/vnode/vnode'
const SimlerSymbol = Symbol('Simler/Simler')

export class Slot {
    component: SlotComponent
    #vnode: VNodeComponent|null=null
    set vnode(vnode:VNodeComponent){
        this.#vnode=vnode
    }
    get vnode(){
        if(!this.#vnode){
            throw ''
        }
        return this.#vnode
    }
    // parent: VNodeComponent | HTMLElement|null = null // HTMLElement for application root component
    constructor(opt: {
        component: SlotComponent
    }) {
        Logger.debug('Slot constructor', opt, this)
        this.component = opt.component
        // this.vnode = new VNodeComponent({
        //     component: this.component,
        // })
    }
    render() {
        const prototypeSlot = getPrototypeSlot(this.component)
        if (!prototypeSlot) {
            throw ''
        }
        const vnode = prototypeSlot.render(this.component)
        return vnode
        // if (!this.vnode.elementVNode) {//new vnode, first render
        //     this.vnode.elementVNode = vnode
        //     vnode.create()
        // } else {
        //     if (updateVNode(this.vnode.elementVNode, vnode)) {//update
        //         this.vnode.elementVNode.update(vnode)
        //     } else {//replace
        //         vnode.create()
        //         if (this.parent) {
        //             if(this.parent instanceof VNodeComponent){//render parent component to replace this
        //                 const parentSlot = get(this.parent.component)
        //                 if (!parentSlot) {
        //                     throw ''
        //                 }
        //                 parentSlot.render()
        //             }else{//this is root component, replace html directly
        //                 this.parent.innerHTML=''
        //                 this.parent.append(vnode.htmlNode)
        //             }
                  
        //         } else {
        //             throw ''
        //         }
        //     }
        // }
    }
    destroy() {
        // this.vnode.destroy()
    }

}

type SlotComponent = Component & {
    [SimlerSymbol]?: Slot
}

export function create(opt: ConstructorParameters<typeof Slot>[0]) {

    if (!get(opt.component)) {
        Object.defineProperty(opt.component, SimlerSymbol, {
            enumerable: false,
            value: new Slot(opt)
        })
    }
    return get(opt.component)!
}

export function get(comp: SlotComponent) {
    return comp[SimlerSymbol] ?? null
}

export function getNotNull(comp:SlotComponent){
    const slot = get(comp)
    if(!slot){
        throw 'component\'s slot is null'
    }
    return slot
}


