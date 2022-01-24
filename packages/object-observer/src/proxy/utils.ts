import { ObservableTypes, get as getSlot, Slot, isObservableType } from '../Slot'
export function eachOf(obj: ObservableTypes, ite: (obj: any) => void) {
    Object.values(obj).forEach(v => ite(v))
}

export function scheduleObserved(obj: ObservableTypes) {
    let slot = getSlot(obj)
    if (!slot) {
        console.error(obj)
        throw 'Can not schedule unobserved object'
    }
    function step(slot: Slot) {
        slot.records.forEach(function (record) {
            record.watchers.forEach(function (watcher) {
                watcher(obj)
            })

        })
        slot.slotReferences.forEach(function (ref) {
            step(ref.slot)
        })
    }
    step(slot)
}