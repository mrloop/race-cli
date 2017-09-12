#!/usr/bin/env node

const { selectEvent, ui } = require('./prompts');

ui.updateBottomBar('Events loading...');
selectEvent();
