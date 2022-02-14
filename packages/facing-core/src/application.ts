import { Component } from './component/component'
import { VNode, VNodeComponent, VNodeElement, VNodeElementRoot } from './vdom/vnode/vnode'
import Scheduler from '@facing/scheduler'
import {Observer} from '@facing/observer'
// import { process as processVNodeTree } from './vdom/vnode/process'
const SchedulerLayerKey_NextTick = "NextTick"
const SchedulerLayerKey_Render = "Render"
import { get as getSlot } from './slot/slot'
export class Application {
    vnode: VNodeElementRoot | null = null
    scheduler: Scheduler
    observer: Observer
    get schedulerLayerNextTick() {
        const layer = this.scheduler.getLayer(SchedulerLayerKey_NextTick)
        if (!layer) {
            throw ''
        }
        return layer
    }
    get schedulerLayerRender(){
        const layer = this.scheduler.getLayer(SchedulerLayerKey_Render)
        if (!layer) {
            throw ''
        }
        return layer
    }
    constructor() {
        const scheduler = this.scheduler = new Scheduler()
        scheduler.createLayer(SchedulerLayerKey_NextTick)
        scheduler.createLayer(SchedulerLayerKey_Render)
        const observer = this.observer = new Observer()

    }
    mount(el: HTMLElement, componentConstructor: typeof Component) {
        const vnode = new VNodeComponent({
            rawProperties: null,
            componentConstructor: componentConstructor,
            key: null,

        })
        const rootVNode = new VNodeElementRoot({
            htmlElement: el,
            componentVNode: vnode,

        })
        vnode.parentVNode = rootVNode
        this.vnode = rootVNode
        rootVNode.mount(this)
    }
}