<<<<<<< HEAD
﻿const { ZigBeeDevice } = require('homey-zigbeedriver');
class Driver extends ZigBeeDevice {
  async onNodeInit({ zclNode }) {
    await super.onNodeInit({ zclNode });
    // capability registration here
  }
}
module.exports = Driver;
=======
const { ZigbeeDevice } = require('homey-zigbeedriver');

class SensorTemp_TUYATEC_g3gl6cgy extends ZigbeeDevice {
  async onInit() {
    this.log('Sensor Temp TUYATEC-g3gl6cgy initialized');
    this.registerCapability('measure_temperature', 'msTemperatureMeasurement');
    this.registerCapability('measure_humidity', 'msRelativeHumidity');
    this.registerCapability('alarm_battery', 'genPowerCfg');
    // Ajoutez ici d'autres capacités si besoin
  }
}

module.exports = SensorTemp_TUYATEC_g3gl6cgy;


>>>>>>> master
