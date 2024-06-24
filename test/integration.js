import { join } from 'path';
// WiP const path = require('path');
import { tests } from '@iobroker/testing';
// WiP const { tests } = require('@iobroker/testing');

// Run integration tests - See https://github.com/ioBroker/testing for a detailed explanation and further options
tests.integration(join(__dirname, '..'));
// WiP tests.integration(path.join(__dirname, '..'));