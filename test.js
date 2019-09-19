'use strict';

import test from 'ava';
import run, { UP, DOWN, ENTER } from 'inquirer-test';

const cliPath = __dirname + '/index.js'

process.env.test = true;

test('selectEvent', async t => {
  const result = await(run([cliPath], ['CCH Junior Road Race', ENTER], 4000));
  t.regex(result, new RegExp('CCH Junior', 'g'));
});

test('selectRace', async t => {
  const result = await(run([cliPath], ['CCH Junior Road Race', ENTER, ENTER], 8000));
  t.regex(result, new RegExp('Craig Adams', 'g'));
});
