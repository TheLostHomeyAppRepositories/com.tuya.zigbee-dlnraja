'use strict';

const { ZigBeeDevice } = require('homey-zigbeedriver');

class models_ts0505a_light_standardDriver extends ZigBeeDevice {
  async onNodeInit({ zclNode }) {
    // TODO: Implémenter la logique du driver
  }
}

module.exports = models_ts0505a_light_standardDriver;