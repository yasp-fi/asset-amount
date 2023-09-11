import BN from 'bn.js'
import { BigNumberLike } from './types'
import { MAX_SAFE } from './constant'

export function parseBigNumberLike(value: BigNumberLike): BN {
  // BN
  if (value instanceof BN) {
    return value
  }

  // string
  if (typeof value === 'string') {
    if (value.match(/^-?[0-9]+$/)) {
      return new BN(value)
    }

    throw new Error('invalid BigNumberLike string')
  }

  // number
  if (typeof value === 'number') {
    if (value % 1) {
      throw new Error('BigNumberLike number underflow')
    }

    if (value >= MAX_SAFE || value <= -MAX_SAFE) {
      throw new Error('BigNumberLike number overflow')
    }

    return new BN(String(value))
  }

  // bigint
  if (typeof value === 'bigint') {
    return new BN(value.toString())
  }

  return value
}
