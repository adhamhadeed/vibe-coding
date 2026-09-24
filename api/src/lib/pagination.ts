export type Pagination = {
  limit: number
  offset: number
}

export class PaginationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'PaginationError'
  }
}

const DEFAULT_LIMIT = 20
const MAX_LIMIT = 100

function parseOptionalInt(value: unknown, field: 'limit' | 'offset'): number | undefined {
  if (value === undefined) {
    return undefined
  }

  if (typeof value !== 'string' && typeof value !== 'number') {
    throw new PaginationError(`${field} must be a single integer.`)
  }

  const raw = typeof value === 'number' ? String(value) : value.trim()

  if (raw === '') {
    return undefined
  }

  if (!/^-?\d+$/.test(raw)) {
    throw new PaginationError(`${field} must be an integer.`)
  }

  return Number(raw)
}

export function parsePagination(limitValue: unknown, offsetValue: unknown): Pagination {
  const limit = parseOptionalInt(limitValue, 'limit') ?? DEFAULT_LIMIT
  const offset = parseOptionalInt(offsetValue, 'offset') ?? 0

  if (limit < 1 || limit > MAX_LIMIT) {
    throw new PaginationError(`limit must be between 1 and ${MAX_LIMIT}.`)
  }

  if (offset < 0) {
    throw new PaginationError('offset must be 0 or greater.')
  }

  return { limit, offset }
}
