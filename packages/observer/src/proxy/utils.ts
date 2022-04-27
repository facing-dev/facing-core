import Logger from '../logger'
import { ObservableTypes, get as getSlot, Slot, isObservableType } from '../slot'
export function eachOf(obj: ObservableTypes, ite: (obj: any) => void) {
    Object.values(obj).forEach(v => ite(v))
}

export function scheduleObserved(obj: ObservableTypes) {
    let slot = getSlot(obj)
    if (!slot) {
        Logger.error(obj)
        throw 'Can not schedule unobserved object'
    }
    if(slot.bundleCalledSymbol && slot.bundleCalledSymbol===slot.currentCalledSymbol){
        //Break when object scheduled, custom scope
        return
    }
    const calledSymbol = slot.bundleCalledSymbol ?? Symbol('Facing/Observer.Called')

    function step(slot: Slot) {
        if(calledSymbol === slot.currentCalledSymbol){
            //Break when slot scheduled, setter scope
            return
        }
        slot.currentCalledSymbol = calledSymbol

        for (const agent of slot.objectObserverRefrenceAgentIterator) {
            agent.records.forEach((record) => {
                record.watchers.forEach(function (watcher) {
                    watcher(obj)
                })
            })
        }
        for (const sr of slot.slotReferenceIterator) {
            step(sr.slot)
        }
    }
    step(slot)
}