import { DateRangeError, parseDateRange } from './dateRange'

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message)
  }
}

function assertThrows(fn: () => void, message: string) {
  try {
    fn()
  } catch (error) {
    assert(error instanceof DateRangeError, `${message} (wrong error type)`)
    return
  }

  throw new Error(message)
}

assert(parseDateRange(undefined, undefined) === null, 'omitted params should be all-time')
assert(parseDateRange('', '') === null, 'empty strings should be all-time')

const range = parseDateRange('2026-09-01T00:00:00.000Z', '2026-09-10T00:00:00.000Z')
assert(range !== null, 'valid range should parse')
assert(range?.from.toISOString() === '2026-09-01T00:00:00.000Z', 'from should parse')
assert(range?.to.toISOString() === '2026-09-10T00:00:00.000Z', 'to should parse')

assertThrows(
  () => parseDateRange('2026-09-01T00:00:00.000Z', undefined),
  'missing to should throw',
)
assertThrows(
  () => parseDateRange(undefined, '2026-09-10T00:00:00.000Z'),
  'missing from should throw',
)
assertThrows(
  () => parseDateRange('not-a-date', '2026-09-10T00:00:00.000Z'),
  'invalid from should throw',
)
assertThrows(
  () => parseDateRange('2026-09-10T00:00:00.000Z', '2026-09-01T00:00:00.000Z'),
  'from > to should throw',
)
assertThrows(
  () => parseDateRange(['2026-09-01'], '2026-09-10T00:00:00.000Z'),
  'array from should throw',
)

console.log('dateRange checks passed')
