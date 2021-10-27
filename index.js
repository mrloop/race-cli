#!/usr/bin/env node

import { selectEvent, ui } from './prompts.js';

ui.updateBottomBar('Events loading...');
selectEvent();
