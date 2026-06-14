"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils = __importStar(require("@iobroker/adapter-core"));
const axios_1 = __importDefault(require("axios"));
const xml2js_1 = __importDefault(require("xml2js"));
const adapterTimeouts = {};
const ID_OperatingState = 16780032;
const ID_InverterType = 16780544;
const ID_InfoUIVersion = 16779267;
const ID_InverterName = 16777984;
const ID_StatDay_Yield = 251658754;
const ID_StatDay_HouseConsumption = 251659010;
const ID_StatDay_SelfConsumption = 251659266;
const ID_StatDay_SelfConsumptionRate = 251659278;
const ID_StatDay_Autarky = 251659279;
const ID_StatTot_OperatingTime = 251658496;
const ID_StatTot_Yield = 251658753;
const ID_StatTot_HouseConsumption = 251659009;
const ID_StatTot_SelfConsumption = 251659265;
const ID_StatTot_SelfConsumptionRate = 251659280;
const ID_StatTot_Autarky = 251659281;
const ID_Power_SolarDC = 33556736;
const ID_Power_DC1Current = 33555201;
const ID_Power_DC1Voltage = 33555202;
const ID_Power_DC1Power = 33555203;
const ID_Power_DC2Current = 33555457;
const ID_Power_DC2Voltage = 33555458;
const ID_Power_DC2Power = 33555459;
const ID_Power_DC3Current = 33555713;
const ID_Power_DC3Voltage = 33555714;
const ID_Power_DC3Power = 33555715;
const ID_Power_HouseConsumptionPhase1 = 83887106;
const ID_Power_HouseConsumptionPhase2 = 83887362;
const ID_Power_HouseConsumptionPhase3 = 83887618;
const ID_Power_HouseConsumption = 83887872;
const ID_Power_SelfConsumption = 83888128;
const ID_Power_GridAC = 67109120;
const ID_GridLimitation = 67110144;
const ID_L1GridCurrent = 67109377;
const ID_L1GridVoltage = 67109378;
const ID_L1GridPower = 67109379;
const ID_L2GridCurrent = 67109633;
const ID_L2GridVoltage = 67109634;
const ID_L2GridPower = 67109635;
const ID_L3GridCurrent = 67109889;
const ID_L3GridVoltage = 67109890;
const ID_L3GridPower = 67109891;
const ID_BatVoltage = 33556226;
const ID_BatTemperature = 33556227;
const ID_BatChargeCycles = 33556228;
const ID_BatStateOfCharge = 33556229;
const ID_BatCurrentDir = 33556230;
const ID_BatCurrent = 33556238;
const ID_InputAnalog1 = 167772417;
const ID_InputAnalog2 = 167772673;
const ID_InputAnalog3 = 167772929;
const ID_InputAnalog4 = 167773185;
let InverterType = "unknown";
let InverterAPIPiko = false;
let InverterAPIPikoMP = false;
let InverterUIVersion = "unknown";
let KostalRequestOnce = "";
let KostalRequest1 = "";
let KostalRequest2 = "";
let KostalRequestDay = "";
let KostalRequestTotal = "";
class KostalPikoBA extends utils.Adapter {
    constructor(options = {}) {
        super({
            ...options,
            name: "kostal-piko-ba",
        });
        this.on("ready", this.onReady.bind(this));
        this.on("unload", this.onUnload.bind(this));
    }
    resolveAfterXSeconds(x) {
        return new Promise(resolve => {
            this.setTimeout(() => {
                resolve(x);
            }, x * 1000);
        });
    }
    async onReady() {
        if (!this.config.ipaddress) {
            this.log.error(`Kostal Piko IP address not set`);
        }
        else {
            this.log.info(`IP address found in config: ${this.config.ipaddress}`);
            if (!/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(this.config.ipaddress)) {
                this.log.error(`You have entered an invalid IP address! ${this.config.ipaddress}`);
                this.log.info(`Stopping adapter`);
                await this.stop?.({ exitCode: 11, reason: `invalid config` });
            }
        }
        if (this.config.ipaddress) {
            KostalRequestOnce =
                `http://${this.config.ipaddress}/api/dxs.json` + `?dxsEntries=${ID_InverterType}&dxsEntries=${ID_InfoUIVersion}&dxsEntries=${ID_InverterName}`;
            await this.ReadPikoOnce();
            await this.resolveAfterXSeconds(5);
            this.log.debug(`Initial read of general info for inverter IP ${this.config.ipaddress} done`);
            if (!InverterAPIPiko && !InverterAPIPikoMP) {
                this.log.error(`Error in detecting Kostal inverter`);
                this.log.info(`Stopping adapter`);
                void this.stop;
            }
        }
        if (this.supportsFeature && this.supportsFeature("PLUGINS")) {
            const sentryInstance = this.getPluginInstance("sentry");
            const today = new Date();
            const last = await this.getStateAsync("LastSentryLogDay");
            if (last?.val != today.getDate()) {
                if (sentryInstance) {
                    const Sentry = sentryInstance.getSentryObject();
                    Sentry &&
                        Sentry.withScope((scope) => {
                            scope.setLevel("info");
                            scope.setTag("SentryDay", today.getDate());
                            scope.setTag("Inverter", this.config.ipaddress);
                            scope.setTag("Inverter-Type", InverterType);
                            scope.setTag("Inverter-UI", InverterUIVersion);
                            Sentry.captureMessage("Adapter kostal-piko-ba started", "info");
                        });
                }
                await this.setState("LastSentryLoggedError", { val: "unknown", ack: true });
                await this.setState("LastSentryLogDay", { val: today.getDate(), ack: true });
            }
        }
        if (!this.config.polltimelive) {
            this.config.polltimelive = 10000;
            this.log.warn(`Polltime not set or zero - will be set to ${this.config.polltimelive / 1000} seconds`);
        }
        if (this.config.polltimelive < 5000) {
            this.config.polltimelive = 5000;
            this.log.warn(`Polltime has to be minimum 5000 will be set to ${this.config.polltimelive / 1000} seconds`);
        }
        this.log.info(`Polltime set to: ${this.config.polltimelive / 1000} seconds`);
        if (!this.config.polltimedaily) {
            this.config.polltimedaily = 60000;
            this.log.warn(`Polltime daily statistics data not set or zero - will be set to ${this.config.polltimedaily / 1000} seconds`);
        }
        if (this.config.polltimedaily < this.config.polltimelive * 5) {
            this.config.polltimedaily = this.config.polltimelive * 5;
            this.log.warn(`Polltime daily statistics should be min. 5 times the standard poll - will be set to ${this.config.polltimedaily / 1000} seconds`);
        }
        this.log.info(`Polltime daily statistics set to: ${this.config.polltimedaily / 1000} seconds`);
        if (!this.config.polltimetotal) {
            this.config.polltimetotal = 200000;
            this.log.warn(`Polltime alltime statistics not set or zero - will be set to ${this.config.polltimetotal / 1000} seconds`);
        }
        if (this.config.polltimetotal < this.config.polltimedaily * 2) {
            this.config.polltimetotal = this.config.polltimedaily * 2;
            this.log.warn(`Polltime for all-time statistics should be at least double the daily statistics poll time - it will be set to ${this.config.polltimetotal / 1000} seconds`);
        }
        this.log.info(`Polltime for alltime statistics set to: ${this.config.polltimetotal / 1000} seconds`);
        if (this.config.ipaddress) {
            KostalRequest1 =
                `http://${this.config.ipaddress}/api/dxs.json` +
                    `?dxsEntries=${ID_Power_SolarDC}&dxsEntries=${ID_Power_GridAC}` +
                    `&dxsEntries=${ID_Power_DC1Power}&dxsEntries=${ID_Power_DC1Current}` +
                    `&dxsEntries=${ID_Power_DC1Voltage}&dxsEntries=${ID_Power_DC2Power}` +
                    `&dxsEntries=${ID_Power_DC2Current}&dxsEntries=${ID_Power_DC2Voltage}` +
                    `&dxsEntries=${ID_Power_DC3Power}&dxsEntries=${ID_Power_DC3Current}` +
                    `&dxsEntries=${ID_Power_DC3Voltage}` +
                    `&dxsEntries=${ID_Power_SelfConsumption}&dxsEntries=${ID_Power_HouseConsumption}` +
                    `&dxsEntries=${ID_OperatingState}&dxsEntries=${ID_BatVoltage}` +
                    `&dxsEntries=${ID_BatTemperature}&dxsEntries=${ID_BatStateOfCharge}` +
                    `&dxsEntries=${ID_BatCurrent}&dxsEntries=${ID_BatCurrentDir}` +
                    `&dxsEntries=${ID_GridLimitation}`;
            KostalRequest2 =
                `http://${this.config.ipaddress}/api/dxs.json` +
                    `?dxsEntries=${ID_L1GridCurrent}&dxsEntries=${ID_L1GridVoltage}` +
                    `&dxsEntries=${ID_L1GridPower}&dxsEntries=${ID_L2GridCurrent}` +
                    `&dxsEntries=${ID_L2GridVoltage}&dxsEntries=${ID_L2GridPower}` +
                    `&dxsEntries=${ID_L3GridCurrent}&dxsEntries=${ID_L3GridVoltage}` +
                    `&dxsEntries=${ID_L3GridPower}&dxsEntries=${ID_Power_HouseConsumptionPhase1}` +
                    `&dxsEntries=${ID_Power_HouseConsumptionPhase2}&dxsEntries=${ID_Power_HouseConsumptionPhase3}`;
            if (this.config.readanalogs) {
                KostalRequest2 =
                    `${KostalRequest2}` +
                        `&dxsEntries=${ID_InputAnalog1}&dxsEntries=${ID_InputAnalog2}` +
                        `&dxsEntries=${ID_InputAnalog3}&dxsEntries=${ID_InputAnalog4}`;
                if (this.config.normAn1Max != 10 || this.config.normAn1Min != 0) {
                    await this.extendObject("Inputs.Analog1", { common: { unit: "" } });
                }
                if (this.config.normAn2Max != 10 || this.config.normAn2Min != 0) {
                    await this.extendObject("Inputs.Analog2", { common: { unit: "" } });
                }
                if (this.config.normAn3Max != 10 || this.config.normAn3Min != 0) {
                    await this.extendObject("Inputs.Analog3", { common: { unit: "" } });
                }
                if (this.config.normAn4Max != 10 || this.config.normAn4Min != 0) {
                    await this.extendObject("Inputs.Analog4", { common: { unit: "" } });
                }
            }
            KostalRequestDay =
                `http://${this.config.ipaddress}/api/dxs.json` +
                    `?dxsEntries=${ID_StatDay_SelfConsumption}&dxsEntries=${ID_StatDay_SelfConsumptionRate}` +
                    `&dxsEntries=${ID_StatDay_Yield}&dxsEntries=${ID_StatDay_HouseConsumption}` +
                    `&dxsEntries=${ID_StatDay_Autarky}`;
            KostalRequestTotal =
                `http://${this.config.ipaddress}/api/dxs.json` +
                    `?dxsEntries=${ID_StatTot_SelfConsumption}&dxsEntries=${ID_StatTot_SelfConsumptionRate}` +
                    `&dxsEntries=${ID_StatTot_Yield}&dxsEntries=${ID_StatTot_HouseConsumption}` +
                    `&dxsEntries=${ID_StatTot_Autarky}&dxsEntries=${ID_StatTot_OperatingTime}`;
            if (this.config.readbattery) {
                KostalRequestTotal = `${KostalRequestTotal}&dxsEntries=${ID_BatChargeCycles}`;
            }
            this.log.debug(`OnReady done`);
            this.ReadPikoTotal();
            await this.resolveAfterXSeconds(3);
            this.ReadPikoDaily();
            await this.resolveAfterXSeconds(3);
            this.Scheduler();
            this.log.debug(`Initial ReadPiko done`);
        }
        else {
            this.log.error(`No IP address configured, adapter is shutting down`);
            void this.stop;
        }
    }
    onUnload(callback) {
        try {
            if (adapterTimeouts) {
                Object.keys(adapterTimeouts).forEach(timeout => {
                    if (adapterTimeouts[timeout]) {
                        clearTimeout(adapterTimeouts[timeout]);
                    }
                });
            }
            void this.setState("info.connection", { val: false, ack: true });
            this.log.info(`Adapter Kostal-Piko-BA cleaned up everything...`);
            callback();
        }
        catch (error) {
            this.log.error(`Error in onUnload adapter: ${String(error)}`);
            callback();
        }
    }
    Scheduler() {
        this.ReadPiko();
        this.ReadPiko2();
        try {
            this.clearTimeout(adapterTimeouts.live);
            adapterTimeouts.live = this.setTimeout(this.Scheduler.bind(this), this.config.polltimelive);
        }
        catch (error) {
            this.log.error(`Error in setting adapter schedule: ${String(error)}`);
            void this.restart;
        }
    }
    async ReadPikoOnce() {
        await axios_1.default
            .get(KostalRequestOnce, { transformResponse: r => r })
            .then(response => {
            if (!response.data) {
                throw new Error(`Empty answer from Piko.`);
            }
            this.log.debug(`Piko-BA general info updated - Kostal response data: ${response.data}`);
            const result = JSON.parse(response.data).dxsEntries;
            InverterType = result[0].value;
            void this.setState("Info.InverterType", { val: InverterType, ack: true });
            InverterAPIPiko = true;
            void this.setState("info.connection", { val: true, ack: true });
            InverterUIVersion = result[1].value;
            void this.setState("Info.InverterUIVersion", {
                val: InverterUIVersion,
                ack: true,
            });
            void this.setState("Info.InverterName", { val: result[2].value, ack: true });
        })
            .catch(error => {
            void this.HandleConnectionError(error, `Piko(-BA) API for general info`, `BA0`);
        });
        await this.resolveAfterXSeconds(2);
        if (InverterAPIPiko) {
            this.log.info(`Detected inverter type: ${InverterType}`);
        }
        else {
            this.log.warn(`Error in polling with Piko(-BA)-API: ${InverterType}`);
            this.log.info(`Trying to detect inverter with Piko-MP-API`);
        }
        if (!InverterAPIPiko) {
            axios_1.default
                .get(`http://${this.config.ipaddress}/versions.xml`, {
                transformResponse: r => r,
            })
                .then(response => {
                xml2js_1.default.parseString(response.data, (err, result) => {
                    if (err) {
                        this.log.error(`Error when calling Piko MP API with axios for general info: ${err}`);
                    }
                    else {
                        const MPType = result.root.Device[0].$.Name;
                        if (MPType) {
                            this.log.info(`Discovered Piko MP API, type of inverter: ${MPType}`);
                            InverterType = MPType;
                            void this.setState("Info.InverterType", {
                                val: InverterType,
                                ack: true,
                            });
                            InverterAPIPikoMP = true;
                            void this.setState("info.connection", { val: true, ack: true });
                            InverterUIVersion = "MP";
                            void this.setState("Info.InverterUIVersion", {
                                val: InverterUIVersion,
                                ack: true,
                            });
                            void this.setState("Info.InverterName", {
                                val: result.root.Device[0].$.NetBiosName,
                                ack: true,
                            });
                        }
                    }
                });
            })
                .catch(error => {
                void this.HandleConnectionError(error, `Piko MP API for general info`, `MP0`);
            });
        }
    }
    ReadPiko() {
        if (InverterAPIPiko) {
            axios_1.default
                .get(KostalRequest1, { timeout: 3500, transformResponse: r => r })
                .then(response => {
                this.log.debug(`Piko-BA live data 1 update - Kostal response data: ${response.data}`);
                if (!response.data) {
                    throw new Error(`Empty answer from Piko.`);
                }
                const result = JSON.parse(response.data).dxsEntries;
                if (result && result.length > 0) {
                    void this.setState("Power.SolarDC", {
                        val: result[0].value ? Math.round(result[0].value) : 0,
                        ack: true,
                    });
                    void this.setState("Power.GridAC", {
                        val: result[1].value ? Math.round(result[1].value) : 0,
                        ack: true,
                    });
                    void this.setState("Power.Surplus", {
                        val: result[1].value ? Math.round(result[1].value - result[11].value) : 0,
                        ack: true,
                    });
                    void this.setState("Power.DC1Power", {
                        val: result[4].value ? Math.round(result[2].value) : 0,
                        ack: true,
                    });
                    void this.setState("Power.DC1Current", {
                        val: result[4].value ? Math.round(1000 * result[3].value) / 1000 : 0,
                        ack: true,
                    });
                    void this.setState("Power.DC1Voltage", {
                        val: result[4].value ? Math.round(result[4].value) : 0,
                        ack: true,
                    });
                    void this.setState("Power.DC2Power", {
                        val: result[7].value ? Math.round(result[5].value) : 0,
                        ack: true,
                    });
                    void this.setState("Power.DC2Current", {
                        val: result[7].value ? Math.round(1000 * result[6].value) / 1000 : 0,
                        ack: true,
                    });
                    void this.setState("Power.DC2Voltage", {
                        val: result[7].value ? Math.round(result[7].value) : 0,
                        ack: true,
                    });
                    void this.setState("Power.DC3Power", {
                        val: result[10].value ? Math.round(result[8].value) : 0,
                        ack: true,
                    });
                    void this.setState("Power.DC3Current", {
                        val: result[10].value ? Math.round(1000 * result[9].value) / 1000 : 0,
                        ack: true,
                    });
                    void this.setState("Power.DC3Voltage", {
                        val: result[10].value ? Math.round(result[10].value) : 0,
                        ack: true,
                    });
                    void this.setState("Power.SelfConsumption", {
                        val: Math.round(result[11].value),
                        ack: true,
                    });
                    void this.setState("Power.HouseConsumption", {
                        val: Math.floor(result[12].value),
                        ack: true,
                    });
                    void this.setState("State", { val: result[13].value, ack: true });
                    switch (result[13].value) {
                        case 0:
                            void this.setState("StateAsString", { val: "OFF", ack: true });
                            break;
                        case 1:
                            void this.setState("StateAsString", { val: "Idling", ack: true });
                            break;
                        case 2:
                            void this.setState("StateAsString", {
                                val: "Start up, DC voltage still too low for feed-in",
                                ack: true,
                            });
                            break;
                        case 3:
                            void this.setState("StateAsString", {
                                val: "Feeding (MPP)",
                                ack: true,
                            });
                            break;
                        case 4:
                            void this.setState("StateAsString", {
                                val: "Feeding (limited)",
                                ack: true,
                            });
                            break;
                        default:
                            void this.setState("StateAsString", { val: "Undefined", ack: true });
                    }
                    if (result[14].value) {
                        void this.setState("Battery.Voltage", {
                            val: Math.round(result[14].value),
                            ack: true,
                        });
                        void this.setState("Battery.Temperature", {
                            val: Math.round(10 * result[15].value) / 10,
                            ack: true,
                        });
                        void this.setState("Battery.SoC", {
                            val: result[16].value,
                            ack: true,
                        });
                        if (result[18].value) {
                            void this.setState("Battery.Current", {
                                val: result[17].value,
                                ack: true,
                            });
                            void this.setState("Battery.Power", {
                                val: Math.round(result[14].value * result[17].value),
                                ack: true,
                            });
                        }
                        else {
                            void this.setState("Battery.Current", {
                                val: result[17].value * -1,
                                ack: true,
                            });
                            void this.setState("Battery.Power", {
                                val: Math.round(result[14].value * result[17].value * -1),
                                ack: true,
                            });
                        }
                    }
                }
                else {
                    this.log.error(`Got no answer from inverter, please verify IP address: ${this.config.ipaddress} !! (e1.1)`);
                }
                void this.setState("GridLimitation", {
                    val: result.length >= 20 ? result[19].value : 100,
                    ack: true,
                });
            })
                .catch(error => {
                void this.HandleConnectionError(error, `Piko(-BA) API for live data`, `BA1`);
            });
        }
        if (InverterAPIPikoMP) {
            axios_1.default
                .get(`http://${this.config.ipaddress}/measurements.xml`, {
                transformResponse: r => r,
            })
                .then(response => {
                xml2js_1.default.parseString(response.data, (err, result) => {
                    if (err) {
                        this.log.error(`Error when calling Piko MP API with axios for measurements info: ${err}`);
                    }
                    else {
                        const measurements = result?.root.Device[0].Measurements[0].Measurement;
                        const DC_Voltage = measurements?.find(measurement => measurement.$.Type === "DC_Voltage");
                        if (DC_Voltage && DC_Voltage.$) {
                            void this.setState("Power.DC1Voltage", {
                                val: Math.round(DC_Voltage.$.Value),
                                ack: true,
                            });
                        }
                        else {
                            const DC_Voltage1 = measurements.find(measurement => measurement.$.Type === "DC_Voltage1");
                            const DC_Voltage2 = measurements.find(measurement => measurement.$.Type === "DC_Voltage2");
                            if (DC_Voltage1 && DC_Voltage1.$) {
                                void this.setState("Power.DC1Voltage", {
                                    val: Math.round(DC_Voltage1.$.Value),
                                    ack: true,
                                });
                            }
                            if (DC_Voltage2 && DC_Voltage2.$) {
                                void this.setState("Power.DC2Voltage", {
                                    val: Math.round(DC_Voltage2.$.Value),
                                    ack: true,
                                });
                            }
                        }
                        const DC_Current = measurements.find(measurement => measurement.$.Type === "DC_Current");
                        if (DC_Current && DC_Current.$) {
                            void this.setState("Power.DC1Current", {
                                val: Math.round(1000 * DC_Current.$.Value) / 1000,
                                ack: true,
                            });
                        }
                        else {
                            const DC_Current1 = measurements.find(measurement => measurement.$.Type === "DC_Current1");
                            const DC_Current2 = measurements.find(measurement => measurement.$.Type === "DC_Current2");
                            if (DC_Current1 && DC_Current1.$) {
                                void this.setState("Power.DC1Current", {
                                    val: Math.round(1000 * DC_Current1.$.Value) / 1000,
                                    ack: true,
                                });
                            }
                            if (DC_Current2 && DC_Current2.$) {
                                void this.setState("Power.DC2Current", {
                                    val: Math.round(1000 * DC_Current2.$.Value) / 1000,
                                    ack: true,
                                });
                            }
                        }
                        if (DC_Current && DC_Voltage) {
                            void this.setState("Power.DC1Power", {
                                val: Math.round(DC_Voltage.$.Value * DC_Current.$.Value),
                                ack: true,
                            });
                        }
                        else {
                            const DC_Power1 = measurements.find(measurement => measurement.$.Type === "DC_Power1");
                            const DC_Power2 = measurements.find(measurement => measurement.$.Type === "DC_Power2");
                            if (DC_Power1 && DC_Power1.$) {
                                void this.setState("Power.DC1Power", {
                                    val: Math.round(DC_Power1.$.Value),
                                    ack: true,
                                });
                            }
                            if (DC_Power2 && DC_Power2.$) {
                                void this.setState("Power.DC2Power", {
                                    val: Math.round(DC_Power2.$.Value),
                                    ack: true,
                                });
                            }
                        }
                        const AC_Voltage = measurements.find(measurement => measurement.$.Type === "AC_Voltage");
                        if (AC_Voltage && AC_Voltage.$) {
                            void this.setState("Power.AC1Voltage", {
                                val: Math.round(AC_Voltage.$.Value),
                                ack: true,
                            });
                        }
                        const AC_Current = measurements.find(measurement => measurement.$.Type === "AC_Current");
                        if (AC_Current && AC_Current.$) {
                            void this.setState("Power.AC1Current", {
                                val: Math.round(1000 * AC_Current.$.Value) / 1000,
                                ack: true,
                            });
                        }
                        const AC_Power = measurements.find(measurement => measurement.$.Type === "AC_Power");
                        if (AC_Power && AC_Power.$) {
                            void this.setState("Power.AC1Power", {
                                val: Math.round(AC_Power.$.Value),
                                ack: true,
                            });
                        }
                    }
                });
            })
                .catch(error => {
                void this.HandleConnectionError(error, `Piko MP API for live data`, `MP1`);
            });
        }
    }
    ReadPiko2() {
        if (InverterAPIPiko) {
            axios_1.default
                .get(KostalRequest2, { timeout: 3500, transformResponse: r => r })
                .then(response => {
                this.log.debug(`Piko-BA live data 2 update - Kostal response data: ${response.data}`);
                if (!response.data) {
                    throw new Error(`Empty answer from Piko.`);
                }
                const result = JSON.parse(response.data).dxsEntries;
                void this.setState("Power.AC1Current", {
                    val: result[1].value ? Math.round(1000 * result[0].value) / 1000 : 0,
                    ack: true,
                });
                void this.setState("Power.AC1Voltage", {
                    val: result[1].value ? Math.round(result[1].value) : 0,
                    ack: true,
                });
                void this.setState("Power.AC1Power", {
                    val: result[1].value ? Math.round(result[2].value) : 0,
                    ack: true,
                });
                void this.setState("Power.AC2Current", {
                    val: result[4].value ? Math.round(1000 * result[3].value) / 1000 : 0,
                    ack: true,
                });
                void this.setState("Power.AC2Voltage", {
                    val: result[4].value ? Math.round(result[4].value) : 0,
                    ack: true,
                });
                void this.setState("Power.AC2Power", {
                    val: result[4].value ? Math.round(result[5].value) : 0,
                    ack: true,
                });
                void this.setState("Power.AC3Current", {
                    val: result[7].value ? Math.round(1000 * result[6].value) / 1000 : 0,
                    ack: true,
                });
                void this.setState("Power.AC3Voltage", {
                    val: result[7].value ? Math.round(result[7].value) : 0,
                    ack: true,
                });
                void this.setState("Power.AC3Power", {
                    val: result[7].value ? Math.round(result[8].value) : 0,
                    ack: true,
                });
                if (result[9].value) {
                    void this.setState("Power.HouseConsumptionPhase1", {
                        val: Math.round(result[9].value),
                        ack: true,
                    });
                    void this.setState("Power.HouseConsumptionPhase2", {
                        val: Math.round(result[10].value),
                        ack: true,
                    });
                    void this.setState("Power.HouseConsumptionPhase3", {
                        val: Math.round(result[11].value),
                        ack: true,
                    });
                }
                if (this.config.readanalogs) {
                    void this.setState("Inputs.Analog1", {
                        val: Math.round(100 * ((result[12].value / 10) * (this.config.normAn1Max - this.config.normAn1Min) + this.config.normAn1Min)) / 100,
                        ack: true,
                    });
                    void this.setState("Inputs.Analog2", {
                        val: Math.round(100 * ((result[13].value / 10) * (this.config.normAn2Max - this.config.normAn2Min) + this.config.normAn2Min)) / 100,
                        ack: true,
                    });
                    void this.setState("Inputs.Analog3", {
                        val: Math.round(100 * ((result[14].value / 10) * (this.config.normAn3Max - this.config.normAn3Min) + this.config.normAn3Min)) / 100,
                        ack: true,
                    });
                    void this.setState("Inputs.Analog4", {
                        val: Math.round(100 * ((result[15].value / 10) * (this.config.normAn4Max - this.config.normAn4Min) + this.config.normAn4Min)) / 100,
                        ack: true,
                    });
                }
            })
                .catch(error => {
                void this.HandleConnectionError(error, `Piko(-BA) API for live data`, `BA2`);
            });
        }
        if (InverterAPIPikoMP) {
        }
    }
    ReadPikoDaily() {
        if (InverterAPIPiko) {
            axios_1.default
                .get(KostalRequestDay, { transformResponse: r => r })
                .then(response => {
                this.log.debug(`Piko-BA daily statistics update - Kostal response data: ${response.data}`);
                if (!response.data) {
                    throw new Error(`Empty answer from Piko.`);
                }
                const result = JSON.parse(response.data).dxsEntries;
                void this.setState("Statistics_Daily.SelfConsumption", {
                    val: Math.round(result[0].value) / 1000,
                    ack: true,
                });
                void this.setState("Statistics_Daily.SelfConsumptionRate", {
                    val: Math.round(result[1].value),
                    ack: true,
                });
                void this.setState("Statistics_Daily.Yield", {
                    val: Math.round(result[2].value) / 1000,
                    ack: true,
                });
                void this.setState("Statistics_Daily.HouseConsumption", {
                    val: Math.round(result[3].value) / 1000,
                    ack: true,
                });
                void this.setState("Statistics_Daily.Autarky", {
                    val: Math.round(result[4].value),
                    ack: true,
                });
            })
                .catch(error => {
                void this.HandleConnectionError(error, `Piko(-BA) API for daily statistics`, `BA3`);
            });
        }
        if (InverterAPIPikoMP) {
        }
        try {
            this.clearTimeout(adapterTimeouts.daily);
            adapterTimeouts.daily = this.setTimeout(this.ReadPikoDaily.bind(this), this.config.polltimedaily);
        }
        catch (error) {
            this.log.error(`Error in setting adapter schedule for daily statistics: ${String(error)}`);
        }
    }
    ReadPikoTotal() {
        if (InverterAPIPiko) {
            axios_1.default
                .get(KostalRequestTotal, { transformResponse: r => r })
                .then(response => {
                this.log.debug(`Piko-BA lifetime statistics updated - Kostal response data: ${response.data}`);
                if (!response.data) {
                    throw new Error(`Empty answer from Piko.`);
                }
                const result = JSON.parse(response.data).dxsEntries;
                void this.setState("Statistics_Total.SelfConsumption", {
                    val: Math.round(result[0].value),
                    ack: true,
                });
                void this.setState("Statistics_Total.SelfConsumptionRate", {
                    val: Math.round(result[1].value),
                    ack: true,
                });
                void this.setState("Statistics_Total.Yield", {
                    val: Math.round(result[2].value),
                    ack: true,
                });
                void this.setState("Statistics_Total.HouseConsumption", {
                    val: Math.round(result[3].value),
                    ack: true,
                });
                void this.setState("Statistics_Total.Autarky", {
                    val: Math.round(result[4].value),
                    ack: true,
                });
                void this.setState("Statistics_Total.OperatingTime", {
                    val: result[5].value,
                    ack: true,
                });
                if (this.config.readbattery) {
                    void this.setState("Battery.ChargeCycles", {
                        val: result[6].value,
                        ack: true,
                    });
                }
            })
                .catch(error => {
                void this.HandleConnectionError(error, `Piko-(BA) API for total statistics`, `BA4`);
            });
        }
        if (InverterAPIPikoMP) {
            axios_1.default
                .get(`http://${this.config.ipaddress}/yields.xml`, {
                transformResponse: r => r,
            })
                .then(response => {
                xml2js_1.default.parseString(response.data, (err, result) => {
                    if (err) {
                        this.log.error(`Error when calling Piko MP API with axios for measurements info: ${err}`);
                    }
                    else {
                        const yields = result.root.Device[0].Yields[0].Yield;
                        const yieldProduced = yields?.find(oyield => oyield.$.Type === "Produced");
                        if (yieldProduced && yieldProduced.$) {
                            if (yieldProduced.$.Slot === "Total") {
                                const yieldProducedValue = yieldProduced.YieldValue?.[0]?.$?.Value;
                                if (yieldProducedValue !== undefined) {
                                    void this.setState("Statistics_Total.Yield", {
                                        val: Math.round(yieldProducedValue / 1000),
                                        ack: true,
                                    });
                                }
                            }
                            else {
                                this.log.warn(`total yield produced value not found`);
                            }
                        }
                        else {
                            this.log.warn(`total yield produced field not found`);
                        }
                    }
                });
            })
                .catch(error => {
                void this.HandleConnectionError(error, `Piko MP API for total statistics`, `MP4`);
            });
        }
        try {
            this.clearTimeout(adapterTimeouts.total);
            adapterTimeouts.total = this.setTimeout(this.ReadPikoTotal.bind(this), this.config.polltimetotal);
        }
        catch (error) {
            this.log.error(`Error in setting adapter schedule for total statistics: ${String(error)}`);
        }
    }
    async HandleConnectionError(stError, sOccasion, sErrorOccInt) {
        if (stError.response) {
            switch (stError.response.status) {
                case 401:
                    this.log.error(`The Inverter request has not been completed because it lacks valid authentication credentials.`);
                    this.log.error(`HTTP error 401 when calling ${sOccasion}!! (e${sErrorOccInt}.0)`);
                    this.log.warn(`Authenticated access is not supported so far by Kostal Adapter`);
                    this.log.warn(`Please provide feedback in GitHub to get this done`);
                    this.log.error(`Adapter is shutting down`);
                    void this.stop;
                    break;
                default:
                    this.log.error(`HTTP error ${stError.response.status} when polling ${sOccasion}!! (e${sErrorOccInt}.1)`);
            }
        }
        else if (stError.code) {
            switch (stError.code) {
                case "ETIMEDOUT":
                    this.log.warn(`Connection timeout error when calling ${sOccasion}`);
                    this.log.warn(`Please verify the IP address: ${this.config.ipaddress} !! (e${sErrorOccInt}.2)`);
                    break;
                case "EHOSTUNREACH":
                    this.log.warn(`Inverter not reachable error when calling ${sOccasion}`);
                    this.log.warn(`Please verify the IP address: ${this.config.ipaddress} !! (e${sErrorOccInt}.2)`);
                    break;
                case "ENETUNREACH":
                    this.log.warn(`Inverter network not reachable error when calling ${sOccasion}`);
                    this.log.warn(`Please verify the IP address: ${this.config.ipaddress} !! (e${sErrorOccInt}.2)`);
                    break;
            }
        }
        else {
            this.log.error(`Unknown error when calling ${sOccasion}: ${stError.message}`);
            this.log.error(`Please verify IP address: ${this.config.ipaddress} !! (e${sErrorOccInt}.3)`);
            if (this.supportsFeature && this.supportsFeature("PLUGINS")) {
                const sentryInstance = this.getPluginInstance("sentry");
                if (sentryInstance) {
                    const oldError = await this.getStateAsync("LastSentryLoggedError");
                    if (oldError?.val != stError.message) {
                        const Sentry = sentryInstance.getSentryObject();
                        const date = new Date();
                        Sentry &&
                            Sentry.withScope((scope) => {
                                scope.setLevel("info");
                                scope.setTag("Inverter", this.config.ipaddress);
                                scope.setTag("Inverter-Type", InverterType);
                                scope.setTag("Inverter-UI", InverterUIVersion);
                                scope.setTag("Hour of event", date.getHours());
                                Sentry.captureMessage(`Catched error: ${stError.message}`, "info");
                            });
                        void this.setState("LastSentryLoggedError", {
                            val: stError.message,
                            ack: true,
                        });
                    }
                }
            }
        }
    }
}
if (require.main !== module) {
    module.exports = (options) => new KostalPikoBA(options);
}
else {
    (() => new KostalPikoBA())();
}
//# sourceMappingURL=main.js.map