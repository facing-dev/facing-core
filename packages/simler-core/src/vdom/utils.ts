// // import { VNode } from './vnode/vnode'
// import { Component } from '../component/component'

// import { Reference } from './ref'
// import { REF_CURRENT } from './constant'
// export function isVNode(v: any): v is VNode {
//     if (typeof v === 'object' && v !== null && typeof v.type === 'string') {
//         return true
//     }
//     return false
// }
export function isPlainText(v: any): v is string {
    return typeof v === 'string'
}

export function isPlainObject(v: any): v is { [index: string]: any } {
    return typeof v === 'object' && v !== null && !Array.isArray(v)
}

export const isArray = Array.isArray

export function hasSameConstructor(o1: Object, o2: Object) {
    return o1.constructor === o2.constructor
}

// export function isComponentInstance(v: any): v is Component {
//     return v instanceof Component
// }

// export function isRefObject(v: any): v is Reference<any> {
//     return isPlainObject(v) && (REF_CURRENT in v)
// }