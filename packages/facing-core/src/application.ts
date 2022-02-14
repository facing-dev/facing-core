import { Component } from './component/component'
import { VNode, VNodeComponent, VNodeElement, VNodeElementRoot } from './vdom/vnode/vnode'
// import { process as processVNodeTree } from './vdom/vnode/process'
import { get as getSlot } from './slot/slot'
export class Application {
    #vnode: VNodeComponent | null = null
    mount(el: HTMLElement, componentConstructor: typeof Component) {
        const vnode = new VNodeComponent({
            rawProperties: null,
            componentConstructor: componentConstructor,
            key: null
        })
        const rootVNode = new VNodeElementRoot({
            htmlElement: el,
            componentVNode: vnode
        })
        vnode.parentVNode=rootVNode

        rootVNode.mount()


        // rootVNode.children=[vnode]
        // rootVNode.update(rootVNode)
        // const v = processVNodeTree(null, vnode)
        // if (v !== vnode || !vnode.elementVNode) {
        //     throw ''
        // }
        // el.innerHTML = ''
        // el.appendChild(vnode.elementVNode.htmlNode)
    }
}