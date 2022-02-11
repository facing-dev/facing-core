import { Component, InstanceComponentConstructor } from '../../component/component'
import { Reference } from './../ref'
import { RawProperties, Properties, parseRawProperties, applyProperties, updateProperties } from './respect/property'
import { Listeners, parseRawListeners, updateListeners, applyListeners } from './respect/listener'
import { hasSameConstructor } from '../utils'
import {get as getSlot} from '../../slot/slot'
interface VNodeHTMLBaseConstructorOptions<HTMLNodeType extends Node> {
    // htmlNode: HTMLNodeType
}
export type Key = string | number | symbol | null
export class VNodeHTMLBase<HTMLNodeType extends Node> implements VNodeHTMLBaseConstructorOptions<HTMLNodeType>{
    private _htmlNode: HTMLNodeType | null = null
    set htmlNode(htmlNode: HTMLNodeType) {
        this._htmlNode = htmlNode
    }
    get htmlNode() {
        if (this._htmlNode === null) {
            throw 'htmlNode is null'
        }
        return this._htmlNode
    }
    constructor(opt: VNodeHTMLBaseConstructorOptions<HTMLNodeType>) {
        // this.htmlNode = opt.htmlNode
    }
    protected create() {

    }
    update(oldVNode: VNodeHTMLBase<HTMLNodeType>) {
        if (oldVNode === null) {
            this.create()
        }
        else {
            this.htmlNode = oldVNode.htmlNode
        }
    }
    destroy() {

    }
}

interface VNodeTextConstructorOptions extends VNodeHTMLBaseConstructorOptions<Text> {
    text: string
}

export class VNodeText extends VNodeHTMLBase<Text> implements VNodeTextConstructorOptions {
    text: string;
    constructor(opt: VNodeTextConstructorOptions) {
        super(opt)
        this.text = opt.text
    }
    create() {
        super.create()
        this.htmlNode = document.createTextNode(this.text)
    }
    update(oldVNode: VNodeText) {
        super.update(oldVNode)
        if (this.text !== oldVNode.text) {
            this.htmlNode.nodeValue = this.text
        }
    }
    destroy() {
        super.destroy()
    }
}

interface VNodeElementBaseConstructorOptions extends VNodeHTMLBaseConstructorOptions<HTMLElement> {
    tag: string
    rawProperties: RawProperties | null
    key: Key
    children: VNode[] | null
    reference: Reference<any> | null
    componentVNode: VNodeComponent | null
}

export class VNodeElement extends VNodeHTMLBase<HTMLElement> implements VNodeElementBaseConstructorOptions {
    tag: string
    rawProperties: RawProperties | null
    properties: Properties | null
    key: Key
    children: VNode[] | null = null
    reference: Reference<any> | null
    listeners: Listeners | null
    componentVNode: VNodeComponent | null
    constructor(opt: VNodeElementBaseConstructorOptions) {
        super(opt)
        this.componentVNode = opt.componentVNode
        this.tag = opt.tag
        this.rawProperties = opt.rawProperties
        {
            let ret = parseRawListeners(this.rawProperties)
            this.rawProperties = ret.rawProperties
            this.listeners = ret.listeners
        }
        this.properties = parseRawProperties(this.rawProperties)
        this.key = opt.key
        this.children = opt.children
        this.reference = opt.reference
    }
    create() {
        this.htmlNode = document.createElement(this.tag)
        {
            let ret = updateListeners(this.listeners, null)
            if (ret) {
                applyListeners(ret, this.htmlNode)
            }
        }
        if (this.properties) {
            applyProperties(this.properties, this.htmlNode)
        }
        this.applyReference()
        if (this.children) {

        }
    }
    applyReference() {
        if (this.reference) {
            this.reference.current = this.htmlNode
        }
    }
    update(oldVNode: VNodeElement) {
        {
            let ret = updateListeners(this.listeners, oldVNode.listeners)
            if (ret) {
                applyListeners(ret, this.htmlNode)
            }
        }
        {
            let props = updateProperties(this.properties, oldVNode.properties)
            if (props) {
                applyProperties(props, this.htmlNode)
            }
        }
        this.applyReference()
    }
    destroy(): void {
        if (this.children) {
            this.children.forEach(child => child.destroy())
        }
        {
            let ret = updateListeners(null, this.listeners)
            if (ret) {
                applyListeners(ret, this.htmlNode)
            }
        }
        super.destroy()
    }
}

interface VNodeComponentReferenceConstructorOptions {
    componentConstructor: InstanceComponentConstructor
    properties: RawProperties | null
    key: Key
    componentVNode:VNodeComponent
}
export class VNodeComponentReference implements VNodeComponentReferenceConstructorOptions {
    componentConstructor: InstanceComponentConstructor
    properties: RawProperties | null
    key: Key
    componentVNode:VNodeComponent
    constructor(opt: VNodeComponentReferenceConstructorOptions) {
        this.componentConstructor = opt.componentConstructor
        this.properties = opt.properties
        this.key = opt.key
        this.componentVNode=opt.componentVNode
    }
    destroy(){
        const slot = getSlot(this.componentVNode.component)
        if(!slot){
            throw ''
        }
        slot.destroy()
    }
}

interface VNodeComponentConstructorOptions {
    component: Component
    // elementVNode: VNodeElement | null
}
export class VNodeComponent implements VNodeComponentConstructorOptions {

    component: Component
    elementVNode: VNodeElement | null = null

    constructor(opt: VNodeComponentConstructorOptions) {
        this.component = opt.component
    }

    create() {

    }
    update(oldVNode: VNodeComponent) {

    }
    destroy(): void {
        if( this.elementVNode){
            this.elementVNode.destroy()
        }
       
    }
}

// export function initVNodeComponent(opt: {
//     parentEl: HTMLElement,
//     replaceEl?: HTMLElement,
//     vnode: VNodeComponent
// }) {
//     const parentEl = opt.parentEl
//     const replaceEl = opt.replaceEl
//     if (replaceEl) {
//         if (replaceEl.parentNode !== parentEl) {
//             throw ''
//         }
//     }
//     const vNode = opt.vnode
//     vNode.create()
//     if (!vNode.elementVNode) {
//         throw ''
//     }
//     if (replaceEl) {
//         parentEl.replaceChild(vNode.elementVNode.htmlNode, replaceEl)
//     } else {
//         parentEl.appendChild(vNode.elementVNode.htmlNode)
//     }


// }

export type VNode = VNodeElement | VNodeComponent | VNodeText | VNodeComponentReference

export function isVNode(v: any): v is VNode {
    return v instanceof VNodeElement || v instanceof VNodeComponent || v instanceof VNodeText
}

export function updateVNode(oldVNode: VNode, newVNode: VNode): boolean {
    if (Object.getPrototypeOf(oldVNode) !== Object.getPrototypeOf(newVNode)) {
        return false
    }
    if (oldVNode instanceof VNodeText && newVNode instanceof VNodeText) {
        oldVNode.update(newVNode)
        return true
    }
    if (oldVNode instanceof VNodeElement && newVNode instanceof VNodeElement) {
        if (oldVNode.tag !== newVNode.tag) {
            return false
        }
        if (oldVNode.key !== newVNode.key) {
            return false
        }
        oldVNode.update(newVNode)
        return true
    }
    if (oldVNode instanceof VNodeComponentReference && newVNode instanceof VNodeComponentReference) {
        if (oldVNode.componentConstructor !== newVNode.componentConstructor) {
            return false
        }
        if (oldVNode.key !== newVNode.key) {
            return false
        }
        return true
    }
    if (oldVNode instanceof VNodeComponent || newVNode instanceof VNodeComponent) {
        throw ''
    }

    return true
}