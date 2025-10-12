const path = require("path");
const { tests } = require("@iobroker/testing");

// Run tests
tests.packageFiles(path.join(__dirname, ".."));
//                 ~~~~~~~~~~~~~~~~~~~~~~~~~
// This should be the adapter's root directory
