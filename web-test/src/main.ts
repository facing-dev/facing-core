import { Application } from '@facing/facing-core'
import { TestComp } from "./facing-core/test"

const rootEl = document.getElementById('root')!
const app = new Application()
app.mount(rootEl, TestComp)
