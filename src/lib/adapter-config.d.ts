// This file extends the AdapterConfig type from "@types/iobroker"
import { native } from '../io-package.json';

// Augment the globally declared type ioBroker.AdapterConfig
declare global {
	namespace ioBroker {
		interface AdapterConfig {
			ipaddress: string;
            polltimelive: number;
            polltimedaily: number;
            polltimetotal: number;
            readanalogs: boolean;
            normAn1Min: number;
            normAn1Max: number;
            normAn2Min: number;
            normAn2Max: number;
            normAn3Min: number;
            normAn3Max: number;
            normAn4Min: number;
            normAn4Max: number;
            readbattery: boolean;
		}
	}
}

// this is required so the above AdapterConfig is found by TypeScript / type checking
export {};
