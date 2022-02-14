// import { Component, InstanceComponentConstructor } from '../../component/component'
import { Component } from '../../component/component'
import { Reference } from './../ref'
import { RawProperties, Properties, parseRawProperties, applyProperties, updateProperties } from './respect/property'
import { Listeners, parseRawListeners, updateListeners, applyListeners } from './respect/listener'
import { hasSameConstructor } from '../utils'
import { get as getSlot } from '../../slot/slot'

interface VNodeHooks<VNode> {
    create: () => void
    update: (newVNode: VNode) => void
    destroy: () => void
}

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
    // constructor(opt: VNodeHTMLBaseConstructorOptions<HTMLNodeType>) {
    //     // this.htmlNode = opt.htmlNode
    // }
    // protected create() {

    // }
    // update(newVNode: VNodeHTMLBase<HTMLNodeType>) {
    //     // if(newVNode)
    //     // if (oldVNode === null) {
    //     //     this.create()
    //     // }
    //     // else {
    //     //     this.htmlNode = oldVNode.htmlNode
    //     // }
    // }
    // destroy() {

    // }
}

interface VNodeTextConstructorOptions extends VNodeHTMLBaseConstructorOptions<Text> {
    text: string
}

export class VNodeText extends VNodeHTMLBase<Text> implements VNodeTextConstructorOptions, VNodeHooks<VNodeText> {
    text: string;
    constructor(opt: VNodeTextConstructorOptions) {
        super()
        this.text = opt.text
    }
    create() {
        this.htmlNode = document.createTextNode(this.text)
    }
    update(newVNode: VNodeText) {
        if (!couldUpdateVNode(this, newVNode)) {
            throw ''
        }
        if (this.text !== newVNode.text) {
            this.text = newVNode.text
            this.htmlNode.nodeValue = this.text
        }
    }
    destroy() {
        // super.destroy()
    }
}

interface VNodeElementRootConstructorOptions {
    htmlElement: HTMLElement
    componentVNode: VNodeComponent
}

export class VNodeElementRoot implements VNodeElementRootConstructorOptions {
    htmlElement: HTMLElement
    componentVNode: VNodeComponent
    constructor(opt: VNodeElementRootConstructorOptions) {
        this.htmlElement = opt.htmlElement
        this.componentVNode = opt.componentVNode
    }
    mount() {
        this.htmlElement.innerHTML = ''
        this.componentVNode.create()

        if (!this.componentVNode.elementVNode) {
            throw ''
        }
        this.htmlElement.appendChild(this.componentVNode.elementVNode?.htmlNode)
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

export class VNodeElement extends VNodeHTMLBase<HTMLElement> implements VNodeElementBaseConstructorOptions, VNodeHooks<VNodeElement> {
    tag: string
    rawProperties: RawProperties | null
    properties: Properties | null
    key: Key
    children: VNode[] | null = null
    reference: Reference<any> | null
    listeners: Listeners | null
    componentVNode: VNodeComponent | null
    constructor(opt: VNodeElementBaseConstructorOptions) {
        super()
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
            this.children.forEach(child => {
                child.create()
                this.htmlNode.appendChild(child.htmlNode)
            })
        }
    }
    applyReference() {
        if (this.reference) {
            this.reference.current = this.htmlNode
        }
    }
    update(newVNode: VNodeElement) {
        if (!couldUpdateVNode(this, newVNode)) {
            throw ''
        }
        {
            let ret = updateListeners(newVNode.listeners, this.listeners)
            if (ret) {
                applyListeners(ret, this.htmlNode)
            }
        }
        {
            let props = updateProperties(newVNode.properties, this.properties)
            if (props) {
                applyProperties(props, this.htmlNode)
            }
        }
        this.applyReference()
        if (!this.children && !newVNode.children) {
            return
        }
        const oldChildren = this.children ?? []
        const newChildren = newVNode.children ?? []
        let nextChildren: VNode[] | null = null
        let i = 0
        for (; i < oldChildren.length; i++) {
            const oldChild = oldChildren[i]
            if (i < newChildren.length) {
                const newChild = newChildren[i]
                if (couldUpdateVNode(oldChild, newChild)) {
                    oldChild.update(newChild as any)
                    nextChildren = nextChildren ?? []
                    nextChildren.push(oldChild)
                } else {
                    oldChild.destroy()
                    newChild.create()
                    this.htmlNode.replaceChild(newChild.htmlNode, oldChild.htmlNode)
                    nextChildren = nextChildren ?? []
                    nextChildren.push(newChild)
                }
            } else {
                oldChild.destroy()
                this.htmlNode.removeChild(oldChild.htmlNode)
            }
        }
        for (; i < newChildren.length; i++) {
            const newChild = newChildren[i]
            newChild.create()
            this.htmlNode.appendChild(newChild.htmlNode)
            nextChildren = nextChildren ?? []
            nextChildren.push(newChild)
        }
        if (nextChildren) {
            this.children = nextChildren
        }
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
        // super.destroy()
    }
}

// interface VNodeComponentReferenceConstructorOptions {
//     componentConstructor: InstanceComponentConstructor
//     properties: RawProperties | null
//     key: Key
//     componentVNode:VNodeComponent
// }
// export class VNodeComponentReference implements VNodeComponentReferenceConstructorOptions {
//     componentConstructor: InstanceComponentConstructor
//     properties: RawProperties | null
//     key: Key
//     componentVNode:VNodeComponent
//     constructor(opt: VNodeComponentReferenceConstructorOptions) {
//         this.componentConstructor = opt.componentConstructor
//         this.properties = opt.properties
//         this.key = opt.key
//         this.componentVNode=opt.componentVNode
//     }
//     destroy(){
//         const slot = getSlot(this.componentVNode.component)
//         if(!slot){
//             throw ''
//         }
//         slot.destroy()
//     }
// }

interface VNodeComponentConstructorOptions {
    componentConstructor:typeof Component// InstanceComponentConstructor
    // component: Component
    rawProperties: RawProperties | null
    key: Key
    // reference: Reference<any> | null
    // elementVNode: VNodeElement | null
}
export class VNodeComponent implements VNodeComponentConstructorOptions, VNodeHooks<VNodeComponent> {
    componentConstructor:typeof Component// InstanceComponentConstructor
    #component: Component | null = null
    set component(comp: Component) {
        this.#component = comp
    }
    get component() {
        if (!this.#component) {
            throw ''
        }
        return this.#component
    }
    rawProperties: RawProperties | null
    key: Key
    // reference: Reference<any> | null
    #elementVNode: VNodeElement | null = null
    set elementVNode(vnode: VNodeElement) {
        this.#elementVNode = vnode
    }
    get elementVNode() {
        if (!this.#elementVNode) {
            throw ''
        }
        return this.#elementVNode
    }
    parentVNode: VNode | VNodeElementRoot | null = null
    get htmlNode() {
        if (!this.elementVNode) {
            throw ''
        }
        return this.elementVNode.htmlNode
    }
    constructor(opt: VNodeComponentConstructorOptions) {
        this.componentConstructor = opt.componentConstructor
        // this.component = opt.component
        this.rawProperties = opt.rawProperties
        this.key = opt.key

    }

    create() {
        const ins = new this.componentConstructor()
        this.component = ins
        const slot = getSlot(ins)
        if (!slot) {
            throw ''
        }
        slot.vnode = this
        const vnodeElement = slot.render()
        vnodeElement.create()
        this.elementVNode = vnodeElement

    }
    update(newVNode: VNodeComponent) {
        if (!couldUpdateVNode(this, newVNode)) {
            throw ''
        }
    }
    updateVNodeElement(newVNode: VNodeElement) {
        if (!couldUpdateVNode(this.elementVNode, newVNode)) {
            throw ''
        }
        this.elementVNode.update(newVNode)
    }
    destroy(): void {
        if (this.elementVNode) {
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

export type VNode = VNodeElement | VNodeComponent | VNodeText //| VNodeComponentReference

export function isVNode(v: any): v is VNode {
    return v instanceof VNodeElement || v instanceof VNodeComponent || v instanceof VNodeText
}

export function couldUpdateVNode(oldVNode: VNode, newVNode: VNode): boolean {
    if (Object.getPrototypeOf(oldVNode) !== Object.getPrototypeOf(newVNode)) {
        return false
    }
    if (oldVNode instanceof VNodeText && newVNode instanceof VNodeText) {
        return true
    }
    if (oldVNode instanceof VNodeElement && newVNode instanceof VNodeElement) {
        if (oldVNode.tag !== newVNode.tag) {
            return false
        }
        if (oldVNode.key !== newVNode.key) {
            return false
        }

        return true
    }
    if (oldVNode instanceof VNodeComponent && newVNode instanceof VNodeComponent) {
        if (oldVNode.componentConstructor !== newVNode.componentConstructor) {
            return false
        }
        if (oldVNode.key !== newVNode.key) {
            return false
        }
        return true
    }
    return false
}