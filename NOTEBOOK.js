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

//___ >>> noch für io - package:

 //"createState('Kostal.Messwerte.Momentan.Leistung_DC'
 //"createState('Kostal.Messwerte.Momentan.Eigenverbrauch'
 //"createState('Kostal.Messwerte.Momentan.Hausverbrauch'
 //"createState('Kostal.Messwerte.Momentan.Status'
 //NOcreateState('Kostal.Messwerte.Momentan.Leistung_String1'
 //NOcreateState('Kostal.Messwerte.Momentan.Leistung_String2'
 //"createState('Kostal.Messwerte.Momentan.Ueberschuss'
 //"createState('Kostal.Messwerte.Momentan.Abregelung'
 //"createState('Kostal.Messwerte.Momentan.Batterie_SoC'
 //"createState('Kostal.Messwerte.Momentan.Batterie_Strom'
 //NOcreateState('Kostal.Messwerte.Momentan.Batterie_Richtung'


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