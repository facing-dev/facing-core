import { Component,isComponentConstructor } from '../../component/component'
import Logger from '../../logger'
import { VNode, VNodeComponent, VNodeElement, VNodeText, isVNode,Key } from '../vnode/vnode'
import { Reference } from './../ref'
export type Child = VNode | string | number | object | boolean

export type ReferenceObject<T extends typeof Component> = {
    current: T | null
}
export function createReference<T extends typeof Component>(): ReferenceObject<T> {
    return {
        current: null
    }
}
export function h(
    target: Function | typeof Fragment | string,
    props: {
        children?: Child | Child[]
        ref?:Reference<any>
    },
    key: string | number) {
    Logger.debug('h', ...arguments)
    let childNodes: VNode[] | null = null;
    if (props.children) {
        function processChild(child:any){
            childNodes = childNodes ?? []
            if (isVNode(child)) {
                childNodes.push(child)
                return
            }
            if (typeof child === 'string') {
                childNodes.push(new VNodeText({
                    text: child
                }))
                return
            }
            if (typeof child === 'number' || typeof child === 'bigint' || typeof child === 'boolean') {
                childNodes.push(new VNodeText({
                    text: String(child)
                }))
                return
            }
            childNodes.push(new VNodeText({
                text: JSON.stringify(child)
            }))
        }
        (Array.isArray(props.children) ? props.children : [props.children]).forEach(child => {
           if(Array.isArray(child)){
               child.forEach(child=>processChild(child))
               return
           }
           processChild(child)
        })
        delete props.children
    }
    let reference:Reference<any>|null=null
    if(props.ref && props.ref instanceof Reference){
        reference = props.ref
        delete props.ref
    }

    if(target===Fragment){
        return new VNodeText({
            text:'==Fragment=='
        })
    }
    
    if(typeof target==='string'){
        return new VNodeElement({
            tag:target,
            key:key??null,
            rawProperties:props,
            children:childNodes??null,
            reference:reference,
            componentVNode:null
        })
    }

    if(typeof target === 'function' && isComponentConstructor(target)){
        return new VNodeComponent({
            componentConstructor:target,
            key:key,
            rawProperties:props
        })
    }

    throw ''

}

export const Fragment = Symbol('Facing/jsx-fragment')

