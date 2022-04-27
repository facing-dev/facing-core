import { createLogger } from '@/logger'
import Scheduler from '@facing/scheduler'

export default async function () {
    const Logger = createLogger('scheduler')
    const Sche = new Scheduler()

    Sche.createLayer('Layer1')

    let ite = 1

    const Layer1 = Sche.getLayer('Layer1')
    Logger.assert(Layer1, '#1')

    Sche.createLayer('Layer2')
    const Layer2 = Sche.getLayer('Layer2')



    Sche.createLayer('Layer3')
    const Layer3 = Sche.getLayer('Layer3')

    Layer1!.addRecord({
        callbackFunction: (arg1: number, arg2: number) => {
            ite++
            Logger.assert(arg1 === 1, '#2')
            Logger.assert(arg2 === 2, '#3')
        },
        params: [1, 2]
    })
    Layer1!.addRecord({
        callbackFunction: (arg1: number, arg2: number) => {
            ite++
            Logger.assert(arg1 === 3, '#4')
            Logger.assert(arg2 === 4, '#5')
            setTimeout(() => {
                ite++
                Logger.assert(ite === 6, '#18')
            }, 0)
        },
        params: [3, 4]
    })


    Layer1!.addBeforeRecord({
        callbackFunction: (arg1: number, arg2: number) => {
            ite++
            Logger.assert(ite === 2, '#6')
            Logger.assert(arg1 === 5, '#7')
            Logger.assert(arg2 === 6, '#8')
        },
        params: [5, 6]
    })

    Layer1!.addAfterRecord({
        callbackFunction: (arg1: number, arg2: number) => {
            ite++
            Logger.assert(ite === 5, '#9')
            Logger.assert(arg1 === 7, '#10')
            Logger.assert(arg2 === 8, '#11')
        },
        params: [7, 8]
    })

    Layer2!.addRecord({
        callbackFunction: (arg1: number, arg2: number) => {
            ite++
            Logger.assert(ite === 7, '#12')
            Logger.assert(arg1 === 9, '#13')
            Logger.assert(arg2 === 10, '#14')
        },
        params: [9, 10]
    })

    Layer3!.addRecord({
        callbackFunction: (arg1: number, arg2: number) => {
            ite++
            Logger.assert(ite === 8, '#15')
            Logger.assert(arg1 === 10, '#16')
            Logger.assert(arg2 === 11, '#17')
        },
        params: [10, 11]
    })


    await Sche.schedule()
    ite++
    Logger.assert(ite === 9, '#19')

    await Sche.schedule()
    ite++
    Logger.assert(ite === 10, '#20')

}