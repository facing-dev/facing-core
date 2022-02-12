import {Application} from '@simler/simler-core'
import { TestComp } from "./simler-core/test"
const rootEl = document.getElementById('root')!
const app = new Application()
app.mount(rootEl,TestComp)
