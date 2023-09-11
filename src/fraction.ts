import BN from 'bn.js'
import _Big from 'big.js'
import _Decimal from 'decimal.js-light'

import type { BigNumberLike } from './types'
import { parseBigNumberLike } from './utils'
import toFormat from './to-format'
import { ONE, Rounding, Compare } from './constant'

const Big = toFormat(_Big)

const Decimal = toFormat(_Decimal)

const toSignificantRounding = {
  [Rounding.ROUND_DOWN]: Decimal.ROUND_DOWN,
  [Rounding.ROUND_HALF_UP]: Decimal.ROUND_HALF_UP,
  [Rounding.ROUND_UP]: Decimal.ROUND_UP,
}

const toFixedRounding = {
  [Rounding.ROUND_DOWN]: Big.roundDown,
  [Rounding.ROUND_HALF_UP]: Big.roundHalfUp,
  [Rounding.ROUND_UP]: Big.roundUp,
}

export class Fraction {
  public readonly numerator: BN
  public readonly denominator: BN

  constructor(numerator: BigNumberLike, denominator: BigNumberLike = ONE) {
    this.numerator = parseBigNumberLike(numerator)
    this.denominator = parseBigNumberLike(denominator)
  }

  // performs floor division
  public get quotient() {
    return this.numerator.div(this.denominator)
  }

  public invert(): Fraction {
    return new Fraction(this.denominator, this.numerator)
  }

  public isNeg(): boolean {
    const isNegNumerator = this.numerator.isNeg()
    const isNegDenominator = this.denominator.isNeg()
    return isNegNumerator ? !isNegDenominator : isNegDenominator
  }

  public abs(): Fraction {
    return this.isNeg() ? this.mul('-1') : this
  }

  // ==
  public eq(other: Fraction | BigNumberLike, precision = 8): boolean {
    const otherParsed =
      other instanceof Fraction
        ? other
        : new Fraction(parseBigNumberLike(other))

    const diff = this.sub(otherParsed).abs()
    const percisionAmount = new Fraction(
      new BN(1),
      new BN(10).pow(new BN(precision))
    )
    return diff.lt(percisionAmount)
  }

  // <
  public lt(other: Fraction | BigNumberLike): boolean {
    const otherParsed =
      other instanceof Fraction
        ? other
        : new Fraction(parseBigNumberLike(other))

    const diff = this.sub(otherParsed)
    return diff.isNeg()
  }

  // +
  public add(other: Fraction | BigNumberLike): Fraction {
    const otherParsed =
      other instanceof Fraction
        ? other
        : new Fraction(parseBigNumberLike(other))

    if (this.denominator.eq(otherParsed.denominator)) {
      return new Fraction(
        this.numerator.add(otherParsed.numerator),
        this.denominator
      )
    }

    return new Fraction(
      this.numerator
        .mul(otherParsed.denominator)
        .add(otherParsed.numerator.mul(this.denominator)),
      this.denominator.mul(otherParsed.denominator)
    )
  }

  // -
  public sub(other: Fraction | BigNumberLike): Fraction {
    const otherParsed =
      other instanceof Fraction
        ? other
        : new Fraction(parseBigNumberLike(other))

    if (this.denominator.eq(otherParsed.denominator)) {
      return new Fraction(
        this.numerator.sub(otherParsed.numerator),
        this.denominator
      )
    }

    return new Fraction(
      this.numerator
        .mul(otherParsed.denominator)
        .sub(otherParsed.numerator.mul(this.denominator)),
      this.denominator.mul(otherParsed.denominator)
    )
  }

  // ×
  public mul(other: Fraction | BigNumberLike) {
    const otherParsed =
      other instanceof Fraction
        ? other
        : new Fraction(parseBigNumberLike(other))

    return new Fraction(
      this.numerator.mul(otherParsed.numerator),
      this.denominator.mul(otherParsed.denominator)
    )
  }

  // ÷
  public div(other: Fraction | BigNumberLike) {
    const otherParsed =
      other instanceof Fraction
        ? other
        : new Fraction(parseBigNumberLike(other))

    return new Fraction(
      this.numerator.mul(otherParsed.denominator),
      this.denominator.mul(otherParsed.numerator)
    )
  }

  public toSignificant(
    significantDigits: number,
    format: object = { groupSeparator: '' },
    rounding: Rounding = Rounding.ROUND_HALF_UP
  ): string {
    Decimal.set({
      precision: significantDigits + 1,
      rounding: toSignificantRounding[rounding],
    })
    const quotient = new Decimal(this.numerator.toString())
      .div(this.denominator.toString())
      .toSignificantDigits(significantDigits)
    return quotient.toFormat(quotient.decimalPlaces(), format)
  }

  public toFixed(
    decimalPlaces: number,
    format: object = { groupSeparator: '' },
    rounding: Rounding = Rounding.ROUND_HALF_UP
  ): string {
    Big.DP = decimalPlaces
    // Big.RM = toFixedRounding[rounding]
    return new Big(this.numerator.toString())
      .div(this.denominator.toString())
      .toFormat(decimalPlaces, format)
  }
}
