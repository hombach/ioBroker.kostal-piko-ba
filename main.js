'use strict';

// The adapter-core module gives you access to the core ioBroker functions, you need to create an adapter
const utils = require('@iobroker/adapter-core');

// Load your modules here, e.g.:
// const schedule = require('node-schedule');
const adapterIntervals = {};

// Leistungswerte
const ID_Power_SolarDC = 33556736;                // in W  -  DC Power PV
const ID_Power_GridAC = 67109120;                 // in W  -  GridOutputPower without battery charging
// State
const ID_OperatingState = 16780032;               // 0:Off; 3:Einspeissen(MPP)
// Statistics - Daily
const ID_StatDay_Yield = 251658754;               // in Wh
const ID_StatDay_HouseConsumption = 251659010;    // in Wh
const ID_StatDay_SelfConsumption = 251659266;     // in Wh
const ID_StatDay_SelfConsumptionRate = 251659278; // in %
const ID_StatDay_Autarky = 251659279;             // in %
// Statistics - Total
const ID_StatTot_OperatingTime = 251658496;       // in h
const ID_StatTot_Yield = 251658753;               // in kWh
const ID_StatTot_HouseConsumption = 251659009;    // in kWh
const ID_StatTot_SelfConsumption = 251659265;     // in kWh
const ID_StatTot_SelfConsumptionRate = 251659280; // in %
const ID_StatTot_Autarky = 251659281;             // in %
// Momentanwerte - PV Generator
const ID_DC1Current = 33555201;                   // in A  -  not implemented
const ID_DC1Voltage = 33555202;                   // in V  -  not implemented
const ID_DC1Power = 33555203;                     // in W  -  not implemented
const ID_DC2Current = 33555457;                   // in A  -  not implemented
const ID_DC2Voltage = 33555458;                   // in V  -  not implemented
const ID_DC2Power = 33555459;                     // in W  -  not implemented
// Momentanwerte Haus
const ID_Power_HouseConsumptionSolar = 83886336;  // in W  -  ActHomeConsumptionSolar
const ID_Power_HouseConsumptionBat = 83886592;    // in W  -  ActHomeConsumptionBat
const ID_Power_HouseConsumptionGrid = 83886848;   // in W  -  ActHomeConsumptionGrid
const ID_Power_HouseConsumptionPhase1 = 83887106; // in W  -  not implemented
const ID_Power_HouseConsumptionPhase2 = 83887362; // in W  -  not implemented
const ID_Power_HouseConsumptionPhase3 = 83887618; // in W  -  not implemented
const ID_Power_HouseConsumption = 83887872;       // in W  -  ActHomeConsumption
const ID_Power_SelfConsumption = 83888128;        // in W  -  ownConsumption
// grid parameter
const ID_GridLimitation = 67110144;               // in %   -  GridLimitation
const ID_GridFrequency = 67110400;                // in Hz  -  not implemented
const ID_GridCosPhi = 67110656;                   //        -  not implemented
// grid phase 1
const ID_L1GridCurrent = 67109377;                // in A  -  not implemented
const ID_L1GridVoltage = 67109378;                // in V  -  not implemented
const ID_L1GridPower = 67109379;                  // in W  -  not implemented
// grid phase 2
const ID_L2GridCurrent = 67109633;                // in A  -  not implemented
const ID_L2GridVoltage = 67109634;                // in V  -  not implemented
const ID_L2GridPower = 67109635;                  // in W  -  not implemented
// grid phase 3
const ID_L3GridCurrent = 67109889;                // in A  -  not implemented
const ID_L3GridVoltage = 67109890;                // in V  -  not implemented
const ID_L3GridPower = 67109891;                  // in W  -  not implemented
// Battery
const ID_BatVoltage = 33556226;                   // in V  -  not implemented
const ID_BatTemperature = 33556227;               // in ?  -  not implemented
const ID_BatChargeCycles = 33556228;              // in 1  -  not implemented
const ID_BatStateOfCharge = 33556229;             // in %
const ID_BatCurrentDir = 33556230;                // 1 = discharge; 0 = charge
const ID_BatCurrent = 33556238;                   // in A

var KostalRequest = '';      // IP request-string for PicoBA current data
var KostalRequestDay = '';   // IP request-string for PicoBA daily statistics
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
    * Is called when databases are connected and adapter received configuration.
    */
    async onReady() {
        if (!this.config.ipaddress) {
            this.log.warn('Kostal Piko IP address not set');
        } else {
            this.log.info(`IP address found in config: ${this.config.ipaddress}`);
        }

        if (!this.config.polltimelive) {
            this.log.warn('Polltime not set or zero - will be set to 10 seconds');
            this.config.polltimelive = 10000;
        } 
        this.log.info(`Polltime set to: ${(this.config.polltimelive / 1000)} seconds`);

        if (!this.config.polltimedaily) {
            this.log.warn('Polltime daily data not set or zero - will be set to 60 seconds');
            this.config.polltimedaily = 60000;
        }
        this.log.info(`Polltime daily data set to: ${(this.config.polltimedaily / 1000)} seconds`);

        if (!this.config.polltimetotal) {
            this.log.warn('Polltime alltime data not set or zero - will be set to 10 seconds');
            this.config.polltimetotal = 200000;
        }
        this.log.info(`Polltime alltime data set to: ${(this.config.polltimetotal / 1000)} seconds`);


        //sentry.io ping
        /*
        if (this.supportsFeature && this.supportsFeature('PLUGINS')) {
            const sentryInstance = this.getPluginInstance('sentry');
            if (sentryInstance) {
                const Sentry = sentryInstance.getSentryObject();
                Sentry && Sentry.withScope(scope => {
                    scope.setLevel('info');
                    scope.setExtra('key', 'value');
                    Sentry.captureMessage('Adapter started', 'info'); // Level "info"
                });
            }
        }
        */

//        https://www.onsip.com/voip-resources/voip-fundamentals/avoiding-javascript-settimeout-and-setinterval-problems#:~:text=%20Avoiding%20JavaScript%20setTimeout%20and%20setInterval%20Problems%20,crux%20of%20the%20solution%20is%20mini...%20More%20


        // this.subscribeStates('*'); // all states changes inside the adapters namespace are subscribed

        /*
        setState examples
        you will notice that each setState will cause the stateChange event to fire (because of above subscribeStates cmd)
        try {
            await this.setStateAsync('state', { val: 10 })
            await this.setStateAsync('state', true); // the variable state is set to true as command (ack=false)
            await this.setStateAsync('state', { val: true, ack: true }); // ack should be always set to true if the value is received from or acknowledged from the target system
        } catch (e) {
            this.log.error("Unhandled exception processing setStateAsync: " + e);
        }
        */

        if (this.config.ipaddress) {

            KostalRequest = `http://${this.config.ipaddress}/api/dxs.json`
                + `?dxsEntries=${ID_Power_SolarDC        }&dxsEntries=${ID_Power_GridAC          }`
                + `&dxsEntries=${ID_Power_SelfConsumption}&dxsEntries=${ID_Power_HouseConsumption}`
                + `&dxsEntries=${ID_OperatingState       }&dxsEntries=${ID_BatStateOfCharge      }`
                + `&dxsEntries=${ID_BatCurrent           }&dxsEntries=${ID_BatCurrentDir         }`
                + `&dxsEntries=${ID_GridLimitation       }`;

            KostalRequestDay = `http://${this.config.ipaddress}/api/dxs.json`
                + `?dxsEntries=${ID_StatDay_SelfConsumption}&dxsEntries=${ID_StatDay_SelfConsumptionRate}`
                + `&dxsEntries=${ID_StatDay_Yield          }&dxsEntries=${ID_StatDay_HouseConsumption   }`
                + `&dxsEntries=${ID_StatDay_Autarky        }`;

            KostalRequestTotal = `http://${this.config.ipaddress}/api/dxs.json`
                + `?dxsEntries=${ID_StatTot_SelfConsumption}&dxsEntries=${ID_StatTot_SelfConsumptionRate}`
                + `&dxsEntries=${ID_StatTot_Yield          }&dxsEntries=${ID_StatTot_HouseConsumption   }`
                + `&dxsEntries=${ID_StatTot_Autarky        }&dxsEntries=${ID_StatTot_OperatingTime      }`;
 
            this.log.debug('OnReady done');
            await this.ReadPiko();
            await this.ReadPikoDaily();
            await this.ReadPikoTotal();
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
        }
    }

    
    /****************************************************************************************
    */
    ReadPiko() {
         var got = require('got');
        (async () => {
            try {
                // @ts-ignore got is valid
                var response = await got(KostalRequest);
                if (!response.error && response.statusCode == 200) {
                    var result = await JSON.parse(response.body).dxsEntries;
                    this.setStateAsync('Power.SolarDC', { val: Math.round(result[0].value), ack: true });
                    this.setStateAsync('Power.GridAC', { val: Math.round(result[1].value), ack: true });
                    this.setStateAsync('Power.SelfConsumption', { val: Math.round(result[2].value), ack: true });
                    this.setStateAsync('Power.HouseConsumption', { val: Math.floor(result[3].value), ack: true });
                    this.setStateAsync('State', { val: result[4].value, ack: true });
                    this.setStateAsync('Battery.SoC', { val: result[5].value, ack: true });
                    if (result[7].value) { // result[7] = 'Battery current direction; 1=Load; 0=Unload'
                        this.setStateAsync('Battery.Current', { val: result[6].value, ack: true});
                    }
                    else { // discharge
                        this.setStateAsync('Battery.Current', { val: result[6].value * -1, ack: true});
                    }
                    this.setStateAsync('Power.Surplus', { val: Math.round(result[1].value - result[2].value), ack: true });
                    this.setStateAsync('GridLimitation', { val: result[8].value, ack: true });
                    this.log.debug('Piko-BA live data updated');
                }
                else {
                    this.log.error(`Error: ${response.error} by polling Piko-BA: ${KostalRequest}`);
                }
            } catch (e) {
                this.log.error(`Error in calling Piko API: ${e}`);
                this.log.error(`Please verify IP address: ${this.config.ipaddress} !!!`);
            } // END catch
            adapterIntervals.live = setTimeout(this.ReadPiko.bind(this), this.config.polltimelive);
        })();
    } // END ReadPiko

    /****************************************************************************************
    */
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
                    this.log.error(`Error: ${response.error} by polling Piko-BA: ${KostalRequest}`);
                }
            } catch (e) {
                this.log.error(`Error in calling Piko API: ${e}`);
                this.log.error(`Please verify IP address: ${this.config.ipaddress} !!!`);
            } // END catch
            adapterIntervals.daily = setTimeout(this.ReadPikoDaily.bind(this), this.config.polltimedaily);
        })();
    } // END ReadPikoDaily

    /****************************************************************************************
    */
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
                    this.log.debug('Piko-BA lifetime data updated');
                }
                else {
                    this.log.error(`Error: ${response.error} by polling Piko-BA: ${KostalRequest}`);
                }
            } catch (e) {
                this.log.error(`Error in calling Piko API: ${e}`);
                this.log.error(`Please verify IP address: ${this.config.ipaddress} !!!`);
            } // END catch
        })();
        adapterIntervals.total = setTimeout(this.ReadPikoTotal.bind(this), this.config.polltimetotal);
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