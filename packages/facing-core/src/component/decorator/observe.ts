import { create as createPrototypeSlot } from '../../slot/slotPrototype'
import { } from '@facing/observer'
export function Observe(proto: any, name: string) {

    const slot = createPrototypeSlot(proto)

    slot.observedPropertyNames = slot.observedPropertyNames ?? new Set()
    slot.observedPropertyNames.add(name)
}