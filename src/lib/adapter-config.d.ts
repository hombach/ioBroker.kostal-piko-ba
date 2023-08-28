// This file extends the AdapterConfig type from "@types/iobroker"

// Augment the globally declared type ioBroker.AdapterConfig
declare global {
    namespace ioBroker {
        interface AdapterConfig {
            ipaddress: string = "",
            polltimelive: number = 10000,
            polltimedaily: number = 60000,
            polltimetotal: number = 200000,
            readanalogs: boolean = false,
            readbattery: boolean = true,
            normAn1Max: number = 10,
            normAn1Min: number = 0,
            normAn2Max: number = 10,
            normAn2Min: number = 0,
            normAn3Max: number = 10,
            normAn3Min: number = 0,
            normAn4Max: number = 10,
            normAn4Min: number = 0
        }
    }
}

// this is required so the above AdapterConfig is found by TypeScript / type checking
export {};