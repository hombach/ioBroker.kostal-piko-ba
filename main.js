'use strict';

// The adapter-core module gives you access to the core ioBroker functions, you need to create an adapter
const utils = require('@iobroker/adapter-core');

// Load your modules here, e.g.:
// const schedule = require('node-schedule');
const adapterIntervals = {};

// live values power output
const ID_Power_GridAC                 = 67109120;  // in W  -  GridOutputPower excluding power for battery charging
// state
const ID_OperatingState               = 16780032;  // 0 = aus; 1 = Leerlauf(?); 2 = Anfahren, DC Spannung noch zu klein(?)
                                                   // 3 = Einspeisen(MPP); 4 = Einspeisen(abgeregelt)
// statistics - daily
const ID_StatDay_Yield                = 251658754; // in Wh
const ID_StatDay_HouseConsumption     = 251659010; // in Wh
const ID_StatDay_SelfConsumption      = 251659266; // in Wh
const ID_StatDay_SelfConsumptionRate  = 251659278; // in %
const ID_StatDay_Autarky              = 251659279; // in %
// statistics - total
const ID_StatTot_OperatingTime        = 251658496; // in h
const ID_StatTot_Yield                = 251658753; // in kWh
const ID_StatTot_HouseConsumption     = 251659009; // in kWh
const ID_StatTot_SelfConsumption      = 251659265; // in kWh
const ID_StatTot_SelfConsumptionRate  = 251659280; // in %
const ID_StatTot_Autarky              = 251659281; // in %
// live values - PV generator power
const ID_Power_SolarDC                = 33556736;  // in W  -  DC Power PV generator in total
const ID_Power_DC1Current             = 33555201;  // in A  -  DC current line 1
const ID_Power_DC1Voltage             = 33555202;  // in V  -  DC voltage line 1
const ID_Power_DC1Power               = 33555203;  // in W  -  DC power line 1 
const ID_Power_DC2Current             = 33555457;  // in A  -  DC current line 2
const ID_Power_DC2Voltage             = 33555458;  // in V  -  DC voltage line 2
const ID_Power_DC2Power               = 33555459;  // in W  -  DC power line 2
const ID_Power_DC3Current             = 33555713;  // in A  -  DC current line 3 (equals to battery current in case of Pico BA)
const ID_Power_DC3Voltage             = 33555714;  // in V  -  DC voltage line 3 (equals to battery voltage in case of Pico BA)
const ID_Power_DC3Power               = 33555715;  // in W  -  DC power line 3 (equals to battery power in case of Pico BA)
// live values - home
const ID_Power_HouseConsumptionSolar  = 83886336;  // in W  -  Act Home Consumption Solar - not implemented
const ID_Power_HouseConsumptionBat    = 83886592;  // in W  -  Act Home Consumption Bat - not implemented
const ID_Power_HouseConsumptionGrid   = 83886848;  // in W  -  Act Home Consumption Grid - not implemented
const ID_Power_HouseConsumptionPhase1 = 83887106;  // in W  -  Act Home Consumption Phase 1 - not implemented
const ID_Power_HouseConsumptionPhase2 = 83887362;  // in W  -  Act Home Consumption Phase 2 - not implemented
const ID_Power_HouseConsumptionPhase3 = 83887618;  // in W  -  Act Home Consumption Phase 3 - not implemented
const ID_Power_HouseConsumption       = 83887872;  // in W  -  Consumption of your home, measured by PIKO sensor
const ID_Power_SelfConsumption        = 83888128;  // in W  -  Self Consumption
// live values - grid parameter
const ID_GridLimitation               = 67110144;  // in %   -  Grid Limitation
const ID_GridFrequency                = 67110400;  // in Hz  -  Grid Frequency - not implemented
const ID_GridCosPhi                   = 67110656;  //        -  Grid CosPhi - not implemented
// live values - grid phase 1
const ID_L1GridCurrent                = 67109377;  // in A  -  Grid Output Current Phase 1 
const ID_L1GridVoltage                = 67109378;  // in V  -  Grid Output Voltage Phase 1
const ID_L1GridPower                  = 67109379;  // in W  -  Grid Output Power Phase 1
// live values - grid phase 2
const ID_L2GridCurrent                = 67109633;  // in A  -  Grid Output Current Phase 2
const ID_L2GridVoltage                = 67109634;  // in V  -  Grid Output Voltage Phase 2
const ID_L2GridPower                  = 67109635;  // in W  -  Grid Output Power Phase 2
// live values - grid phase 3
const ID_L3GridCurrent                = 67109889;  // in A  -  Grid Output Current Phase 3
const ID_L3GridVoltage                = 67109890;  // in V  -  Grid Output Voltage Phase 3
const ID_L3GridPower                  = 67109891;  // in W  -  Grid Output Power Phase 3
// live values - Battery
const ID_BatVoltage                   = 33556226;  // in V
const ID_BatTemperature               = 33556227;  // in °C
const ID_BatChargeCycles              = 33556228;  // in 1
const ID_BatStateOfCharge             = 33556229;  // in %
const ID_BatCurrentDir                = 33556230;  // 1 = discharge; 0 = charge
const ID_BatCurrent                   = 33556238;  // in A
// live values - inputs
const ID_InputAnalog1                 = 167772417; // in V   -  10bit resolution
const ID_InputAnalog2                 = 167772673; // in V   -  10bit resolution
const ID_InputAnalog3                 = 167772929; // in V   -  10bit resolution
const ID_InputAnalog4                 = 167773185; // in V   -  10bit resolution
const ID_Input_S0_count               = 184549632; // in 1   -  not implemented
const ID_Input_S0_seconds             = 150995968; // in sec -  not implemented

var KostalRequest1     = ''; // IP request-string 1 for PicoBA current data
var KostalRequest2     = ''; // IP request-string 1 for PicoBA current data
var KostalRequestDay   = ''; // IP request-string for PicoBA daily statistics
var KostalRequestTotal = ''; // IP request-string for PicoBA total statistics


class KostalPikoBA extends utils.Adapter {

    /****************************************************************************************
    * @param {Partial<utils.AdapterOptions>} [options={}]
    */
    constructor(options) {
        super({
            ...options,
            name: 'kostal-piko-ba'
        });
        this.on('ready', this.onReady.bind(this));
        // this.on('objectChange', this.onObjectChange.bind(this));
        // this.on('stateChange', this.onStateChange.bind(this));
        // this.on('message', this.onMessage.bind(this));
        this.on('unload', this.onUnload.bind(this));
    }


    /****************************************************************************************
    * Is called when databases are connected and adapter received configuration. ***********/
    async onReady() {
        if (!this.config.ipaddress) {
            this.log.error('Kostal Piko IP address not set');
        } else {
            this.log.info(`IP address found in config: ${this.config.ipaddress}`);
            // Validate IP address ...
            if (!(/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(this.config.ipaddress))) {
                this.log.error(`You have entered an invalid IP address! ${this.config.ipaddress}`)
            }
        }

        if (!this.config.polltimelive) {
            this.config.polltimelive = 10000;
            this.log.warn(`Polltime not set or zero - will be set to ${(this.config.polltimelive / 1000)} seconds`);
        } 
        this.log.info(`Polltime set to: ${(this.config.polltimelive / 1000)} seconds`);

        if (!this.config.polltimedaily) {
            this.config.polltimedaily = 60000;
            this.log.warn(`Polltime statistics data not set or zero - will be set to ${(this.config.polltimedaily / 1000)} seconds`);
        }
        this.log.info(`Polltime daily statistics set to: ${(this.config.polltimedaily / 1000)} seconds`);

        if (!this.config.polltimetotal) {
            this.config.polltimetotal = 200000;
            this.log.warn(`Polltime alltime statistics not set or zero - will be set to ${(this.config.polltimetotal / 1000)} seconds`);
        }
        this.log.info(`Polltime alltime statistics set to: ${(this.config.polltimetotal / 1000)} seconds`);

        //sentry.io ping
        if (this.supportsFeature && this.supportsFeature('PLUGINS')) {
            const sentryInstance = this.getPluginInstance('sentry');
            if (sentryInstance) {
                const Sentry = sentryInstance.getSentryObject();
                Sentry && Sentry.withScope(scope => {
                    scope.setLevel('info');
                    scope.setTag('Inverter', this.config.ipaddress);
                    Sentry.captureMessage('Adapter kostal-piko-ba started', 'info'); // Level "info"
                });
            }
        }

        // this.subscribeStates('*'); // all states changes inside the adapters namespace are subscribed

        if (this.config.ipaddress) {
            KostalRequest1 = `http://${this.config.ipaddress}/api/dxs.json`
                + `?dxsEntries=${ID_Power_SolarDC        }&dxsEntries=${ID_Power_GridAC          }`
                + `&dxsEntries=${ID_Power_DC1Power       }&dxsEntries=${ID_Power_DC1Current      }`
                + `&dxsEntries=${ID_Power_DC1Voltage     }&dxsEntries=${ID_Power_DC2Power        }`
                + `&dxsEntries=${ID_Power_DC2Current     }&dxsEntries=${ID_Power_DC2Voltage      }`
                + `&dxsEntries=${ID_Power_DC3Power       }&dxsEntries=${ID_Power_DC3Current      }`
                + `&dxsEntries=${ID_Power_DC3Voltage     }`            
                + `&dxsEntries=${ID_Power_SelfConsumption}&dxsEntries=${ID_Power_HouseConsumption}`
                + `&dxsEntries=${ID_OperatingState       }&dxsEntries=${ID_BatVoltage            }`
                + `&dxsEntries=${ID_BatTemperature       }&dxsEntries=${ID_BatStateOfCharge      }`
                + `&dxsEntries=${ID_BatCurrent           }&dxsEntries=${ID_BatCurrentDir         }`
                + `&dxsEntries=${ID_GridLimitation       }`;

            if (this.config.readanalogs) {
                KostalRequest1 = KostalRequest1 + `&dxsEntries=${ID_InputAnalog1}` + `&dxsEntries=${ID_InputAnalog2}`
                                                + `&dxsEntries=${ID_InputAnalog3}` + `&dxsEntries=${ID_InputAnalog4}`;
            }

            KostalRequest2 = `http://${this.config.ipaddress}/api/dxs.json`
                + `?dxsEntries=${ID_L1GridCurrent}&dxsEntries=${ID_L1GridVoltage}`
                + `&dxsEntries=${ID_L1GridPower}&dxsEntries=${ID_L2GridCurrent}`
                + `&dxsEntries=${ID_L2GridVoltage}&dxsEntries=${ID_L2GridPower}`
                + `&dxsEntries=${ID_L3GridCurrent}&dxsEntries=${ID_L3GridVoltage}`
                + `&dxsEntries=${ID_L3GridPower}`;

            KostalRequestDay = `http://${this.config.ipaddress}/api/dxs.json`
                + `?dxsEntries=${ID_StatDay_SelfConsumption}&dxsEntries=${ID_StatDay_SelfConsumptionRate}`
                + `&dxsEntries=${ID_StatDay_Yield          }&dxsEntries=${ID_StatDay_HouseConsumption   }`
                + `&dxsEntries=${ID_StatDay_Autarky        }`;

            KostalRequestTotal = `http://${this.config.ipaddress}/api/dxs.json`
                + `?dxsEntries=${ID_StatTot_SelfConsumption}&dxsEntries=${ID_StatTot_SelfConsumptionRate}`
                + `&dxsEntries=${ID_StatTot_Yield          }&dxsEntries=${ID_StatTot_HouseConsumption   }`
                + `&dxsEntries=${ID_StatTot_Autarky        }&dxsEntries=${ID_StatTot_OperatingTime      }`
                + `&dxsEntries=${ID_BatChargeCycles}`;

            this.log.debug('OnReady done');
            await this.ReadPikoTotal();
            await this.ReadPikoDaily();
            await this.Scheduler();
            this.log.debug('Initial ReadPiko done');
        } else {
            this.stop;
        }
    }

    /****************************************************************************************
    * Is called when adapter shuts down - callback has to be called under any circumstances!
    * @param {() => void} callback */
    onUnload(callback) {
        try {
            clearTimeout(adapterIntervals.live);
            clearTimeout(adapterIntervals.daily);
            clearTimeout(adapterIntervals.total);
            Object.keys(adapterIntervals).forEach(interval => clearInterval(adapterIntervals[interval]));
            this.log.info('Adapter Kostal-Piko-BA cleaned up everything...');
            callback();
        } catch (e) {
            callback();
        } // END try catch
    }


    /****************************************************************************************
    * Scheduler ****************************************************************************/
    Scheduler() {
        this.ReadPiko();
        try {
            clearTimeout(adapterIntervals.live);
            adapterIntervals.live = setTimeout(this.Scheduler.bind(this), this.config.polltimelive);
        } catch (e) {
            this.log.error(`Error in setting adapter schedule: ${e}`);
            this.restart;
        } // END try catch
    }
    

    /****************************************************************************************
    * ReadPiko *****************************************************************************/
    ReadPiko() {
         var got = require('got');
        (async () => {
            try {
                // @ts-ignore got is valid
                var response = await got(KostalRequest1);
                if (!response.error && response.statusCode == 200) {
                    var result = await JSON.parse(response.body).dxsEntries;
                    this.setStateAsync('Power.SolarDC', { val: Math.round(result[0].value), ack: true });
                    this.setStateAsync('Power.GridAC', { val: Math.round(result[1].value), ack: true });
                    this.setStateAsync('Power.DC1Power', { val: Math.round(result[2].value), ack: true });
                    this.setStateAsync('Power.DC1Current', { val: (Math.round(1000 * result[3].value)) / 1000, ack: true });
                    this.setStateAsync('Power.DC1Voltage', { val: Math.round(result[4].value), ack: true });
                    this.setStateAsync('Power.DC2Power', { val: Math.round(result[5].value), ack: true });
                    this.setStateAsync('Power.DC2Current', { val: (Math.round(1000 * result[6].value)) / 1000, ack: true });
                    this.setStateAsync('Power.DC2Voltage', { val: Math.round(result[7].value), ack: true });
                    this.setStateAsync('Power.DC3Power', { val: Math.round(result[8].value), ack: true });
                    this.setStateAsync('Power.DC3Current', { val: (Math.round(1000 * result[9].value)) / 1000, ack: true });
                    this.setStateAsync('Power.DC3Voltage', { val: Math.round(result[10].value), ack: true });
                    this.setStateAsync('Power.SelfConsumption', { val: Math.round(result[11].value), ack: true });
                    this.setStateAsync('Power.HouseConsumption', { val: Math.floor(result[12].value), ack: true });
                    this.setStateAsync('State', { val: result[13].value, ack: true });
                    this.setStateAsync('Battery.Voltage', { val: Math.round(result[14].value), ack: true });
                    this.setStateAsync('Battery.Temperature', { val: (Math.round(10 * result[15].value)) / 10, ack: true });
                    this.setStateAsync('Battery.SoC', { val: result[16].value, ack: true });
                    if (result[18].value) { // result[18] = 'Battery current direction; 1=Load; 0=Unload'
                        this.setStateAsync('Battery.Current', { val: result[17].value, ack: true});
                    }
                    else { // discharge
                        this.setStateAsync('Battery.Current', { val: result[17].value * -1, ack: true});
                    }
                    this.setStateAsync('Power.Surplus', { val: Math.round(result[1].value - result[11].value), ack: true });
                    this.setStateAsync('GridLimitation', { val: result[19].value, ack: true });

/*                    this.setStateAsync('Power.AC1Current', { val: (Math.round(1000 * result[20].value)) / 1000, ack: true });
                    this.setStateAsync('Power.AC1Voltage', { val: Math.round(result[21].value), ack: true });
                    this.setStateAsync('Power.AC1Power', { val: Math.round(result[22].value), ack: true });
                    this.setStateAsync('Power.AC2Current', { val: (Math.round(1000 * result[23].value)) / 1000, ack: true });
                    this.setStateAsync('Power.AC2Voltage', { val: Math.round(result[24].value), ack: true });
                    this.setStateAsync('Power.AC2Power', { val: Math.round(result[25].value), ack: true });
                    this.setStateAsync('Power.AC3Current', { val: (Math.round(1000 * result[26].value)) / 1000, ack: true });
                    this.setStateAsync('Power.AC3Voltage', { val: Math.round(result[27].value), ack: true });
                    this.setStateAsync('Power.AC3Power', { val: Math.round(result[28].value), ack: true });
*/
                    if (this.config.readanalogs) {
                        this.setStateAsync('Inputs.Analog1', { val: (Math.round(100 * result[20].value)) / 100, ack: true });
                        this.setStateAsync('Inputs.Analog2', { val: (Math.round(100 * result[21].value)) / 100, ack: true });
                        this.setStateAsync('Inputs.Analog3', { val: (Math.round(100 * result[22].value)) / 100, ack: true });
                        this.setStateAsync('Inputs.Analog4', { val: (Math.round(100 * result[23].value)) / 100, ack: true });
                    }
                    this.log.debug(`Piko-BA live data updated - Kostal response data: ${response.body}`);
                }
                else {
                    this.log.error(`Error: ${response.error} by polling Kostal Piko-BA: ${KostalRequest1}`);
                }
            } catch (e) {
                this.log.error(`Error in calling Kostal Piko API: ${e}`);
                this.log.error(`Please verify IP address: ${this.config.ipaddress} !!!`);
            } // END try catch
        }) ();
    } // END ReadPiko

    /****************************************************************************************
    * ReadPikoDaily ************************************************************************/
    ReadPikoDaily() {
        var got = require('got');
        (async () => {
            try {
                // @ts-ignore got is valid
                var response = await got(KostalRequestDay);
                if (!response.error && response.statusCode == 200) {
                    var result = await JSON.parse(response.body).dxsEntries;
                    this.setStateAsync('Statistics_Daily.SelfConsumption', { val: Math.round(result[0].value) / 1000, ack: true });
                    this.setStateAsync('Statistics_Daily.SelfConsumptionRate', { val: Math.round(result[1].value), ack: true });
                    this.setStateAsync('Statistics_Daily.Yield', { val: Math.round(result[2].value) / 1000, ack: true });
                    this.setStateAsync('Statistics_Daily.HouseConsumption', { val: Math.round(result[3].value) / 1000, ack: true });
                    this.setStateAsync('Statistics_Daily.Autarky', { val: Math.round(result[4].value), ack: true });
                    this.log.debug('Piko-BA daily data updated');
                }
                else {
                    this.log.error(`Error: ${response.error} by polling Piko-BA: ${KostalRequestDay}`);
                }
            } catch (e) {
                this.log.error(`Error in calling Piko API: ${e}`);
                this.log.error(`Please verify IP address: ${this.config.ipaddress} !!!`);
            } // END try catch

            try {
                clearTimeout(adapterIntervals.daily);
                adapterIntervals.daily = setTimeout(this.ReadPikoDaily.bind(this), this.config.polltimedaily);
            } catch (e) {
                this.log.error(`Error in setting adapter schedule: ${e}`);
            } // END try catch

        })();
    } // END ReadPikoDaily

    /****************************************************************************************
    * ReadPikoTotal ************************************************************************/
    ReadPikoTotal() {
        var got = require('got');
        (async () => {
            try {
                // @ts-ignore got is valid
                var response = await got(KostalRequestTotal);
                if (!response.error && response.statusCode == 200) {
                    var result = await JSON.parse(response.body).dxsEntries;
                    this.setStateAsync('Statistics_Total.SelfConsumption', { val: Math.round(result[0].value), ack: true });
                    this.setStateAsync('Statistics_Total.SelfConsumptionRate', { val: Math.round(result[1].value), ack: true });
                    this.setStateAsync('Statistics_Total.Yield', { val: Math.round(result[2].value), ack: true });
                    this.setStateAsync('Statistics_Total.HouseConsumption', { val: Math.round(result[3].value), ack: true });
                    this.setStateAsync('Statistics_Total.Autarky', { val: Math.round(result[4].value), ack: true });
                    this.setStateAsync('Statistics_Total.OperatingTime', { val: result[5].value, ack: true });
                    this.setStateAsync('Battery.ChargeCycles', { val: result[6].value, ack: true });
                    this.log.debug('Piko-BA lifetime data updated');
                }
                else {
                    this.log.error(`Error: ${response.error} by polling Piko-BA: ${KostalRequestTotal}`);
                }
            } catch (e) {
                this.log.error(`Error in calling Piko API: ${e}`);
                this.log.error(`Please verify IP address: ${this.config.ipaddress} !!!`);
            } // END try catch
        })();

        try {
            clearTimeout(adapterIntervals.total);
            adapterIntervals.total = setTimeout(this.ReadPikoTotal.bind(this), this.config.polltimetotal);
        } catch (e) {
            this.log.error(`Error in setting adapter schedule: ${e}`);
        } // END try catch

    } // END ReadPikoTotal
} // END Class


// @ts-ignore parent is a valid property on module
if (module.parent) {
    // Export the constructor in compact mode
    /**
    * @param {Partial<utils.AdapterOptions>} [options={}]
    */
    module.exports = (options) => new KostalPikoBA(options);
} else { // otherwise start the instance directly
    new KostalPikoBA();
}