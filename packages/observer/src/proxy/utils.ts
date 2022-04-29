import Logger from '../logger'
import { ObservableTypes, get as getSlot, Slot, isObservableType } from '../slot'
import type { Observer,SchedulerBundleTask } from '../observer'
export function eachOf(obj: ObservableTypes, ite: (obj: any) => void) {
    Object.values(obj).forEach(v => ite(v))
}

export function scheduleObserved(obj: ObservableTypes,task:SchedulerBundleTask) {
    let slot = getSlot(obj)
    if (!slot) {
        Logger.error(obj)
        throw 'Can not schedule unobserved object'
    }
    function step(slot: Slot) {

        

        for (const agent of slot.objectObserverRefrenceAgentIterator) {
            task.changedAgents.add(agent)
         
        }
        const parentSlots = slot.parentSlots
        if (parentSlots) {
            for (const slot of parentSlots) {
                step(slot)
            }
        }

    }
    step(slot)
}