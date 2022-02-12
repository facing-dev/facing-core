import Logger from '../../logger'
import { Component as Comp, InstanceComponentConstructor } from "../component";
import { VNode } from '../../vdom/vnode/vnode'
import * as SlotPrototype from '../../slot/slotPrototype'

export function Component(opt: {
    render: () => VNode
}) {
    return function (cons: InstanceComponentConstructor) {
        Logger.debug('Component decorator ', arguments)
        let slot = SlotPrototype.create(cons.prototype)
        slot._render = opt.render
        // return cons
    }
}
