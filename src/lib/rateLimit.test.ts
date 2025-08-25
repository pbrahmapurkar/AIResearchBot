import { test } from 'node:test'
import assert from 'node:assert/strict'
// Import with extension so Node's test runner can locate the TypeScript module
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore allow direct .ts import in tests
import { consume } from './rateLimit.ts'

test('token bucket limits requests', async () => {
  const key = 'unit'
  for (let i = 0; i < 5; i++) {
    const ok = await consume(key)
    assert.equal(ok, true)
  }
  const blocked = await consume(key)
  assert.equal(blocked, false)
})
