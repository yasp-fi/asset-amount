import BN from 'bn.js'

enum Rounding {
  ROUND_DOWN,
  ROUND_HALF_UP,
  ROUND_UP,
}

enum Compare {
  LESS = -1,
  EQUAL = 0,
  GREATER = 1,
}

const MAX_SAFE = 0x1fffffffffffff
const ZERO = new BN(0)
const ONE = new BN(1)
const TWO = new BN(2)
const THREE = new BN(3)
const FIVE = new BN(5)
const TEN = new BN(10)
const _100 = new BN(100)
const _1000 = new BN(1000)
const _10000 = new BN(10000)

export {
  Rounding,
  ZERO,
  ONE,
  TWO,
  THREE,
  FIVE,
  TEN,
  _100,
  _1000,
  _10000,
  MAX_SAFE,
  Compare,
}
