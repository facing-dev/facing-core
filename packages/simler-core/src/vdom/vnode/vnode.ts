import { Component } from '../../component/component'
import { Reference } from './../ref'
import { RawProperties, Properties, parseRawProperties, applyProperties, updateProperties } from './respect/property'
import { Listeners, parseRawListeners, updateListeners, applyListeners } from './respect/listener'
import { hasSameConstructor } from '../utils'
interface VNodeHTMLBaseConstructorOptions<HTMLNodeType extends Node> {
    // htmlNode: HTMLNodeType
}
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
    key: string | null
    children: VNode[] | null
    reference: Reference<any> | null
    componentVNode: VNodeComponent | null
}

export class VNodeElement extends VNodeHTMLBase<HTMLElement> implements VNodeElementBaseConstructorOptions {
    tag: string
    rawProperties: RawProperties | null
    properties: Properties | null
    key: string | null
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

interface VNodeComponentConstructorOptions {
    component: Component
    elementVNode: VNodeElement
}

export class VNodeComponent implements VNodeComponentConstructorOptions {
    component: Component
    elementVNode: VNodeElement
    constructor(opt: VNodeComponentConstructorOptions) {
        this.component = opt.component
        this.elementVNode = opt.elementVNode
    }
    create(){

    }
    update(){
        
    }
    destroy(): void {
        this.elementVNode.destroy()
    }
}


export type VNode = VNodeElement | VNodeComponent | VNodeText
