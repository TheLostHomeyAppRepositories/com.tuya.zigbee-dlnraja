#!/usr/bin/env node

const { ZigBeeDriver } = require('homey-zigbeedriver');

class IkeaTemperature-892PlugDriver extends ZigBeeDriver {
    async onInit() {
        this.log('🚀 IkeaTemperature-892PlugDriver initialisé (mode intelligent)');
        
        // Configuration intelligente des capabilities
        this.registerCapability('onoff', 'genOnOff');
        
        // Configuration des clusters
        this.registerClusterCapability('genOnOff', 'onoff');
    }
}

module.exports = IkeaTemperature-892PlugDriver;