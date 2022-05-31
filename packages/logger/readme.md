### Create instance

```typescript
import {Level,
Logger,
createWarnLogger,
createDebugLogger,
createInfoLogger,
createErrorLogger,
createAssertLogger} from ''
const logger = new Logger(Level.DEBUG,'prefix text')
const WarnLogger = createWarnLogger('prefix text')
const DebugLogger = createDebugLogger('prefix text')
const InfoLogger = createInfoLogger('prefix text')
const ErrorLogger = createErrorLogger('prefix text')
const AssertLogger = createAssertLogger('prefix text')
```

### Setup console logger

```typescript
import {createDebugLogger,setupConsoleLogger} from ''
const Logger = createDebugLogger('prefix text')
setupConsoleLogger(Logger)
```

### Log

```typescript
import {createDebugLogger,setupConsoleLogger} from ''
const Logger = createDebugLogger('prefix text')
setupConsoleLogger(Logger)
Logger.debug('')
Logger.warn('')
Logger.error('')
Logger.info('')
Logger.trace('')
Logger.assert('')
```