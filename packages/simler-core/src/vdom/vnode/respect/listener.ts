import { RawProperties } from './property'
import * as CONSTANT from '../../h/constant'
export type Listeners = Record<string, Function>
export function parseRawListeners(rawProps: RawProperties | null): {
    listeners: Listeners | null,
    rawProperties: RawProperties | null
} {
    let listeners: Listeners | null = null
    if (!rawProps) {
        return {
            listeners: listeners,
            rawProperties: rawProps
        }
    }
    for (let key in rawProps) {
        if (key.startsWith(CONSTANT.H_KEY_LISTENER_PREFIX)) {
            let name = key.slice(CONSTANT.H_KEY_LISTENER_PREFIX.length).toLowerCase()
            if (name) {
                let val = rawProps[key]
                delete rawProps[key]
                if (typeof val === 'function') {
                    listeners = listeners ?? {}
                    listeners[name] = val
                }
            }
        }
    }
    return {
        listeners,
        rawProperties: rawProps
    }
}
export type ListenersDiffer = Array<{
    name: string,
    listener: Function,
    type: 'ON' | 'OFF'
}>
export function applyListeners(listeners: ListenersDiffer, el: HTMLElement) {

    listeners.forEach(diff => {
        if (diff.type === 'ON') {
            el.addEventListener(diff.name, diff.listener as any)
            return
        }
        else if (diff.type === 'OFF') {
            el.removeEventListener(diff.name, diff.listener as any)
            return
        }
        throw ''
    })
}

export function updateListeners(newListeners: Listeners | null, oldListeners: Listeners | null): ListenersDiffer | null {
    if (!newListeners && !oldListeners) {
        return null
    }
    let nListeners = newListeners ?? {}
    let oListeners = oldListeners ?? {}
    let differ: ListenersDiffer | null = null
    Object.keys(oListeners).forEach(oldName => {
        if (nListeners[oldName] === oListeners[oldName]) {
            return
        }
        differ = differ ?? []
        if (!(oldName in nListeners)) {
            differ.push({
                type: 'OFF',
                name: oldName,
                listener: oListeners[oldName]
            })
        }
        differ.push({
            type: 'ON',
            name: oldName,
            listener: nListeners[oldName]
        })
    })
    Object.keys(nListeners).forEach(newName => {
        if (!(newName in oListeners)) {
            differ = differ ?? []
            differ.push({
                type: 'ON',
                name: newName,
                listener: nListeners[newName]
            })
        }
    })
    return differ
}