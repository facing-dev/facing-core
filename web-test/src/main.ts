import testScheduler from './scheduler/test'
import testObserver from './observer/test'
async function main(){
    await testScheduler()
    await testObserver()
}

main()

// import { Application } from '@facing/facing-core'
// import { TestComp } from "./facing-core/test"

// const rootEl = document.getElementById('root')!
// const app = new Application()
// app.mount(rootEl, TestComp)
