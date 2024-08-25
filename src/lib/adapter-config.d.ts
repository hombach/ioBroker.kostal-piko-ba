// This file extends the AdapterConfig type from "@types/iobroker"
// using the actual properties present in io-package.json
// in order to provide typings for adapter.config properties

import { native } from '../io-package.json';

type _AdapterConfig = typeof native;

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
