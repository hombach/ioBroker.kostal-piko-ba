'use strict';

// The adapter-core module gives you access to the core ioBroker functions, you need to create an adapter
const utils = require('@iobroker/adapter-core');

// Load your modules here, e.g.:
// const schedule = require('node-schedule');
const adapterIntervals = {};

// Leistungswerte
const ID_DCEingangGesamt = 33556736;         // in W  -  dcPowerPV
const ID_Ausgangsleistung = 67109120;        // in W  -  GridOutputPower without battery charging
// Status
const ID_OperatingStatus = 16780032;         // 0:Off; 3:Einspeissen(MPP)
// Statistik - Tag
const ID_Ertrag_d = 251658754;               // in Wh
const ID_Hausverbrauch_d = 251659010;        // in Wh
const ID_Eigenverbrauch_d = 251659266;       // in Wh
const ID_Eigenverbrauchsquote_d = 251659278; // in %
const ID_Autarkiegrad_d = 251659279;         // in %
// Statistik - Gesamt
const ID_Betriebszeit = 251658496;           // in h
const ID_Ertrag_G = 251658753;               // in kWh
const ID_Hausverbrauch_G = 251659009;        // in kWh
const ID_Eigenverbrauch_G = 251659265;       // in kWh
const ID_Eigenverbrauchsquote_G = 251659280; // in %
const ID_Autarkiegrad_G = 251659281;         // in %
// Momentanwerte - PV Generator
const ID_DC1Strom = 33555201;                // in A  -  not implemented
const ID_DC1Spannung = 33555202;             // in V  -  not implemented
const ID_DC1Leistung = 33555203;             // in W  -  not implemented
const ID_DC2Strom = 33555457;                // in A  -  not implemented
const ID_DC2Spannung = 33555458;             // in V  -  not implemented
const ID_DC2Leistung = 33555459;             // in W  -  not implemented
// Momentanwerte Haus
const ID_HausverbrauchSolar = 83886336;      // in W  -  ActHomeConsumptionSolar
const ID_HausverbrauchBatterie = 83886592;   // in W  -  ActHomeConsumptionBat
const ID_HausverbrauchNetz = 83886848;       // in W  -  ActHomeConsumptionGrid
const ID_HausverbrauchPhase1 = 83887106;     // in W  -  not implemented
const ID_HausverbrauchPhase2 = 83887362;     // in W  -  not implemented
const ID_HausverbrauchPhase3 = 83887618;     // in W  -  not implemented
const ID_Hausverbrauch = 83887872;           // in W  -  ActHomeConsumption
const ID_Eigenverbrauch = 83888128;          // in W  -  ownConsumption
// Netzparameter
const ID_NetzAbregelung = 67110144;          // in %   -  GridLimitation
const ID_NetzFrequenz = 67110400;            // in Hz  -  not implemented
const ID_NetzCosPhi = 67110656;              //        -  not implemented
// Netz Phase 1
const ID_P1Strom = 67109377;                 // in A  -  not implemented
const ID_P1Spannung = 67109378;              // in V  -  not implemented
const ID_P1Leistung = 67109379;              // in W  -  GridPowerL1, not implemented
// Netz Phase 2
const ID_P2Strom = 67109633;                 // in A  -  not implemented
const ID_P2Spannung = 67109634;              // in V  -  not implemented
const ID_P2Leistung = 67109635;              // in W  -  GridPowerL2, not implemented
// Netz Phase 3
const ID_P3Strom = 67109889;                 // in A  -  not implemented
const ID_P3Spannung = 67109890;              // in V  -  not implemented
const ID_P3Leistung = 67109891;              // in W  -  GridPowerL3, not implemented
// Batterie
const ID_BatVoltage = 33556226;              // in V  -  not implemented
const ID_BatTemperature = 33556227;          // in ?  -  not implemented
const ID_BatChargeCycles = 33556228;         // in 1  -  not implemented
const ID_BatStateOfCharge = 33556229;        // in %
const ID_BatCurrentDir = 33556230;           // 1 = discharge; 0 = charge
const ID_BatCurrent = 33556238;              // in A

var KostalRequest = '';  // IP request for PicoBA

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
            this.log.info('IP address found in config: ' + this.config.ipaddress);
        }

        if (!this.config.polltime) {
            this.log.warn('Polltime not set or zero - will be set to 10 seconds');
            this.config.polltime = 10000;
        } 
        this.log.info('Polltime set to: ' + (this.config.polltime / 1000) + ' seconds');
 
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
            KostalRequest = 'http://' + this.config.ipaddress + '/api/dxs.json' +
                '?dxsEntries=' + ID_DCEingangGesamt + '&dxsEntries=' + ID_Ausgangsleistung +
                '&dxsEntries=' + ID_Eigenverbrauch + '&dxsEntries=' + ID_Eigenverbrauch_d +
                '&dxsEntries=' + ID_Eigenverbrauch_G + '&dxsEntries=' + ID_Eigenverbrauchsquote_d +
                '&dxsEntries=' + ID_Eigenverbrauchsquote_G + '&dxsEntries=' + ID_Ertrag_d +
                '&dxsEntries=' + ID_Ertrag_G + '&dxsEntries=' + ID_Hausverbrauch_d +
                '&dxsEntries=' + ID_Hausverbrauch_G + '&dxsEntries=' + ID_Hausverbrauch +
                '&dxsEntries=' + ID_Autarkiegrad_G + '&dxsEntries=' + ID_Autarkiegrad_d +
                '&dxsEntries=' + ID_Betriebszeit + '&dxsEntries=' + ID_OperatingStatus +
                '&dxsEntries=' + ID_BatStateOfCharge + '&dxsEntries=' + ID_BatCurrent +
                '&dxsEntries=' + ID_BatCurrentDir + '&dxsEntries=' + ID_NetzAbregelung;
            this.log.debug("OnReady done");
            await this.ReadPiko();
            this.log.debug("Initial ReadPiko done");
//            adapterIntervals.sec10 = setInterval(this.ReadPiko.bind(this), this.config.polltime);
        } else {
            this.stop;
        }
    }

    /****************************************************************************************
    * Is called when adapter shuts down - callback has to be called under any circumstances!
    * @param {() => void} callback */
    onUnload(callback) {
        try {
//            clearInterval(adapterIntervals.sec10);
            clearTimeout(adapterIntervals.live);
            Object.keys(adapterIntervals).forEach(interval => clearInterval(adapterIntervals[interval]));
            this.log.info('Adaptor Kostal-Piko-BA cleaned up everything...');
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
                    this.setStateAsync('Statistics_Daily.SelfConsumption', { val: Math.round(result[3].value)/1000, ack: true });
                    this.setStateAsync('Statistics_Total.SelfConsumption', { val: Math.round(result[4].value), ack: true });
                    this.setStateAsync('Statistics_Daily.SelfConsumptionRate', { val: Math.round(result[5].value), ack: true });
                    this.setStateAsync('Statistics_Total.SelfConsumptionRate', { val: Math.round(result[6].value), ack: true });
                    this.setStateAsync('Statistics_Daily.Yield', { val: Math.round(result[7].value)/1000, ack: true });
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
                    adapterIntervals.live = setTimeout(this.ReadPiko.bind(this), this.config.polltime);
                    this.log.debug('Piko-BA ausgelesen');
                }
                else {
                    this.log.error('Fehler: ' + response.error + ' bei Abfrage von Pico-BA: ' + KostalRequest);
                }
            } catch (e) {
                this.log.error('Error in calling Piko API: ' + e);
                this.log.error('Please verify IP address: ' + this.config.ipaddress + ' !!!');
                adapterIntervals.live
                adapterIntervals.live = setTimeout(this.ReadPiko.bind(this), 600000);
            } // END catch
        })();
    } // END ReadPiko
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