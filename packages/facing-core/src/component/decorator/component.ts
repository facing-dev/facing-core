import Logger from '../../logger'
import { Component as Comp } from "../component";
import { VNode } from '../../vdom/vnode/vnode'
import * as SlotPrototype from '../../slot/slotPrototype'

export function Component(opt: {
    render: () => VNode
}) {
    return function (cons: typeof Comp) {
        Logger.debug('Component decorator ', arguments)
        let slot = SlotPrototype.create(cons.prototype)
        slot._render = opt.render
    }
}
