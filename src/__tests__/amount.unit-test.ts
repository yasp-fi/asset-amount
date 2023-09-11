import { AssetAmount } from '../amount'

type AmountTestCase = {
  amount: string | number
  rawAmount: string
}

const testCases: AmountTestCase[] = [
  {
    amount: '10.12',
    rawAmount: '10',
  },
]

test.each(testCases)('testing conversions', async ({ amount, rawAmount }) => {
  const assetAmountRaw = new AssetAmount(9, rawAmount)
  const assetAmount = new AssetAmount(9, amount)

  console.info(assetAmountRaw.toExact())
  console.info(assetAmount.toExact())

  console.info(assetAmount.toNative())
  console.info(assetAmountRaw.toNative())
})
