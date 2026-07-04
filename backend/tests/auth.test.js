const test = require('node:test');
const assert = require('node:assert/strict');
const { hashPassword, comparePassword, generateToken } = require('../utils/auth');

test('hashPassword creates a hash and comparePassword verifies it', async () => {
  const password = 'super-secret';
  const hashed = await hashPassword(password);

  assert.notEqual(hashed, password);
  assert.equal(typeof hashed, 'string');
  assert.equal(hashed.length > 0, true);
  assert.equal(await comparePassword(password, hashed), true);
  assert.equal(await comparePassword('wrong', hashed), false);
});

test('generateToken includes the user id and expires in a human-readable form', () => {
  const token = generateToken('user-123');

  assert.equal(typeof token, 'string');
  assert.equal(token.length > 0, true);
  assert.equal(token.startsWith('eyJ'), true);
});
