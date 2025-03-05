![Logo](admin/picoba.png)

# ioBroker.kostal-piko-ba

## Versions

![Beta](https://img.shields.io/npm/v/iobroker.kostal-piko-ba.svg?color=red&label=beta)
![Stable](https://iobroker.live/badges/kostal-piko-ba-stable.svg)
![Installed](https://iobroker.live/badges/kostal-piko-ba-installed.svg)

[![NPM](https://nodei.co/npm/iobroker.kostal-piko-ba.png?downloads=true)](https://nodei.co/npm/iobroker.kostal-piko-ba/)

## Adapter for reading Kostal Piko & Piko BA data for iOBroker

Adapter for reading Kostal Piko, Piko BA and PIKO MP plus data. Adapter creates some states and updates them sequentially.

## Changelog - OLD CHANGES

### 5.0.0 (2024-12-07)

- (HombachC) BREAKING: dropped support for ioBroker.admin < 7.0.0 because of ioBroker Responsive Design Initiative (#699)
- (HombachC) switch to i18n translation (#736)
- (HombachC) optimize responsive design (#699)
- (HombachC) dependency updates

### 4.2.3 (2024-10-20)

- (HombachC) optimize responsive design (#699)
- (HombachC) dependency updates

### 4.2.2 (2024-09-30)

- (HombachC) add more Sentry triggered error handling
- (HombachC) code optimization
- (HombachC) update adapter core
- (HombachC) dependency updates

### 4.2.1 (2024-09-17)

- (HombachC) add node.js 22 to the adapter testing (#666)
- (HombachC) update ioBroker testing
- (HombachC) dependency updates

### 4.2.0 (2024-08-29)

- (HombachC) convert adapter to TypeScript
- (HombachC) switch to ES2022 code
- (HombachC) migrate eslint to >9.x
- (HombachC) repository cleanup
- (HombachC) dependency updates
- (HombachC) code optimizations

### 4.1.3 (2024-08-13)

- (HombachC) fixed vulnerability in dependency

### 4.1.2 (2024-08-10)

- (HombachC) optimized translation handling
- (HombachC) hide not used configuration inputs

### 4.1.1 (2024-08-09)

- (HombachC) adapter checker detected optimizations (#643)

### 4.1.0 (2024-08-05)

- (HombachC) replaced deprecated ioBroker state calls
- (HombachC) doku cleanup

### 4.0.2 (2024-08-04)

- (HombachC) added node.js 22 tests
- (HombachC) dependency updates

### 4.0.1 (2024-06-24)

- (HombachC) dependency updates, removed unfunctional snyk tests

### 4.0.0 (2024-04-21)

- (HombachC) BREAKING: Dropped support for Node.js 16 (#591)
- (HombachC) BREAKING: Minimum needed js-controller bumped to 5 (#592)
- (HombachC) changed timeout settings for older Kostal inverters (#589)
- (HombachC) dependency updates
- (HombachC) added tests for node.js 21
- (HombachC) raised minimum poll time for daily statistics
- (HombachC) code optimizations

### 3.1.0 (2024-03-29)

- (HombachC) changed to tier 2 as data provider

### 3.0.11 (2024-03-29)

- (HombachC) corrected io-package.json according to new schema
- (HombachC) bump adapter-core to 3.0.6

### 3.0.10 (2024-03-03)

- (HombachC) fixed vulnerability

### 3.0.9 (2023-12-23)

- (HombachC) year 2024 changes
- (HombachC) several dependency updates

### 3.0.8 (2023-10-29)

- (HombachC) bump axios to 1.6.0 because of vulnerability
- (HombachC) several dependency updates

### 3.0.7 (2023-10-01)

- (HombachC) several dependency updates

### 3.0.6 (2023-08-27)

- (HombachC) improved error handling in case of offline inverters - centralized error handling

### 3.0.5 (2023-08-19)

- (HombachC) mitigating another sentry notified error in case of network trouble

### 3.0.4 (2023-08-13)

- (HombachC) bumped adapter core to V3

### 3.0.3 (2023-07-17)

- (HombachC) fixing sentry notified error in case of network trouble

### 3.0.2 (2023-07-14)

- (HombachC) fix small error in MP recognition
- (HombachC) sentry notified error in object handling

### 3.0.1 (2023-06-23)

- (HombachC) corrected state description

### 3.0.0 (2023-06-08)

- (HombachC) BREAKING: Dropped support for Node.js 14
- (HombachC) changed config screen to admin 5 solution
- (HombachC) dropped Admin <5 support
- (HombachC) removed tests for node 14

### 2.5.2 (2023-06-02)

- (HombachC) fixed a wording error
- (HombachC) bumped dependencies, added tests for node.js 20
- (HombachC) it's recommended to switch to minimum node.js 16, adapter still working with node 14

### 2.5.1 (2023-04-25)

- (HombachC) fixed a sentry reported error

### 2.5.0 (2023-04-22)

- (HombachC) implemented battery power calculation

### 2.4.7 (2023-04-13)

- (HombachC) improved error handling

### 2.4.6 (2023-04-09)

- (HombachC) fixed vulnerability in xml2js

### 2.4.5 (2023-04-07)

- (HombachC) improved error handling

### 2.4.4 (2023-04-04)

- (HombachC) improved error handling

### 2.4.3 (2023-04-03)

- (HombachC) improved error handling

### 2.4.2 (2023-03-07)

- (HombachC) fixed error in Piko MP Plus AC current
- (HombachC) added Piko MP Plus total yield

### 2.4.1 (2023-03-06)

- (HombachC) fixed Piko MP Plus support for two channel hardware

### 2.4.0 (2023-03-06)

- (HombachC) added support of AC and DC power values for Piko MP inverters

### 2.3.1 (2023-03-05)

- (HombachC) fix error with zero values in DC & AC

### 2.3.0 (2023-02-26)

- (HombachC) replaced got by axios
- (HombachC) added warning for not supported Piko MP inverters
- (HombachC) removed travis

### 2.2.2 (2023-02-14)

- (HombachC) fixed error with missing grid limitation response

### 2.2.0 (2023-02-03)

- (HombachC) added support for phase 1-3 of homeconsumption power
- (HombachC) enhanced sentry support

### 2.1.3 (2023-02-03)

- (HombachC) optimized debug data

### 2.1.2 (2023-01-29)

- (HombachC) fixed errors with single phase inverters (Piko 3)

### 2.1.1 (2022-12-29)

- (HombachC) year 2023 changes

### 2.1.0 (2022-11-04)

- (HombachC) added ukrainian translations

### 2.0.2 (2022-10-16)

- (HombachC) fixed small sentry reported error
- (HombachC) optimized error logging

### 2.0.1 (2022-10-11)

- (HombachC) optimized error logging

### 2.0.0 (2022-08-28)

- (HombachC) BREAKING: Dropped support for Node.js 12
- (HombachC) changed the minimal required js-controller version to 3.2.16
- (HombachC) added state of inverter as string

### 1.5.0 (2022-08-05)

- (HombachC) added minimum values for poll times to prevent communication errors

### 1.4.7 (2022-06-26)

- (HombachC) bumped dependency because of security vulnerability

### 1.4.6 (2022-06-06)

- (HombachC) removed gulp, bumped dependencies, added tests for node.js 18
- (HombachC) removed tests for node.js 12 -> it's recommended to switch to node.js 14, adapter still working with node 12

### 1.4.5 (2022-05-03)

- (HombachC) added UI version to sentry feedback and documentation

### 1.4.4 (2022-05-01)

- (HombachC) optimized sentry feedback and documentation

### 1.4.3 (2022-04-24)

- (HombachC) normalizing of analog values added

### 1.4.2 (2022-02-01)

- (HombachC) added support for inverter type, version and name
- (HombachC) fixed timing error

### 1.4.1 (2022-01-31)

- (HombachC) optimized logging

### 1.4.0 (2022-01-30)

- (HombachC) added support for grid 1-3 current, voltage and power

### 1.3.1 (2022-01-23)

- (HombachC) correct rounding of analog values
- (HombachC) added validation of configured IPv4 address

### 1.3.0 (2022-01-01)

- (HombachC) added optional support for analog inputs

### 1.2.1 (2021-12-24)

- (HombachC) introduced rounding of battery temp

### 1.2.0 (2021-12-16)

- (HombachC) dropped node.js 10 support
- (HombachC) fixed vulnerability

### 1.1.13 (2021-10-16)

- (HombachC) fixed vulnerability

### 1.1.12 (2021-10-07)

- (GermanBlueFox) fixed icon link

### 1.1.7 (2021-05-09)

- (HombachC) added tests for node.js 16
- (HombachC) fixed vulnerability

### 1.1.3 (2020-11-23)

- (HombachC) added battery.Voltage
- (HombachC) added additional error handler

### 1.1.1 (2020-10-09)

- (HombachC) minor documentation tweaks
- (HombachC) DC current accuracy changed to mA

### 1.1.0 (2020-10-09)

- (tobstare) added DC1-3 current, voltage and power
- (HombachC) added battery.ChargeCycles
- (HombachC) added battery.temperature

### 1.0.2 (2020-09-23)

- (HombachC) public release for stable repo

### 0.8.0 (2020-08-18)

- (HombachC) seperate editable poll timer for statistics data

### 0.7.4 (2020-07-03)

- (HombachC) added sentry.io support

### 0.6.1 (2020-06-28)

- (HombachC) poll of statistics data separated

### 0.1.0 (2020-05-15)

- (HombachC) initial version
