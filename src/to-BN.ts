import BN from 'bn.js'
import { NumberLike, BigNumberLike } from './types'
import { TEN } from './constant'

import toFraction from './to-fraction'
import { Fraction } from './fraction'

function shakeFractionDecimal(n: Fraction): string {
  const [, sign = '', int = ''] = n.toFixed(2).match(/(-?)(\d*)\.?(\d*)/) ?? []
  return `${sign}${int}`
}

export default function toBN(
  n: NumberLike | undefined,
  decimal: BigNumberLike = 0
): BN | undefined {
  if (n == null) return undefined
  if (n instanceof BN) return n
  return new BN(
    shakeFractionDecimal(toFraction(n).mul(TEN.pow(new BN(String(decimal)))))
  )
}
