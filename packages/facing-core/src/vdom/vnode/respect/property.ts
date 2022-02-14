import * as CONSTANT from '../../h/constant'
import * as Utils from '../../utils'
// import type { VNodeElement,VNodeText } from '../vnode'
export type Properties = {
    [index: string]: string | false
}

export type RawProperties = {
    [index: string]: any//string | string[] | object | Function | boolean | number;
}

export function applyProperties(properties: Properties, el: HTMLElement) {
    for (let key in properties) {
        let value = properties[key]
        if (value === false) {
            el.removeAttribute(key)
        } else {
            el.setAttribute(key, value)
        }
    }
}

export function parseRawProperties(rawProps: RawProperties | null) {
    let props: Properties | null = null
    if (rawProps) {
        props = {}
        for (let key in rawProps) {
            let v = rawProps[key]
            if (v === false || typeof v === 'string') {
                props[key] = v
                continue;
            }
            if (typeof v === 'number') {
                props[key] = v.toString()
                continue
            }
            if (v === true) {
                props[key] = ''
                continue;
            }

            if (key === CONSTANT.H_KEY_CLASS && Utils.isArray(v)) {
                props[key] = v.join(' ')
                continue
            }
            if (key === CONSTANT.H_KEY_CLASS && Utils.isPlainObject(v)) {
                props[key] = Object.keys(v).filter(k => (v as any)[k] === true).join(' ')
                continue
            }
            if (key === CONSTANT.H_KEY_STYLE && Utils.isPlainObject(v)) {
                let str = '';
                for (let key in v) {
                    let val = v[key]
                    if (typeof val === 'string') {

                        //fooBar to foo-bar
                        key = key[0].toLowerCase() + key.slice(1).replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)
                        str += `${key}:${val};`
                    }
                }
                props[key] = str;
                continue
            }

            console.error(`${key}:${v}`)
            throw new Error(`In valid property`);
        }
    }
    return props
}

export function updateProperties(newProperties: Properties | null, oldProperties: Properties | null) {
    if (!newProperties && !oldProperties) {
        return null
    }
    let nProperties = newProperties ?? {}
    let oProperties = oldProperties ?? {}

    let props: Properties | null = null

    Object.keys(oProperties).forEach(oldKey => {
        if (oProperties[oldKey] === nProperties[oldKey]) {
            return
        }
        else {
            props = props ?? {}
            props[oldKey] = nProperties[oldKey]
        }
    })
    Object.keys(nProperties).forEach(newKey => {
        if (!(newKey in oProperties)) {
            props = props ?? {}
            props[newKey] = nProperties[newKey]
        }
    })

    return props
}