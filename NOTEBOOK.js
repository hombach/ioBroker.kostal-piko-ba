// Ausleseskript Wechselrichter Kostal Piko ab Firmware v05.31 (12.10.2015)
// IP anpassen und ggf. Schedule. im Moment wird zwischen 5:00 und 23:59 alle 10 Sekunden geparst

//Konstanten
const IPAnlage = 'http://192.168.100.121/api/dxs.json'; // IP der Photovoltaik-Anlage

//Leistungswerte
const ID_DCEingangGesamt = 33556736;  // in W  -  dcPowerPV
const ID_Ausgangsleistung = 67109120;  // in W  -  GridOutputPower without Battery charging
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


//Variablen
createState('Kostal.Messwerte.Momentan.Leistung_AC', 0);
createState('Kostal.Messwerte.Tag.Autarkiegrad', 0);
createState('Kostal.Messwerte.Gesamt.Autarkiegrad', 0, { type: 'number', role: 'value', unit: '%' });
createState('Kostal.Messwerte.Gesamt.Betriebszeit', 0);
createState('Kostal.Messwerte.Momentan.Leistung_DC', 0);
createState('Kostal.Messwerte.Momentan.Eigenverbrauch', 0);
createState('Kostal.Messwerte.Tag.Eigenverbrauch', 0);
createState('Kostal.Messwerte.Gesamt.Eigenverbrauch', 0);
createState('Kostal.Messwerte.Tag.Eigenverbrauchsquote', 0);
createState('Kostal.Messwerte.Gesamt.Eigenverbrauchsquote', 0);
createState('Kostal.Messwerte.Tag.Ertrag', 0);
createState('Kostal.Messwerte.Gesamt.Ertrag', 0);
createState('Kostal.Messwerte.Tag.Hausverbrauch', 0);
createState('Kostal.Messwerte.Gesamt.Hausverbrauch', 0);
createState('Kostal.Messwerte.Momentan.Hausverbrauch', 0);
createState('Kostal.Messwerte.Momentan.Status');
//createState('Kostal.Messwerte.Momentan.Leistung_String1');
//createState('Kostal.Messwerte.Momentan.Leistung_String2');
createState('Kostal.Messwerte.Momentan.Ueberschuss');
createState('Kostal.Messwerte.Momentan.Abregelung');
createState('Kostal.Messwerte.Momentan.Batterie_SoC', 0);
createState('Kostal.Messwerte.Momentan.Batterie_Strom', 0);
//createState('Kostal.Messwerte.Momentan.Batterie_Richtung', 0);


var logging = false;
var request = require('request');

function Piko() {
    if (logging) log("Piko 6.0 BA auslesen");
    request(IPAnlage + '?dxsEntries=' + ID_DCEingangGesamt +
        '&dxsEntries=' + ID_Ausgangsleistung + '&dxsEntries=' + ID_Eigenverbrauch +
        '&dxsEntries=' + ID_Eigenverbrauch_d + '&dxsEntries=' + ID_Eigenverbrauch_G +
        '&dxsEntries=' + ID_Eigenverbrauchsquote_d + '&dxsEntries=' + ID_Eigenverbrauchsquote_G +
        '&dxsEntries=' + ID_Ertrag_d + '&dxsEntries=' + ID_Ertrag_G +
        '&dxsEntries=' + ID_Hausverbrauch_d + '&dxsEntries=' + ID_Hausverbrauch_G +
        '&dxsEntries=' + ID_Hausverbrauch + '&dxsEntries=' + ID_Autarkiegrad_G +
        '&dxsEntries=' + ID_Autarkiegrad_d + '&dxsEntries=' + ID_Betriebszeit +
        '&dxsEntries=' + ID_OperatingStatus + '&dxsEntries=' + ID_BatStateOfCharge +
        '&dxsEntries=' + ID_BatCurrent + '&dxsEntries=' + ID_BatCurrentDir +
        '&dxsEntries=' + ID_NetzAbregelung,

        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                if (logging) log(body);
                var result = JSON.parse(body).dxsEntries;
                setState('Kostal.Messwerte.Momentan.Leistung_DC', Math.round(result[0].value), true);
                setState('Kostal.Messwerte.Momentan.Leistung_AC', Math.round(result[1].value), true);
                setState('Kostal.Messwerte.Momentan.Eigenverbrauch', Math.round(result[2].value), true);
                setState('Kostal.Messwerte.Tag.Eigenverbrauch', Math.round(result[3].value) / 1000 + ' kWh', true);
                setState('Kostal.Messwerte.Gesamt.Eigenverbrauch', Math.round(result[4].value) + ' kWh', true);
                if (logging) log('Eigenverbrauch Gesamt: ' + Math.round(result[4].value) + ' kWh');
                setState('Kostal.Messwerte.Tag.Eigenverbrauchsquote', Math.round(result[5].value), true);
                setState('Kostal.Messwerte.Gesamt.Eigenverbrauchsquote', Math.round(result[6].value) + ' %', true);
                setState('Kostal.Messwerte.Tag.Ertrag', Math.round(result[7].value), true);
                setState('Kostal.Messwerte.Gesamt.Ertrag', Math.round(result[8].value) + ' kWh', true);
                setState('Kostal.Messwerte.Tag.Hausverbrauch', Math.round(result[9].value), true);
                setState('Kostal.Messwerte.Gesamt.Hausverbrauch', Math.round(result[10].value) + ' kWh', true);
                setState('Kostal.Messwerte.Momentan.Hausverbrauch', Math.floor(result[11].value), true);
                setState('Kostal.Messwerte.Gesamt.Autarkiegrad', Math.round(result[12].value), true);
                setState('Kostal.Messwerte.Tag.Autarkiegrad', Math.round(result[13].value), true);
                setState('Kostal.Messwerte.Gesamt.Betriebszeit', result[14].value + ' h', true);
                setState('Kostal.Messwerte.Momentan.Status', result[15].value, true);
                setState('Kostal.Messwerte.Momentan.Batterie_SoC', result[16].value, true);
                if (result[18].value) {
                    setState('Kostal.Messwerte.Momentan.Batterie_Strom', result[17].value, true);
                }     // result[18] = 'Kostal.Messwerte.Momentan.Batterie_Richtung'
                else {
                    setState('Kostal.Messwerte.Momentan.Batterie_Strom', -1 * result[17].value, true);
                }
                // setState('Kostal.Messwerte.Momentan.Ueberschuss',
                //    getState('Kostal.Messwerte.Momentan.Leistung_AC') - getState('Kostal.Messwerte.Gesamt.Eigenverbrauch'), true);
                setState('Kostal.Messwerte.Momentan.Ueberschuss', Math.round(result[1].value - result[2].value), true);
                setState('Kostal.Messwerte.Momentan.Abregelung', result[19].value, true);
            }
            else {
                log('Fehler: ' + error + ' bei Abfrage von Pico-BA: ' + IPAnlage, "warn");
            }
        });
}

//schedule("*/10 * 5-23 * * *", Piko);
schedule("*/10 * 0-23 * * *", Piko);


















'use strict';

const utils = require('@iobroker/adapter-core'); // Get common adapter utils
const ioBLib = require('@strathcole/iob-lib').ioBLib;
const plenticore = require('./lib/plenticore');
const weather = require('./lib/weather');

const packageJson = require('./package.json');
const adapterName = packageJson.name.split('.').pop();
const adapterVersion = packageJson.version;

let adapter;
var debugRequests;

let weatherTimer = null;

let reloginTimer = null;

const patchVersion = 'r223';

function startAdapter(options) {
	options = options || {};
	Object.assign(options, {
		name: 'plenticore'
	});

	adapter = new utils.Adapter(options);

	ioBLib.init(adapter);
	plenticore.init(adapter, utils, weather);

	adapter.on('unload', function (callback) {
		if (weatherTimer) {
			clearInterval(weatherTimer);
		}
		if (reloginTimer) {
			clearTimeout(reloginTimer);
		}
		weather.unload();
		plenticore.unload(function () {
			callback();
		});
	});

	adapter.on('stateChange', function (id, state) {
		// Warning, state can be null if it was deleted
		try {
			adapter.log.debug('stateChange ' + id + ' ' + JSON.stringify(state));

			if (!id) {
				return;
			}

			if (state && id.substr(0, adapter.namespace.length + 1) !== adapter.namespace + '.') {
				processStateChangeForeign(id, state);
				return;
			}
			id = id.substring(adapter.namespace.length + 1); // remove instance name and id

			if (state && state.ack) {
				processStateChangeAck(id, state);
				return;
			}

			if (state !== null) {
				state = state.val;
			}
			adapter.log.debug("id=" + id);

			if ('undefined' !== typeof state && null !== state) {
				processStateChange(id, state);
			}
		} catch (e) {
			adapter.log.info("Error processing stateChange: " + e);
		}
	});

	adapter.on('ready', function () {
		if (!adapter.config.ipaddress) {
			adapter.log.warn('[START] IP address not set');
		} else if (!adapter.config.password) {
			adapter.log.warn('[START] Password not set');
		} else {
			debugRequests = (adapter.config.debug ? true : false);
			adapter.log.info('[START] Starting adapter ' + adapterName + ' v' + adapterVersion + '' + patchVersion);

			adapter.setState('info.connection', true, true);
			adapter.getForeignObject('system.config', (err, obj) => {
				let runSetup = true;

				if (obj && obj.native && obj.native.secret) {
					//noinspection JSUnresolvedVariable
					adapter.config.password = ioBLib.decrypt(obj.native.secret, adapter.config.password);
				} else {
					//noinspection JSUnresolvedVariable
					adapter.config.password = ioBLib.decrypt('Zgfr56gFe87jJOM', adapter.config.password);
				}

				if (obj && obj.common) {
					adapter.config.iob_lon = obj.common.longitude;
					adapter.config.iob_lat = obj.common.latitude;
				}

				if (!adapter.config.iob_lon || !adapter.config.iob_lat) {
					adapter.log.error('Astro functions not available as system\'s longitude and latitude were not found. Please check ioBroker global system config.');
					adapter.terminate && adapter.terminate() || process.exit();
					return;
				}

				if (adapter.config.panel_tilt) {
					adapter.config.panel_tilt = parseInt(adapter.config.panel_tilt);
					adapter.log.debug('Panel tilt: ' + adapter.config.panel_tilt + '°');
				}
				if (adapter.config.panel_dir) {
					adapter.config.panel_dir = parseInt(adapter.config.panel_dir);
					adapter.log.debug('Panel direction: ' + adapter.config.panel_dir + '°');
				}
				if (adapter.config.panel_efficiency) {
					if (adapter.config.panel_efficiency.indexOf(',') > -1) {
						adapter.config.panel_efficiency = adapter.config.panel_efficiency.replace(',', '.');
					}
					adapter.config.panel_efficiency = parseFloat(adapter.config.panel_efficiency);
					adapter.log.debug('Panel efficiency: ' + adapter.config.panel_efficiency + '%');
				}
				if (adapter.config.panel_surface) {
					if (adapter.config.panel_surface.indexOf(',') > -1) {
						adapter.config.panel_surface = adapter.config.panel_surface.replace(',', '.');
					}
					adapter.config.panel_surface = parseFloat(adapter.config.panel_surface);
					adapter.log.debug('Panel surface: ' + adapter.config.panel_surface + 'm²');
				}

				if (adapter.config.panel_tilt_2) {
					adapter.config.panel_tilt_2 = parseInt(adapter.config.panel_tilt_2);
					adapter.log.debug('2nd Panel tilt: ' + adapter.config.panel_tilt_2 + '°');
				}
				if (adapter.config.panel_dir_2) {
					adapter.config.panel_dir_2 = parseInt(adapter.config.panel_dir_2);
					adapter.log.debug('2nd Panel direction: ' + adapter.config.panel_dir_2 + '°');
				}
				if (adapter.config.panel_efficiency_2) {
					if (adapter.config.panel_efficiency_2.indexOf(',') > -1) {
						adapter.config.panel_efficiency_2 = adapter.config.panel_efficiency_2.replace(',', '.');
					}
					adapter.config.panel_efficiency_2 = parseFloat(adapter.config.panel_efficiency_2);
					adapter.log.debug('2nd Panel efficiency: ' + adapter.config.panel_efficiency_2 + '%');
				}
				if (adapter.config.panel_surface_2) {
					if (adapter.config.panel_surface_2.indexOf(',') > -1) {
						adapter.config.panel_surface_2 = adapter.config.panel_surface_2.replace(',', '.');
					}
					adapter.config.panel_surface_2 = parseFloat(adapter.config.panel_surface_2);
					adapter.log.debug('2nd Panel surface: ' + adapter.config.panel_surface_2 + 'm²');
				}


				if (adapter.config.enable_minsoc && !adapter.config.battery_capacity) {
					adapter.log.warn('Could not enable dynamic MinSoC setting because no battery capacity was entered.');
					adapter.config.enable_minsoc = false;
				}

				if (adapter.config.enable_forecast) {
					if (!adapter.config.iob_lon || !adapter.config.iob_lat) {
						adapter.log.warn('Could not enable forecast because the system\'s longitude and latitude were not found. Please check system config.');
						adapter.config.enable_forecast = false;
					} else if (!adapter.config.panel_tilt && adapter.config.panel_tilt !== '0') {
						adapter.log.warn('Could not enable forecast because the panel tilt was not set.');
						adapter.config.enable_forecast = false;
					} else if (!adapter.config.panel_dir && adapter.config.panel_dir !== '0') {
						adapter.log.warn('Could not enable forecast because the panel orientation (azimuth) was not set.');
						adapter.config.enable_forecast = false;
					} else {
						runSetup = false;
						//adapter.log.warn('Enabling experimental support for Kachelmannwetter.');
						weather.init(adapter, function (err, res) {
							if (err) {
								adapter.log.warn('Kachelmannwetter lib failed to init.');
							}
							plenticore.setup(function () {
								main();
							});
						});
					}
				}

				if (runSetup === true) {
					plenticore.setup(function () {
						main();
					});
				}
			});
		}
	});

	return adapter;
}


function main() {

	adapter.log.debug('[START] Started Adapter with: ' + adapter.config.ipaddress);

	plenticore.login(function (error) {
		if (error) {
			adapter.log.warn('Failed starting plenticore adapter (login sequence failed). Trying again in 30 seconds.');
			if (reloginTimer) {
				clearTimeout(reloginTimer);
			}
			reloginTimer = setTimeout(function () {
				reloginTimer = null;
				main();
			}, 30000);
			return;
		}
		adapter.subscribeStates('*');

		if (adapter.config.enable_forecast) {
			adapter.log.info('Enabling forecast data.');
			plenticore.storeSunPanelData();
		} else {
			adapter.log.info('Not enabling forecast data.');
		}

		plenticore.calcPowerAverages();

		if (adapter.config.enable_forecast) {
			adapter.log.info('Enabling MinSoC forecast data.');
			weatherTimer = setInterval(function () {
				plenticore.calcMinSoC();
			}, 15 * 60 * 1000); // each 15 min

			let needed = 0;
			for (let weatherAdapter in plenticore.weatherAdapters) {
				needed++;
			}
			for (let weatherAdapter in plenticore.weatherAdapters) {
				adapter.getObjectView('system', 'instance', {
					startkey: 'system.adapter.' + weatherAdapter,
					endkey: 'system.adapter.' + weatherAdapter + '.\u9999'
				}, function (err, doc) {
					if (doc && doc.rows && doc.rows.length) {
						let adapter_id = doc.rows[0].id;
						adapter_id = adapter_id.replace(/^system\.adapter\./, '');
						adapter.log.info('Using ' + adapter_id + ' in weather forcast.');
						plenticore.weatherAdapters[weatherAdapter]['instance'] = adapter_id;
						adapter.subscribeForeignStates(adapter_id + '.*');
					}
					needed--;
					if (needed < 1) {
						plenticore.calcMinSoC();
					} else {
						adapter.log.info('Still ' + needed + ' adapters to check.');
					}
				});
			}
			if (needed < 1) {
				plenticore.calcMinSoC();
			} else {
				adapter.log.info('Still ' + needed + ' adapters to check.');
			}
		} else {
			adapter.log.info('Not enabling MinSoC forecast data.');
		}
	});
}

function processStateChangeAck(id, state) {
	if (id === 'devices.local.Home_P') {
		plenticore.updatePowerConsumption(state);
	} else if (id === 'devices.local.pv1.P' || id === 'devices.local.pv2.P' || id === 'devices.local.pv3.P') {
		plenticore.updatePowerProduction(state);
	} else if (id === 'devices.local.battery.P') {
		plenticore.updateBatteryCharging(state);
	}
}

function processStateChangeForeign(id, state) {
	let chkId;
	for (let weatherAdapter in plenticore.weatherAdapters) {
		chkId = plenticore.weatherAdapters[weatherAdapter]['fc_id'];
		chkId = chkId.replace('%%D%%', '1');
		chkId = chkId.replace('%%H%%', plenticore.weatherAdapters[weatherAdapter]['fc_min']);

		if (id === chkId + '.' + plenticore.weatherAdapters[weatherAdapter]['sky']
			|| (plenticore.weatherAdapters[weatherAdapter]['visibility'] !== null && id === chkId + '.' + plenticore.weatherAdapters[weatherAdapter]['visibility'])) {
			plenticore.calcMinSoC();
		}
	}
}

function processStateChange(id, value) {
	adapter.log.debug('StateChange: ' + JSON.stringify([id, value]));

	plenticore.changeSetting(id, value);
	return;
}


// If started as allInOne/compact mode => return function to create instance
if (module && module.parent) {
	module.exports = startAdapter;
} else {
	// or start the instance directly
	startAdapter();
} // endElse