import { join } from 'path';
// WiP const path = require('path');
import { tests } from '@iobroker/testing';
// WiP const { tests } = require('@iobroker/testing');

// Validate the package files
tests.packageFiles(join(__dirname, '..'));
// WiP tests.packageFiles(path.join(__dirname, '..'));