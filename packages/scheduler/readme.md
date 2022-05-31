### Make instance

```typescript
import Scheduler from ''
const scheduler = new Scheduler()
```

### Create and get layer

```typescript
import Scheduler from ''
const scheduler = new Scheduler()
scheduler.createLayer('Layer1')
const layer1 = scheduler.getLayer('layer1')
scheduler.createLayer('Layer2')
const layer2 = scheduler.getLayer('layer2')
```

### Create record

```typescript
import Scheduler from ''
const scheduler = new Scheduler()
const layer = scheduler.createLayer('Layer')
layer.addRecord({
    callbackFunction:(arg1:number,arg2:number)=>{

    },
    params:[1,2]
})

layer.addBeforeRecord({
    callbackFunction:(arg1:number,arg2:number)=>{

    },
    params:[1,2]
})

layer.addAfterRecord({
    callbackFunction:(arg1:number,arg2:number)=>{

    },
    params:[1,2]
})
```

### Schedule

```typescript
import Scheduler from ''
const scheduler = new Scheduler()
scheduler.schedule()
```