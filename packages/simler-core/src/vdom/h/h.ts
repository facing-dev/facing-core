import type { Component } from '../../component/component'
import Logger from '../../logger'
export type Child = typeof Component | string | number | object | boolean
export type Key = string | number
export type ReferenceObject<T extends typeof Component> = {
    current: T | null
}
export function createReference<T extends typeof Component>(): ReferenceObject<T> {
    return {
        current: null
    }
}
export function h(
    target: Component | typeof Fragment | string,
    props: {
        children?: Child
    },
    key: string | number) {
    Logger.info('h function', ...arguments)
}

export const Fragment = Symbol('Simler/jsx-fragment')

