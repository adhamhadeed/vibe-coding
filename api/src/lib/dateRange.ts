export type ParsedDateRange = {
  from: Date
  to: Date
}

export class DateRangeError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'DateRangeError'
  }
}

function asSingleString(value: unknown, field: 'from' | 'to'): string | undefined {
  if (value === undefined) {
    return undefined
  }

  if (typeof value === 'string') {
    const trimmed = value.trim()
    return trimmed === '' ? undefined : trimmed
  }

  throw new DateRangeError(`${field} must be a single ISO 8601 date.`)
}

function parseIsoDate(value: string, field: 'from' | 'to'): Date {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    throw new DateRangeError(`${field} must be a valid ISO 8601 date.`)
  }

  return date
}

export function parseDateRange(
  fromValue: unknown,
  toValue: unknown,
): ParsedDateRange | null {
  const from = asSingleString(fromValue, 'from')
  const to = asSingleString(toValue, 'to')

  if (!from && !to) {
    return null
  }

  if (!from || !to) {
    throw new DateRangeError('Both from and to are required when filtering by date.')
  }

  const fromDate = parseIsoDate(from, 'from')
  const toDate = parseIsoDate(to, 'to')

  if (fromDate > toDate) {
    throw new DateRangeError('from must be before or equal to to.')
  }

  return { from: fromDate, to: toDate }
}
