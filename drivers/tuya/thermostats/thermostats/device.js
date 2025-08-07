'use strict';const { ZigbeeDevice } = require('homey-meshdriver');class Device extends ZigbeeDevice { async onInit() { await super.onInit(); this.log(' device initialized'); this.log('Source: D:\Download\Compressed\com.tuya.zigbee-SDK3_2\com.tuya.zigbee-SDK3\.homeycompose\capabilities\thermostat_programming.json'); this.log('Original file: thermostat_programming.json'); // Register capabilities } 
    async onMeshInit() {
        this.log('tuya/thermostats/thermostats - Device initialized');
        
        // Register capabilities
        await this.registerCapability('onoff', 'genOnOff');
        
        this.log('✅ tuya/thermostats/thermostats - Device ready');
    }
}

module.exports = Device;