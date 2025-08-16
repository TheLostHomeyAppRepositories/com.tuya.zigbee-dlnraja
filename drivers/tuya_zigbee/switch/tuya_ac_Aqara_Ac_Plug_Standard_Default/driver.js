#!/usr/bin/env node
'use strict';

#!/usr/bin/env node

const { ZigBeeDriver } = require('homey-zigbeedriver');

class TuyaAcAqaraAcPlugStandardDefaultDriver extends ZigBeeDriver {
    async onInit() {
        this.log('🚀 TuyaAcAqaraAcPlugStandardDefaultDriver initialisé (mode intelligent)');
        
        // Configuration intelligente des capabilities
        this.registerCapability('onoff', 'genOnOff');
        
        // Configuration des clusters
        this.registerClusterCapability('genOnOff', 'onoff');
    }
}

module.exports = TuyaAcAqaraAcPlugStandardDefaultDriver;