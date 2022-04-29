import { createLogger } from '@/logger'
import Counter from '@/counter'
import Scheduler from '@facing/scheduler/src/index'

export default async function () {
    const logger = createLogger('scheduler')
    const counter = new Counter(logger)
    const Sche = new Scheduler()

    Sche.createLayer('Layer1')



    const Layer1 = Sche.getLayer('Layer1')
    logger.assert(Layer1, '#1')

    Sche.createLayer('Layer2')
    const Layer2 = Sche.getLayer('Layer2')



    Sche.createLayer('Layer3')
    const Layer3 = Sche.getLayer('Layer3')

    Layer1!.addRecord({
        callbackFunction: (arg1: number, arg2: number) => {
            counter.grow()
            logger.assert(arg1 === 1, '#2')
            logger.assert(arg2 === 2, '#3')
        },
        params: [1, 2]
    })
    Layer1!.addRecord({
        callbackFunction: (arg1: number, arg2: number) => {
            counter.grow()
            logger.assert(arg1 === 3, '#4')
            logger.assert(arg2 === 4, '#5')
            setTimeout(() => {

                counter.assert(5, '#18')
            }, 0)
        },
        params: [3, 4]
    })


    Layer1!.addBeforeRecord({
        callbackFunction: (arg1: number, arg2: number) => {

            counter.assert(1, '#6')
            logger.assert(arg1 === 5, '#7')
            logger.assert(arg2 === 6, '#8')
        },
        params: [5, 6]
    })

    Layer1!.addAfterRecord({
        callbackFunction: (arg1: number, arg2: number) => {

            counter.assert(4, '#9')
            logger.assert(arg1 === 7, '#10')
            logger.assert(arg2 === 8, '#11')
        },
        params: [7, 8]
    })

    Layer2!.addRecord({
        callbackFunction: (arg1: number, arg2: number) => {

            counter.assert(6, '#12')
            logger.assert(arg1 === 9, '#13')
            logger.assert(arg2 === 10, '#14')
        },
        params: [9, 10]
    })

    Layer3!.addRecord({
        callbackFunction: (arg1: number, arg2: number) => {

            counter.assert(7, '#15')
            logger.assert(arg1 === 10, '#16')
            logger.assert(arg2 === 11, '#17')
        },
        params: [10, 11]
    })


    await Sche.schedule()

    counter.assert(8, '#19')

    await Sche.schedule()

    counter.assert(9, '#20')

}