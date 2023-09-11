import BN from 'bn.js'
import { Fraction } from './fraction'

export type NumberLike = number | string | bigint | Fraction | BN
export type BigNumberLike = BN | string | number | bigint
