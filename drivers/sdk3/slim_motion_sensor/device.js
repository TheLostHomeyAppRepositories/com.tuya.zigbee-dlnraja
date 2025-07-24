﻿try {
'use strict';

const Homey = require('homey');
const { ZigBeeDevice } = require('homey-meshdriver');
const { debug, CLUSTER } = require('zigbee-clusters');

class SlimMotionSensor extends ZigbeeDevice {

	async 
    this.registerCapability('onoff', CLUSTER.ON_OFF);

		this.printNode();

		// alarm_motion
		zclNode.endpoints[1].clusters[CLUSTER.IAS_ZONE.NAME].onZoneStatusChangeNotification = payload => {
			this.onIASZoneStatusChangeNotification(payload);
		}
	}

	onIASZoneStatusChangeNotification({zoneStatus, extendedStatus, zoneId, delay,}) {
		this.log('IASZoneStatusChangeNotification received:', zoneStatus, extendedStatus, zoneId, delay);
		this.setCapabilityValue('alarm_motion', zoneStatus.alarm1).catch(this.error);
		this.setCapabilityValue('alarm_battery', zoneStatus.battery).catch(this.error);
	}

	onDeleted(){
		this.log("Slim motion sensor removed")
	}

}

module.exports = SlimMotionSensor;

} catch(e) { this.error('Driver error', e); }

