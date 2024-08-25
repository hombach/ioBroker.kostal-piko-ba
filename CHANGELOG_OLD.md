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

### 3.0.0 (2023-06-08)

-   (HombachC) BREAKING: Dropped support for Node.js 14
-   (HombachC) changed config screen to admin 5 solution
-   (HombachC) dropped Admin <5 support
-   (HombachC) removed tests for node 14

### 2.5.2 (2023-06-02)

-   (HombachC) fixed a wording error
-   (HombachC) bumped dependencies, added tests for node.js 20
-   (HombachC) it's recommended to switch to minimum node.js 16, adapter still working with node 14

### 2.5.1 (2023-04-25)

-   (HombachC) fixed a sentry reported error

### 2.5.0 (2023-04-22)

-   (HombachC) implemented battery power calculation

### 2.4.7 (2023-04-13)

-   (HombachC) improved error handling

### 2.4.6 (2023-04-09)

-   (HombachC) fixed vulnerability in xml2js

### 2.4.5 (2023-04-07)

-   (HombachC) improved error handling

### 2.4.4 (2023-04-04)

-   (HombachC) improved error handling

### 2.4.3 (2023-04-03)

-   (HombachC) improved error handling

### 2.4.2 (2023-03-07)

-   (HombachC) fixed error in Piko MP Plus AC current
-   (HombachC) added Piko MP Plus total yield

### 2.4.1 (2023-03-06)

-   (HombachC) fixed Piko MP Plus support for two channel hardware

### 2.4.0 (2023-03-06)

-   (HombachC) added support of AC and DC power values for Piko MP inverters

### 2.3.1 (2023-03-05)

-   (HombachC) fix error with zero values in DC & AC

### 2.3.0 (2023-02-26)

-   (HombachC) replaced got by axios
-   (HombachC) added warning for not supported Piko MP inverters
-   (HombachC) removed travis

### 2.2.2 (2023-02-14)

-   (HombachC) fixed error with missing grid limitation response

### 2.2.0 (2023-02-03)

-   (HombachC) added support for phase 1-3 of homeconsumption power
-   (HombachC) enhanced sentry support

### 2.1.3 (2023-02-03)

-   (HombachC) optimized debug data

### 2.1.2 (2023-01-29)

-   (HombachC) fixed errors with single phase inverters (Piko 3)

### 2.1.1 (2022-12-29)

-   (HombachC) year 2023 changes

### 2.1.0 (2022-11-04)

-   (HombachC) added ukrainian translations

### 2.0.2 (2022-10-16)

-   (HombachC) fixed small sentry reported error
-   (HombachC) optimized error logging

### 2.0.1 (2022-10-11)

-   (HombachC) optimized error logging

### 2.0.0 (2022-08-28)

-   (HombachC) BREAKING: Dropped support for Node.js 12
-   (HombachC) changed the minimal required js-controller version to 3.2.16
-   (HombachC) added state of inverter as string

### 1.5.0 (2022-08-05)

-   (HombachC) added minimum values for poll times to prevent communication errors

### 1.4.7 (2022-06-26)

-   (HombachC) bumped dependency because of security vulnerability

### 1.4.6 (2022-06-06)

-   (HombachC) removed gulp, bumped dependencies, added tests for node.js 18
-   (HombachC) removed tests for node.js 12 -> it's recommended to switch to node.js 14, adapter still working with node 12

### 1.4.5 (2022-05-03)

-   (HombachC) added UI version to sentry feedback and documentation

### 1.4.4 (2022-05-01)

-   (HombachC) optimized sentry feedback and documentation

### 1.4.3 (2022-04-24)

-   (HombachC) normalizing of analog values added

### 1.4.2 (2022-02-01)

-   (HombachC) added support for inverter type, version and name
-   (HombachC) fixed timing error

### 1.4.1 (2022-01-31)

-   (HombachC) optimized logging

### 1.4.0 (2022-01-30)

-   (HombachC) added support for grid 1-3 current, voltage and power

### 1.3.1 (2022-01-23)

-   (HombachC) correct rounding of analog values
-   (HombachC) added validation of configured IPv4 address

### 1.3.0 (2022-01-01)

-   (HombachC) added optional support for analog inputs

### 1.2.1 (2021-12-24)

-   (HombachC) introduced rounding of battery temp

### 1.2.0 (2021-12-16)

-   (HombachC) dropped node.js 10 support
-   (HombachC) fixed vulnerability

### 1.1.13 (2021-10-16)

-   (HombachC) fixed vulnerability

### 1.1.12 (2021-10-07)

-   (GermanBlueFox) fixed icon link

### 1.1.7 (2021-05-09)

-   (HombachC) added tests for node.js 16
-   (HombachC) fixed vulnerability

### 1.1.3 (2020-11-23)

-   (HombachC) added battery.Voltage
-   (HombachC) added additional error handler

### 1.1.1 (2020-10-09)

-   (HombachC) minor documentation tweaks
-   (HombachC) DC current accuracy changed to mA

### 1.1.0 (2020-10-09)

-   (tobstare) added DC1-3 current, voltage and power
-   (HombachC) added battery.ChargeCycles
-   (HombachC) added battery.temperature

### 1.0.2 (2020-09-23)

-   (HombachC) public release for stable repo

### 0.8.0 (2020-08-18)

-   (HombachC) seperate editable poll timer for statistics data

### 0.7.4 (2020-07-03)

-   (HombachC) added sentry.io support

### 0.6.1 (2020-06-28)

-   (HombachC) poll of statistics data separated

### 0.1.0 (2020-05-15)

-   (HombachC) initial version
