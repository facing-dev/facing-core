import Logger from '../../logger'
import { Component as Comp } from "../component";

import * as SlotPrototype from '../../slot/slotPrototype'
type InstanceComponent = {
    new(prop?: any): Comp
}
export function Component(opt: {
    render: () => void
}) {

    return function (cons: InstanceComponent): InstanceComponent {
        Logger.debug('Component decorator ', arguments)
        let slot = SlotPrototype.create(cons.prototype)
        slot.render = opt.render
        return cons
    }
}
