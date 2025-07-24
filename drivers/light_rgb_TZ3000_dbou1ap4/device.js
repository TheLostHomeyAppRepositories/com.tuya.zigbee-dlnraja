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

class LightRGB_TZ3000_dbou1ap4 extends ZigbeeDevice {
  async onInit() {
    this.log('RGB Light TZ3000_dbou1ap4 initialized');
    this.registerCapability('onoff', 'genOnOff');
    this.registerCapability('dim', 'genLevelCtrl');
    this.registerCapability('light_hue', 'lightingColorCtrl');
    this.registerCapability('light_saturation', 'lightingColorCtrl');
    this.registerCapability('light_temperature', 'lightingColorCtrl');
    // Ajoutez ici d'autres capacités si besoin
  }
}

module.exports = LightRGB_TZ3000_dbou1ap4;


>>>>>>> master
