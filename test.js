import QUnit from 'qunit';
import run, { ENTER } from 'inquirer-test';
import path from 'path';
import { fileURLToPath } from 'url';

const { test } = QUnit;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cliPath = __dirname + '/index.js'

process.env.test = true;

test('selectEvent', async assert => {
  const result = await run([cliPath], ['CCH Junior Road Race', ENTER], 4000);
  assert.true(new RegExp('CCH Junior', 'g').test(result));
});

test('selectRace', async assert => {
  const result = await run([cliPath], ['CCH Junior Road Race', ENTER, ENTER], 8000);
  assert.true(new RegExp('Craig Adams', 'g').test(result));
});
