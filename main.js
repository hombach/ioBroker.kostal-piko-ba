'use strict';

// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
const utils = require('@iobroker/adapter-core');

// Load your modules here, e.g.:
// const fs = require("fs");
// const schedule = require('node-schedule');

const adapterIntervals = {};

//Leistungswerte
const ID_DCEingangGesamt = 33556736;  // in W  -  dcPowerPV
const ID_Ausgangsleistung = 67109120;  // in W  -  GridOutputPower without battery charging
//Status
const ID_OperatingStatus = 16780032;  // 0:Off; 3:Einspeissen(MPP)
//Statistik - Tag
const ID_Ertrag_d = 251658754; // in Wh
const ID_Hausverbrauch_d = 251659010; // in Wh
const ID_Eigenverbrauch_d = 251659266; // in Wh
const ID_Eigenverbrauchsquote_d = 251659278; // in %
const ID_Autarkiegrad_d = 251659279; // in %
//Statistik - Gesamt
const ID_Betriebszeit = 251658496; // in h
const ID_Ertrag_G = 251658753; // in kWh
const ID_Hausverbrauch_G = 251659009; // in kWh
const ID_Eigenverbrauch_G = 251659265; // in kWh
const ID_Eigenverbrauchsquote_G = 251659280; // in %
const ID_Autarkiegrad_G = 251659281; // in %
//Momentanwerte - PV Generator
const ID_DC1Strom = 33555201;  // in A   -   nicht interessant
const ID_DC1Spannung = 33555202;  // in V   -   nicht interessant
const ID_DC1Leistung = 33555203;  // in W   -   nicht interessant, da bei Single String identisch zu ID_DCEingangGesamt
const ID_DC2Strom = 33555457;  // in A   -   String nicht belegt
const ID_DC2Spannung = 33555458;  // in V   -   String nicht belegt
const ID_DC2Leistung = 33555459;  // in W   -   String nicht belegt
//Momentanwerte Haus
const ID_HausverbrauchSolar = 83886336;  // in W   -   AktHomeConsumptionSolar
const ID_HausverbrauchBatterie = 83886592;  // in W   -   AktHomeConsumptionBat
const ID_HausverbrauchNetz = 83886848;  // in W   -   AktHomeConsumptionGrid
const ID_HausverbrauchPhase1 = 83887106;  // in W   -   nicht interessant
const ID_HausverbrauchPhase2 = 83887362;  // in W   -   nicht interessant
const ID_HausverbrauchPhase3 = 83887618;  // in W   -   nicht interessant
const ID_Hausverbrauch = 83887872;  // in W   -   AktHomeConsumption
const ID_Eigenverbrauch = 83888128;  // in W   -   ownConsumption
//Netz Netzparameter
const ID_NetzAbregelung = 67110144;  // in %   -   GridLimitation
const ID_NetzFrequenz = 67110400;  // in Hz  -   nicht interessant
const ID_NetzCosPhi = 67110656;  //        -   nicht interessant
//Netz Phase 1
const ID_P1Strom = 67109377;  // in A   -   nicht interessant
const ID_P1Spannung = 67109378;  // in V   -   nicht interessant
const ID_P1Leistung = 67109379;  // in W   -   GridPowerL1
//Netz Phase 2
const ID_P2Strom = 67109633;  // in A   -   nicht interessant
const ID_P2Spannung = 67109634;  // in V   -   nicht interessant
const ID_P2Leistung = 67109635;  // in W   -   GridPowerL2
//Netz Phase 3
const ID_P3Strom = 67109889;  // in A   -   nicht interessant
const ID_P3Spannung = 67109890;  // in V   -   nicht interessant
const ID_P3Leistung = 67109891;  // in W   -   GridPowerL3
//Batterie
const ID_BatVoltage = 33556226;  // in V   -   nicht interessant
const ID_BatTemperature = 33556227;  // in ?   -   nicht interessant
const ID_BatChargeCycles = 33556228;  // in 1   -   nicht interessant
const ID_BatStateOfCharge = 33556229;  // in %
const ID_BatCurrentDir = 33556230;  // 1 = Entladen; 0 = Laden
const ID_BatCurrent = 33556238;  // in A

const IPAnlage = 'http://192.168.100.121/api/dxs.json'; // IP der Photovoltaik-Anlage

let adapter;

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
        this.on('objectChange', this.onObjectChange.bind(this));
        this.on('stateChange', this.onStateChange.bind(this));
        // this.on('message', this.onMessage.bind(this));
        this.on('unload', this.onUnload.bind(this));
    }
    
    /****************************************************************************************
    * Is called when databases are connected and adapter received configuration.
    */
    async onReady() {
        // Initialize your adapter here
        if (!this.config.ipaddress) this.log.warn('Kostal Piko IP address not set');

        // The adapters config (in the instance object everything under the attribute "native") is accessible via
        // this.config:
        this.log.info('config option1: ' + this.config.option1);
        this.log.info('config option2: ' + this.config.option2);

        //For every state in the system there has to be also an object of type state. Here a simple template for a boolean variable
        // General state-objects
        await this.setObjectAsync('State', {
            type: 'state',
            common: {
                role: 'value', name: 'Inverter state; 0:off; 3:feed grid(MPP)',
                type: 'number', unit: '', read: true, write: false, def: 0 },
            native: {},
        });
        await this.setObjectAsync('GridLimitation', { type: 'state',
            common: {
                role: 'value', name: 'Power limit of inverter by grid parameters',
                type: 'number', unit: '%', read: true, write: false, def: 0
            },
            native: {},
        });

        // Power state-objects
        await this.setObjectAsync('Power', { type: 'channel',
            common: { name: 'current inverter power data' },
            native: {},
        });
        await this.setObjectAsync('Power.GridAC', { type: 'state',
            common: {
                role: 'value', name: 'Grid output power without battery chargin',
                type: 'number', unit: 'W', read: true, write: false, def: 0
            },
            native: {},
        });
        await this.setObjectAsync('Power.SolarDC', { type: 'state',
            common: {
                role: 'value', name: 'Total solar input power',
                type: 'number', unit: 'W', read: true, write: false, def: 0
            },
            native: {},
        });
        await this.setObjectAsync('Power.SelfConsumption', { type: 'state',
            common: {
                role: 'value', name: 'Selfconsumption Power',
                type: 'number', unit: 'W', read: true, write: false, def: 0
            },
            native: {},
        });
        await this.setObjectAsync('Power.HouseConsumption', { type: 'state',
            common: {
                role: 'value', name: 'Powerconsumption of house',
                type: 'number', unit: 'W', read: true, write: false, def: 0
            },
            native: {},
        });
        await this.setObjectAsync('Power.Surplus', { type: 'state',
            common: {
                role: 'value', name: 'Power surplus of system',
                type: 'number', unit: 'W', read: true, write: false, def: 0
            },
            native: {},
        });

        // Daily statistics state-objects
        await this.setObjectAsync('Statistics_Daily', { type: 'channel',
            common: { name: 'statistical data daily' },
            native: {},
        });
        await this.setObjectAsync('Statistics_Daily.Yield', { type: 'state',
            common: {
                role: 'value', name: 'Total yield today',
                type: 'number', unit: 'kWh', read: true, write: false, def: 0
            },
            native: {},
        });
        await this.setObjectAsync('Statistics_Daily.HouseConsumption', { type: 'state',
            common: {
                role: 'value', name: 'Total consumption house today',
                type: 'number', unit: 'kWh', read: true, write: false, def: 0
            },
            native: {},
        });
        await this.setObjectAsync('Statistics_Daily.SelfConsumption', { type: 'state',
            common: {
                role: 'value', name: 'Total selfconsumption today',
                type: 'number', unit: 'kWh', read: true, write: false, def: 0
            },
            native: {},
        });
        await this.setObjectAsync('Statistics_Daily.SelfConsumptionRate', { type: 'state',
            common: {
                role: 'value', name: 'Rate of selfconsumption today',
                type: 'number', unit: '%', read: true, write: false, def: 0
            },
            native: {},
        });
        await this.setObjectAsync('Statistics_Daily.Autarky', { type: 'state',
            common: {
                role: 'value', name: 'Degree of autarky today',
                type: 'number', unit: '%', read: true, write: false, def: 0
            },
            native: {},
        });

        // Total statistics state-objects
        await this.setObjectAsync('Statistics_Total', { type: 'channel',
            common: { name: 'statistical data total lifetime' },
            native: {},
        });
        await this.setObjectAsync('Statistics_Total.OperatingTime', { type: 'state',
            common: {
                role: 'value', name: 'Total time of inverter operation',
                type: 'number', unit: 'h', read: true, write: false, def: 0
            },
            native: {},
        });
        await this.setObjectAsync('Statistics_Total.Yield', { type: 'state',
            common: {
                role: 'value', name: 'Total yield of inverter lifetime',
                type: 'number', unit: 'kWh', read: true, write: false, def: 0
            },
            native: {},
        });
        await this.setObjectAsync('Statistics_Total.HouseConsumption', { type: 'state',
            common: {
                role: 'value', name: 'Total consumption of house in inverter lifetime',
                type: 'number', unit: 'kWh', read: true, write: false, def: 0
            },
            native: {},
        });
        await this.setObjectAsync('Statistics_Total.SelfConsumption', { type: 'state',
            common: {
                role: 'value', name: 'Total selfconsumption in inverter lifetime',
                type: 'number', unit: 'kWh', read: true, write: false, def: 0
            },
            native: {},
        });
        await this.setObjectAsync('Statistics_Total.SelfConsumptionRate', { type: 'state',
            common: {
                role: 'value', name: 'Rate of selfconsumption in inverter lifetime',
                type: 'number', unit: 'kWh', read: true, write: false, def: 0
            },
            native: {},
        });
        await this.setObjectAsync('Statistics_Total.Autarky', { type: 'state',
            common: {
                role: 'value', name: 'Degree of autarky in inverter lifetime',
                type: 'number', unit: '%', read: true, write: false, def: 0
            },
            native: {},
        });

        // Battery data state-objects
        await this.setObjectAsync('Battery', { type: 'channel',
            common: { name: 'Battery data' },
            native: {},
        });
        await this.setObjectAsync('Battery.SoC', { type: 'state',
            common: {
                role: 'value', name: 'Battery State of Charge',
                type: 'number', unit: '%', read: true, write: false, def: 0
            },
            native: {},
        });
        await this.setObjectAsync('Battery.Current', { type: 'state',
            common: {
                role: 'value', name: 'Battery current; >0 => charge; <0 => discharge',
                type: 'number', unit: 'A', read: true, write: false, def: 0
            },
            native: {},
        });
        await this.setObjectAsync('Battery.CurrentDir', { type: 'state',
            common: {
                role: 'indicator', name: 'Battery current direction; 1=Load; 0=Unload',
                type: 'boolean', unit: '', read: true, write: false, def: false
            },
            native: {},
        });


        // all states changes inside the adapters namespace are subscribed
        // this.subscribeStates('*');

        /*
        setState examples
        you will notice that each setState will cause the stateChange event to fire (because of above subscribeStates cmd)
        try {
            await this.setStateAsync('state', { val: 10 })
            await this.setStateAsync('state', true); // the variable state is set to true as command (ack=false)
            await this.setStateAsync('state', { val: true, ack: true }); // ack should be always set to true if the value is received from or acknowledged from the target system
            await this.setStateAsync('state', { val: true, ack: true, expire: 30 }); // same thing, but the state is deleted after 30s (getState will return null afterwards)
        } catch (e) {
            this.log.error("Unhandled exception processing setStateAsync: " + e);
        }
        */

        // examples for the checkPassword/checkGroup functions
        /*
        let result = await this.checkPasswordAsync('admin', 'iobroker');
        this.log.info('check user admin pw iobroker: ' + result);

        result = await this.checkGroupAsync('admin', 'admin');
        this.log.info('check group user admin group admin: ' + result);
        */
        this.log.debug("OnReady done");
        await this.ReadPiko();
        this.log.debug("Initial ReadPico done");

        //do {
         //   setTimeout(this.ReadPiko, 5000);
       // }
        //while (true);

//        let AutoRun = window.setInterval(this.ReadPiko(), 1000);
        //clearInterval(AutoRun);
        //var sched10 = schedule.schedulejob('*/10 * * * * *', this.ReadPiko());

                // var schedule = require('node-schedule');
        // var sched10 = schedule('*/10 * * * * *', adapter.ReadPiko);
     //   console.log("ERROR: " + e);
        // adapter.log.error('Error in schedule' + e);

     //   adapterIntervals.sec5 = setInterval(await this.ReadPiko(), 5000);
     //clearInterval(adapterIntervals.sec5);


    }

    /****************************************************************************************
    * Is called when adapter shuts down - callback has to be called under any circumstances!
    * @param {() => void} callback */
    onUnload(callback) {
        try {
            Object.keys(adapterIntervals).forEach(interval => clearInterval(adapterIntervals[interval]));
            this.log.info('Adaptor Kostal-Piko-BA cleaned everything up...');
            callback();
        } catch (e) {
            callback();
        }
    }

    /****************************************************************************************
    * Is called if a subscribed object changes
    * @param {string} id
    * @param {ioBroker.Object | null | undefined} obj */
    onObjectChange(id, obj) {
        if (obj) { // The object was changed
            this.log.info(`object ${id} changed: ${JSON.stringify(obj)}`);
        } else {   // The object was deleted
            this.log.info(`object ${id} deleted`);
        }
    }

    /****************************************************************************************
    * Is called if a subscribed state changes
    * @param {string} id
    * @param {ioBroker.State | null | undefined} state */
    onStateChange(id, state) {
        try {
            if (state) { // The state was changed
                this.log.info(`state ${id} changed: ${state.val} (ack = ${state.ack})`);
            } else {     // The state was deleted
                this.log.info(`state ${id} deleted`);
            }
        } catch (e) {
            this.log.error("Unhandled exception processing stateChange: " + e);
        }
    }

    /****************************************************************************************
    * Some message was sent to this instance over message box. Used by email, pushover, text2speech, ...
    * Using this method requires "common.message" property to be set to true in io-package.json
    * @param {ioBroker.Message} obj */
    // onMessage(obj) {
    // 	if (typeof obj === 'object' && obj.message) {
    // 		if (obj.command === 'send') { // e.g. send email or pushover or whatever
    // 			this.log.info('send command');

    // 			// Send response in callback if required
    // 			if (obj.callback) this.sendTo(obj.from, obj.command, 'Message received', obj.callback);
    // 		}
    // 	}
    // }
    
    /****************************************************************************************
    */
    ReadPiko() { // only working if instanciated!!
        //this.log.debug('Piko 6.0 BA auslesen');
        
        const PICOIP = IPAnlage + '?dxsEntries=' + ID_DCEingangGesamt +
            '&dxsEntries=' + ID_Ausgangsleistung + '&dxsEntries=' + ID_Eigenverbrauch +
            '&dxsEntries=' + ID_Eigenverbrauch_d + '&dxsEntries=' + ID_Eigenverbrauch_G +
            '&dxsEntries=' + ID_Eigenverbrauchsquote_d + '&dxsEntries=' + ID_Eigenverbrauchsquote_G +
            '&dxsEntries=' + ID_Ertrag_d + '&dxsEntries=' + ID_Ertrag_G +
            '&dxsEntries=' + ID_Hausverbrauch_d + '&dxsEntries=' + ID_Hausverbrauch_G +
            '&dxsEntries=' + ID_Hausverbrauch + '&dxsEntries=' + ID_Autarkiegrad_G +
            '&dxsEntries=' + ID_Autarkiegrad_d + '&dxsEntries=' + ID_Betriebszeit +
            '&dxsEntries=' + ID_OperatingStatus + '&dxsEntries=' + ID_BatStateOfCharge +
            '&dxsEntries=' + ID_BatCurrent + '&dxsEntries=' + ID_BatCurrentDir +
            '&dxsEntries=' + ID_NetzAbregelung;

        var got = require('got');
        (async () => {
            try {
                // @ts-ignore got is a valid
                var response = await got(PICOIP);
                if (!response.error && response.statusCode == 200) {
                    // if (logging) this.log.debug(response.body);
                    var result = await JSON.parse(response.body).dxsEntries;
                    this.setStateAsync('Power.SolarDC', { val: Math.round(result[0].value), ack: true });
                    this.setStateAsync('Power.GridAC', { val: Math.round(result[1].value), ack: true });
                    this.setStateAsync('Power.SelfConsumption', { val: Math.round(result[2].value), ack: true });
                    this.setStateAsync('Statistics_Daily.SelfConsumption', { val: Math.round(result[3].value)/1000, ack: true });
                    this.setStateAsync('Statistics_Total.SelfConsumption', { val: Math.round(result[4].value), ack: true });
                    // if (logging) this.log.debug('Eigenverbrauch Gesamt: ' + Math.round(result[4].value));
                    this.setStateAsync('Statistics_Daily.SelfConsumptionRate', { val: Math.round(result[5].value), ack: true });
                    this.setStateAsync('Statistics_Total.SelfConsumptionRate', { val: Math.round(result[6].value), ack: true });
                    this.setStateAsync('Statistics_Daily.Yield', { val: Math.round(result[7].value), ack: true });
                    this.setStateAsync('Statistics_Total.Yield', { val: Math.round(result[8].value), ack: true });
                    this.setStateAsync('Statistics_Daily.HouseConsumption', { val: Math.round(result[9].value)/1000, ack: true });
                    this.setStateAsync('Statistics_Total.HouseConsumption', { val: Math.round(result[10].value), ack: true });
                    this.setStateAsync('Power.HouseConsumption', { val: Math.floor(result[11].value), ack: true });
                    this.setStateAsync('Statistics_Total.Autarky', { val: Math.round(result[12].value), ack: true });
                    this.setStateAsync('Statistics_Daily.Autarky', { val: Math.round(result[13].value), ack: true });
                    this.setStateAsync('Statistics_Total.OperatingTime', { val: result[14].value, ack: true });
                    this.setStateAsync('State', { val: result[15].value, ack: true });
                    this.setStateAsync('Battery.SoC', { val: result[16].value, ack: true });
                    if (result[18].value) { // result[18] = 'Battery current direction; 1=Load; 0=Unload'
                        this.setStateAsync('Battery.Current', { val: result[17].value, ack: true});
                    }
                    else { // discharge
                        this.setStateAsync('Battery.Current', { val: result[17].value * -1, ack: true});
                    }
                    this.setStateAsync('Power.Surplus', { val: Math.round(result[1].value - result[2].value), ack: true });
                    this.setStateAsync('GridLimitation', { val: result[19].value, ack: true });
                }
                else {
                    this.log.error('Fehler: ' + response.error + ' bei Abfrage von Pico-BA: ' + IPAnlage);
                }
            } catch (e) {
                this.log.error('Error in calling Piko API:' + e);
            }
            this.log.debug('Piko 6.0 BA auslesen');

        })();

    } //END ReadPiko
} // END Class

// @ts-ignore parent is a valid property on module
if (module.parent) {
    // Export the constructor in compact mode
    /**
    * @param {Partial<utils.AdapterOptions>} [options={}]
    */
    module.exports = (options) => adapter = new KostalPikoBA(options);
} else { // otherwise start the instance directly
    adapter = new KostalPikoBA();
}
// @ts-ignore

//adapter = new KostalPikoBA();
// @ts-ignore At runtime adapter will be defined
//adapterIntervals.sec5 = setInterval(adapter.ReadPiko, 5000);
adapter?.log.warn('Hello Juergen!');
   adapter?.ReadPiko;
