### Create instance

```typescript
import {Observer} from ''
const Observer = new Observer()
```

### Observe an object

```typescript 
import {Observer, Record, ObserverRefrenceAgent} from ''
const Observer = new Observer()
let obj = {}
const agent:ObserverRefrenceAgent = Observer.observe(obj,{
    record:new Record(function(objRef){

    })
})
```

### Get observed object by agent
```typescript
import {Observer, Record, ObserverRefrenceAgent} from ''
const Observer = new Observer()
let obj = {}
const agent:ObserverRefrenceAgent = Observer.observe(obj,{})

const observedObject = agent.object
```


### Manage agent record
```typescript
import {Observer, Record, ObserverRefrenceAgent} from ''
const Observer = new Observer()
let obj = {}
const agent:ObserverRefrenceAgent = Observer.observe(obj,{})

const record = new Record{
    record:new Record(function(objRef){
    })
)

agent.removeRecord(record)

```

### Release agent

```typescript
import {Observer, Record, ObserverRefrenceAgent} from ''
const Observer = new Observer()
let obj = {}
const agent:ObserverRefrenceAgent = Observer.observe(obj,{})

agent.release()
```