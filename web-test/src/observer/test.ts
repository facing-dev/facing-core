import { createLogger } from '../logger'
import Counter from '@/counter'
import { Observer, Record } from '@facing/observer/src/index'

export default async function () {
    const logger = createLogger('observer')




    let observer = new Observer();
    // (function () {
    //     const counter = new Counter(logger)
    //     function watcher(pobj: any) {
    //         switch (counter.count) {
    //             case 1:
    //                 logger.assert(pobj === obj)
    //                 logger.assert(pobj.length === 1)
    //                 logger.assert(pobj[0].z === 1)
    //                 break;
    //             case 2:
    //                 logger.assert(pobj.length === 2)
    //                 break;

    //             case 3:
    //                 logger.assert(pobj.length === 3)
    //                 break;
    //             case 4:
    //                 logger.assert(typeof pobj[0].s === 'object')
    //                 break;
    //             case 5:
    //                 logger.assert(pobj[0].s.f === 123)
    //                 break;
    //             case 6:
    //                 logger.assert(pobj.length === 6)
    //                 pobj[4].z = 2
    //                 break;
    //             case 7:

    //                 logger.assert(pobj[4].z === 2)
    //                 break;
    //             case 8:
    //                 logger.assert(pobj[0].s === undefined)
    //                 break;
    //         }
    //         counter.grow()
    //     }
    //     let record = new Record(watcher)
    //     let obj: any[] = []
    //     let agent = observer.observe(obj, {
    //         record
    //     });
    //     obj = (window as any).p = agent.object


    //     obj.push({ z: 1 })
    //     obj.push({})
    //     obj.push({})
    //     obj[0].s = {}
    //     obj[0].s.f = 123
    //     obj.push({}, {}, {})
    //     logger.assert(obj[4].z === 2)
    //     logger.assert(counter.count === 8)
    //     delete obj[0].s
    // })();

    // (function () {
    //     const counter = new Counter(logger)
    //     let obj1: any = {}
    //     obj1 = observer.observe(obj1, {
    //         record: new Record(function (obj: any) {
    //             logger.assert(obj1 === obj)
    //             switch (counter.count) {
    //                 case 1:

    //                     logger.assert(Array.isArray(obj.children), obj)
    //                     break;
    //                 case 2:
    //                     logger.assert(Array.isArray(obj.children), 1)
    //                     logger.assert(obj.children.length === 2, 1)
    //                     break;
    //                 case 4:
    //                     logger.assert(obj1_1.child1 === obj1_1_1)
    //                     break;
    //                 case 6:
    //                     logger.assert(obj1_1.child2 === obj1_1_2)
    //                     break;
    //             }
    //             counter.grow()
    //         })
    //     }).object

    //     let obj1_1: any = {}
    //     obj1_1 = observer.observe(obj1_1, {
    //         record: new Record(function (obj: any) {
    //             logger.assert(obj1_1 === obj)
    //             switch (counter.count) {
    //                 case 3:
    //                     logger.assert(obj1_1.child1 === obj1_1_1)
    //                     break;
    //                 case 5:
    //                     logger.assert(obj1_1.child2 === obj1_1_2)
    //                     break;

    //             }
    //             counter.grow()
    //         })
    //     }).object

    //     let obj1_2: any = {}
    //     obj1_2 = observer.observe(obj1_2, {
    //         record: new Record(function (obj: any) {

    //         })
    //     }).object

    //     let obj1_1_1: any = {}
    //     obj1_1_1 = observer.observe(obj1_1_1, {
    //         record: new Record(function (obj: any) {

    //         })
    //     }).object

    //     let obj1_1_2: any = {}
    //     obj1_1_2 = observer.observe(obj1_1_2, {
    //         record: new Record(function (obj: any) {

    //         })
    //     }).object

    //     obj1.children = [obj1_1]//1

    //     obj1.children.push(obj1_2)//2
    //     obj1_1.child1 = obj1_1_1 //3,4
    //     obj1_1.child2 = obj1_1_2//5,6

    // })();

    (function () {
        let observer = new Observer();
        observer.slotReleasedTestCallback = function (slot) {
            console.log('r', slot)
        };
        (window as any).obs = observer;
        const counter = new Counter(logger)
        let obj1: any = { tag: 'root' }
        obj1 = observer.observe(obj1, {
            record: new Record(function (obj: any) {

                logger.assert(obj1 === obj)
                switch (counter.count) {
                    case 1:
                        break;

                }
                counter.grow()
            })
        }).object

        let obj1_1: any = { tag: 'obj1_1' }
        obj1_1 = observer.observe(obj1_1, {
            record: new Record(function (obj: any) {

                logger.assert(obj1_1 === obj)
                switch (counter.count) {
                    case 1:
                        break;

                }
                counter.grow()
            })
        }).object

        let obj1_1_1: any = {tag:'1_1_1'}
        obj1_1_1 = observer.observe(obj1_1_1, {
            record: new Record(function (obj: any) {

                logger.assert(obj1_1_1 === obj)
                switch (counter.count) {
                    case 1:
                        break;

                }
                counter.grow()
            })
        }).object

        obj1.child = {
            tag: 1,
            child: {
                tag: 2,
                child: obj1_1
            }
        }
        obj1_1.children = []
        obj1_1.children.push([
            obj1_1_1
        ])

        counter.assertNoGrow(6)
        obj1.child.chil2 = obj1_1
        obj1.child.chil3 = obj1_1
        delete obj1.child

        // obja
        // objb
        // obja.a = objb
        // obja.b = objb
        // fix reference count


        // counter.assertNoGrow(7)
        // obj1_1.children.pop()
        // counter.assertNoGrow(9)
        // obj1_1.children.push([
        //     obj1_1_1
        // ])
        // counter.assertNoGrow(11)

    })();


    /*
        (function () {
            const counter = new Counter(logger)
            let obj1: any = {}
            obj1 = observer.observe(obj1, {
                record: new Record(function (obj: any) {
                    logger.assert(obj1 === obj)
                    switch (counter.count) {
                        case 1:
                            break;
    
                    }
                    counter.grow()
                })
            }).object
        })();
        */

}
