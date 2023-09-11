import { NumberLike } from './types'

import toBN from './to-BN'
import toFraction from './to-fraction'
import { ZERO } from './constant'

export function lt(
  a: NumberLike | undefined,
  b: NumberLike | undefined
): boolean {
  if (a == null || b == null) return false
  const fa = toFraction(a)
  const fb = toFraction(b)
  return toBN(fa.sub(fb).numerator)!.lt(ZERO)
}

export function gt(
  a: NumberLike | undefined,
  b: NumberLike | undefined
): boolean {
  if (a == null || b == null) return false
  const fa = toFraction(a)
  const fb = toFraction(b)
  return toBN(fa.sub(fb).numerator)!.gt(ZERO)
}

export function lte(
  a: NumberLike | undefined,
  b: NumberLike | undefined
): boolean {
  if (a == null || b == null) return false
  const fa = toFraction(a)
  const fb = toFraction(b)
  return toBN(fa.sub(fb).numerator)!.lte(ZERO)
}

export function gte(
  a: NumberLike | undefined,
  b: NumberLike | undefined
): boolean {
  if (a == null || b == null) return false
  const fa = toFraction(a)
  const fb = toFraction(b)
  return toBN(fa.sub(fb).numerator)!.gte(ZERO)
}

export function eq(
  a: NumberLike | undefined,
  b: NumberLike | undefined
): boolean {
  if (a == null || b == null) return false
  const fa = toFraction(a)
  const fb = toFraction(b)
  return toBN(fa.sub(fb).numerator)!.eq(ZERO)
}

export function isMeaningfulNumber(n: NumberLike | undefined): n is NumberLike {
  if (n == null) return false
  return !eq(n, 0)
}

export function isMeaninglessNumber(
  n: NumberLike | undefined
): n is NumberLike {
  if (n == null) return true
  return eq(n, 0)
}

export default function compare(
  mode:
    | 'lt'
    | 'gt'
    | 'lte'
    | 'gte'
    | 'eq'
    | 'lessThan'
    | 'greatThan'
    | 'lessThanEqual'
    | 'greatThanEqual'
    | 'equal',
  a: NumberLike,
  b: NumberLike
): boolean {
  switch (mode) {
    case 'lessThan':
    case 'lt':
      return lt(a, b)

    case 'greatThan':
    case 'gt':
      return gt(a, b)

    case 'lessThanEqual':
    case 'lte':
      return lte(a, b)

    case 'greatThanEqual':
    case 'gte':
      return gte(a, b)

    case 'equal':
    case 'eq':
      return eq(a, b)
  }
}
