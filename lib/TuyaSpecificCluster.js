'use strict';

const { Cluster } = require('zigbee-clusters');

// Impl�mentation du cluster sp�cifique Tuya (0xEF00)
class TuyaSpecificCluster extends Cluster {
  
  static get ID() {
    return 0xEF00;
  }
  
  static get NAME() {
    return 'tuya';
  }
  
  // Commandes du cluster
  static get COMMANDS() {
    return {
      dataReport: {
        id: 0x01,
        args: {
          seq: Cluster.DataTypes.UINT8,
          dpId: Cluster.DataTypes.UINT8,
          dataType: Cluster.DataTypes.UINT8,
          data: Cluster.DataTypes.BUFFER,
        },
      },
      setData: {
        id: 0x00,
        args: {
          seq: Cluster.DataTypes.UINT8,
          dpId: Cluster.DataTypes.UINT8,
          dataType: Cluster.DataTypes.UINT8,
          data: Cluster.DataTypes.BUFFER,
        },
      },
    };
  }
  
  // M�thode pour envoyer des donn�es � l'appareil
  async setData(dpId, dataType, data) {
    const seq = this.getNextSeqNumber();
    
    await this.sendCommand('setData', {
      seq,
      dpId,
      dataType,
      data,
    });
    
    return seq;
  }
  
  // G�n�rateur de num�ro de s�quence
  getNextSeqNumber() {
    this._seq = (this._seq || 0) + 1;
    if (this._seq > 255) this._seq = 0;
    return this._seq;
  }
}

module.exports = TuyaSpecificCluster;
