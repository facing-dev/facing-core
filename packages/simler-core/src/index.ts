
export { Component as Simler } from './component/component'
export { Component } from './component/decorator/component'


import type { Key, ReferenceObject } from './vdom/h/h'
import type {Component} from './component/component'

declare global {
  namespace JSX {

    interface IntrinsicElements {
      [elem: string]: {
        [prop: string]: any
        key?: Key
      }
    }
    interface IntrinsicAttributes {
      key?: Key
    }
    interface IntrinsicClassAttributes<T extends typeof Component> {
      ref: ReferenceObject<T>
    }
  }
}
