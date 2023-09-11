import BN from 'bn.js'
import _Big from 'big.js'

import { parseBigNumberLike } from './utils'
import { Fraction } from './fraction'
import { Rounding, TEN } from './constant'
import { BigNumberLike } from './types'
import toFormat from './to-format'

const Big = toFormat(_Big)

export function splitNumber(num: string, decimals: number) {
  let integral = '0'
  let fractional = '0'

  if (num.includes('.')) {
    const splited = num.split('.')
    if (splited.length === 2) {
      ;[integral, fractional] = splited
      fractional = fractional.padEnd(decimals, '0')
    } else {
      throw new Error('invalid number string')
    }
  } else {
    integral = num
  }

  return [integral, fractional.slice(0, decimals) || fractional]
}

export class AssetAmount extends Fraction {
  constructor(public readonly decimals: number, amount: BigNumberLike) {
    let parsedAmount = new BN(0)
    const multiplier = TEN.pow(new BN(decimals))

    let integralAmount = new BN(0)
    let fractionalAmount = new BN(0)

    // parse fractional string
    if (
      typeof amount === 'string' ||
      typeof amount === 'number' ||
      typeof amount === 'bigint'
    ) {
      const [integral, fractional] = splitNumber(amount.toString(), decimals)
      integralAmount = parseBigNumberLike(integral)
      fractionalAmount = parseBigNumberLike(fractional)
    }

    integralAmount = integralAmount.mul(multiplier)
    parsedAmount = integralAmount.add(fractionalAmount)

    super(parsedAmount, multiplier)
  }

  static fromChain(decimals: number, amount: BigNumberLike): AssetAmount {
    const fraction = new Fraction(amount, TEN.pow(new BN(decimals)))
    return new AssetAmount(decimals, fraction.toFixed(decimals))
  }

  public get raw() {
    return new Fraction(this.numerator, this.denominator)
  }

  public toNative(format: object = { groupSeparator: '' }): string {
    Big.DP = this.decimals
    return new Big(this.raw.toFixed(this.decimals)).toFormat(format)
  }

  public toBigNumber(): string {
    return this.numerator.toString()
  }

  // public isZero() {
  //   return this.raw.isZero()
  // }

  // /**
  //  * a greater than b
  //  */
  // public gt(other: AssetAmount) {
  //   return this.raw.gt(other.raw)
  // }

  /**
   * a less than b
   */
  public override lt(other: AssetAmount) {
    return this.raw.lt(other.raw)
  }

  public override eq(other: AssetAmount, precision = 8): boolean {
    return this.raw.eq(other, precision)
  }

  public override add(other: AssetAmount): AssetAmount {
    return new AssetAmount(
      this.decimals,
      this.raw.add(other.raw).toFixed(this.decimals)
    )
  }

  public addn(other: number): AssetAmount {
    const otherAmount = new AssetAmount(8, other.toFixed(8))
    return this.add(otherAmount)
  }

  public override mul(other: AssetAmount): AssetAmount {
    return new AssetAmount(
      this.decimals,
      this.raw
        .mul(other.raw)
        .toFixed(this.decimals, undefined, Rounding.ROUND_DOWN)
    )
  }

  public muln(other: number): AssetAmount {
    const otherAmount = new AssetAmount(8, other.toFixed(8))
    return this.mul(otherAmount)
  }

  public override sub(other: AssetAmount): AssetAmount {
    return new AssetAmount(
      this.decimals,
      this.raw.sub(other.raw).toFixed(this.decimals)
    )
  }

  public subn(other: number): AssetAmount {
    const otherAmount = new AssetAmount(8, other.toFixed(8))
    return this.sub(otherAmount)
  }

  public override div(other: AssetAmount): AssetAmount {
    return new AssetAmount(
      this.decimals,
      this.raw
        .div(other.raw)
        .toFixed(this.decimals, undefined, Rounding.ROUND_DOWN)
    )
  }

  public divn(other: AssetAmount): AssetAmount {
    const otherAmount = new AssetAmount(8, other.toFixed(8))
    return this.div(otherAmount)
  }

  public override toSignificant(
    significantDigits = this.decimals,
    format?: object,
    rounding: Rounding = Rounding.ROUND_DOWN
  ): string {
    return super.toSignificant(significantDigits, format, rounding)
  }

  /**
   * To fixed
   *
   * @example
   * ```
   * 1 -> 1.000000000
   * 1.234 -> 1.234000000
   * 1.123456789876543 -> 1.123456789
   * ```
   */
  public override toFixed(
    decimalPlaces = this.decimals,
    format?: object,
    rounding: Rounding = Rounding.ROUND_DOWN
  ): string {
    if (!(decimalPlaces <= this.decimals)) {
      throw new Error('')
    }

    return super.toFixed(decimalPlaces, format, rounding)
  }

  /**
   * To exact
   *
   * @example
   * ```
   * 1 -> 1
   * 1.234 -> 1.234
   * 1.123456789876543 -> 1.123456789
   * ```
   */
  public toExact(format: object = { groupSeparator: '' }): string {
    Big.DP = this.decimals
    return new Big(this.numerator.toString())
      .div(this.denominator.toString())
      .toFormat(format)
  }
}
