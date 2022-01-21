import { ObservableTypes, get as getSlot, isObservableType } from '../Slot'
export function scheduleObserved(obj: ObservableTypes) {
    let slot = getSlot(obj)
    if (!slot) {
        console.error(obj)
        throw 'Can not schedule unobserved object'
    }
    slot.recordReferences.forEach(function (recordRef) {
        if (recordRef.refCount <= 0) {
            console.error(obj, recordRef)
            throw 'recordRef.refCount <= 0'
        }
        recordRef.record.watchers.forEach(function (watcher) {
            watcher(obj)
        })
    })
}