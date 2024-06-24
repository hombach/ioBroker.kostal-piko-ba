import { join } from 'path';
// WiP const path = require('path');
import { tests } from '@iobroker/testing';
// WiP const { tests } = require('@iobroker/testing');

// Run unit tests - See https://github.com/ioBroker/testing for a detailed explanation and further options
tests.unit(join(__dirname, '..'));
// WiP tests.unit(path.join(__dirname, '..'));