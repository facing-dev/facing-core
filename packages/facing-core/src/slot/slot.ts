import Logger from '../logger'
import { Component } from '../component/component'
import { VNode, VNodeComponent } from '../vdom/vnode/vnode'
import { getNotNull as getPrototypeSlot } from './slotPrototype'
import type { Application } from '../'
import { Record as ObserverRecord, ObserverRefrenceAgent } from '@facing/observer'
import { Record as SchedulerRecord } from '@facing/scheduler'
const FacingSymbol = Symbol('Facing/Facing')
export class Slot {
    component: SlotComponent
    observerReferenceAgents: ObserverRefrenceAgent<any>[] | null = null
    schedulerRenderRecord: SchedulerRecord
    init(opt: {
        application: Application
        vnode: VNodeComponent
    }) {
        if (this.#application) {
            throw ''
        }
        this.application = opt.application
        this.vnode = opt.vnode
        const prototypeSlot = getPrototypeSlot(this.component)
        if (prototypeSlot.observedPropertyNames) {
            const record = new ObserverRecord()
            record.watchers.push(() => {
                this.application.schedulerLayerRender.records.add(this.schedulerRenderRecord)
                this.application.scheduler.schedule()
            })
            prototypeSlot.observedPropertyNames.forEach((name) => {
                const agent = this.application.observer.observe((this.component as any)[name], {
                    record: record
                });
                (this.component as any)[name] = agent.object;
                this.observerReferenceAgents = this.observerReferenceAgents ?? []
                this.observerReferenceAgents.push(agent)
            })
        }
    }
    #vnode: VNodeComponent | null = null
    set vnode(vnode: VNodeComponent) {
        this.#vnode = vnode
    }
    get vnode() {
        if (!this.#vnode) {
            throw ''
        }
        return this.#vnode
    }
    #application: Application | null = null
    get application() {
        if (!this.#application) {
            throw ''
        }
        return this.#application
    }
    set application(application: Application) {
        this.#application = application
    }
    // boundComponentRender: Function
    constructor(opt: {
        component: SlotComponent
    }) {
        Logger.debug('Slot constructor', opt, this)
        this.component = opt.component

        this.schedulerRenderRecord = {
            callbackFunction: this.component.$render.bind(this.component),
            params: null
        }
 

    }
    render() {
        const prototypeSlot = getPrototypeSlot(this.component)
        const vnode = prototypeSlot.render(this.component)
        return vnode
    }
    destroy() {
        if (this.observerReferenceAgents) {
            this.observerReferenceAgents.forEach(agent => agent.release())
        }
    }

}

type SlotComponent = Component & {
    [FacingSymbol]?: Slot
}

export function create(opt: ConstructorParameters<typeof Slot>[0]) {

    if (!get(opt.component)) {
        Object.defineProperty(opt.component, FacingSymbol, {
            enumerable: false,
            value: new Slot(opt)
        })
    }
    return get(opt.component)!
}

export function get(comp: SlotComponent) {
    return comp[FacingSymbol] ?? null
}

export function getNotNull(comp: SlotComponent) {
    const slot = get(comp)
    if (!slot) {
        throw 'component\'s slot is null'
    }
    return slot
}


