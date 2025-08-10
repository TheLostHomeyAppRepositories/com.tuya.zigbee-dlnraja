'use strict';

const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const { spawnSync } = require('child_process');

const CONFIG = {
  DRIVERS_DIR: 'drivers',
  TMP_DIR: '.tmp_tuya_zip_work',
  MAX_RETRIES: 5,
  RETRY_DELAY: 1000,
  // Catégories inspirées de .tmp*
  DRIVER_CATEGORIES: {
    LIGHT: ['light', 'bulb', 'lamp', 'led', 'strip', 'ceiling', 'lighting', 'lights'],
    PLUG: ['plug', 'outlet', 'socket', 'plugs'],
    SWITCH: ['switch', 'button', 'remote', 'switches'],
    SENSOR_MOTION: ['motion', 'presence', 'sensors'],
    SENSOR_CONTACT: ['contact', 'door', 'window'],
    SENSOR_TEMP: ['temp', 'temperature', 'thermostat', 'climate'],
    SENSOR_HUMIDITY: ['humidity', 'hum'],
    SENSOR_LUX: ['lux', 'light', 'brightness'],
    SENSOR_SMOKE: ['smoke', 'fire'],
    SENSOR_LEAK: ['leak', 'water'],
    METER_POWER: ['meter', 'power', 'energy'],
    COVER: ['cover', 'curtain', 'blind', 'covers'],
    LOCK: ['lock', 'locks'],
    SIREN: ['siren', 'alarm'],
    REMOTE: ['remote', 'controller', 'controllers'],
    SCENE: ['scene', 'automation'],
    VALVE: ['valve', 'water'],
    OTHER: ['other', 'generic', 'misc']
  },
  // Vendors prioritaires
  VENDOR_PRIORITY: ['tuya', 'aqara', 'ikea', 'philips', 'sonoff', 'ledvance', 'generic']
};

function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const prefix = type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️';
  console.log(`[${timestamp}] ${prefix} ${message}`);
}

function echo() {
  console.log('\n');
}

// Fonction pour forcer le renommage avec retry et gestion d'erreurs
async function forceRename(oldPath, newPath, retries = CONFIG.MAX_RETRIES) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      // Vérifier si le dossier de destination existe déjà
      if (fs.existsSync(newPath)) {
        log(`📁 Dossier de destination existe déjà: ${newPath}`, 'warning');
        // Fusionner le contenu
        await mergeDirectories(oldPath, newPath);
        // Supprimer l'ancien dossier
        await forceRemove(oldPath);
        return { success: true, method: 'merge' };
      }
      
      // Tentative de renommage
      await fsp.rename(oldPath, newPath);
      log(`✅ Renommage réussi: ${path.basename(oldPath)} → ${path.basename(newPath)}`);
      return { success: true, method: 'rename' };
    } catch (error) {
      if (error.code === 'EPERM' || error.code === 'EACCES') {
        log(`⚠️  Erreur de permission (tentative ${attempt}/${retries}): ${error.message}`, 'warning');
        
        if (attempt < retries) {
          // Attendre avant de réessayer
          await new Promise(resolve => setTimeout(resolve, CONFIG.RETRY_DELAY * attempt));
          
          // Essayer de forcer la libération des handles
          try {
            if (process.platform === 'win32') {
              // Sur Windows, essayer de forcer la libération
              spawnSync('taskkill', ['/f', '/im', 'node.exe'], { stdio: 'ignore' });
            }
          } catch (killError) {
            // Ignorer les erreurs de kill
          }
          continue;
        }
      }
      
      // Si c'est la dernière tentative ou une autre erreur
      log(`❌ Échec du renommage après ${retries} tentatives: ${error.message}`, 'error');
      return { success: false, error: error.message };
    }
  }
  return { success: false, error: 'Nombre maximum de tentatives atteint' };
}

// Fonction pour forcer la suppression
async function forceRemove(pathToRemove, retries = CONFIG.MAX_RETRIES) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      if (fs.existsSync(pathToRemove)) {
        await fsp.rm(pathToRemove, { recursive: true, force: true });
        log(`✅ Suppression réussie: ${path.basename(pathToRemove)}`);
        return true;
      }
      return true;
    } catch (error) {
      if (attempt < retries) {
        log(`⚠️  Erreur de suppression (tentative ${attempt}/${retries}): ${error.message}`, 'warning');
        await new Promise(resolve => setTimeout(resolve, CONFIG.RETRY_DELAY));
        continue;
      }
      log(`❌ Échec de la suppression: ${error.message}`, 'error');
      return false;
    }
  }
  return false;
}

// Fonction pour fusionner deux dossiers
async function mergeDirectories(sourcePath, targetPath) {
  try {
    const sourceItems = await fsp.readdir(sourcePath);
    
    for (const item of sourceItems) {
      const sourceItemPath = path.join(sourcePath, item);
      const targetItemPath = path.join(targetPath, item);
      
      const sourceStats = await fsp.stat(sourceItemPath);
      
      if (sourceStats.isDirectory()) {
        if (!fs.existsSync(targetItemPath)) {
          await fsp.mkdir(targetItemPath, { recursive: true });
        }
        await mergeDirectories(sourceItemPath, targetItemPath);
      } else {
        // Pour les fichiers, copier s'ils n'existent pas ou s'ils sont plus récents
        if (!fs.existsSync(targetItemPath) || 
            (await fsp.stat(targetItemPath)).mtime < sourceStats.mtime) {
          await fsp.copyFile(sourceItemPath, targetItemPath);
        }
      }
    }
    
    log(`🔄 Fusion réussie: ${path.basename(sourcePath)} → ${path.basename(targetPath)}`);
  } catch (error) {
    log(`❌ Erreur lors de la fusion: ${error.message}`, 'error');
    throw error;
  }
}

// Fonction pour déterminer la catégorie d'un driver
function getDriverCategory(driverName, capabilities = []) {
  const name = driverName.toLowerCase();
  const caps = capabilities.map(c => c.toLowerCase());
  
  for (const [category, keywords] of Object.entries(CONFIG.DRIVER_CATEGORIES)) {
    for (const keyword of keywords) {
      if (name.includes(keyword) || caps.some(cap => cap.includes(keyword))) {
        return category.toLowerCase().replace('_', '-');
      }
    }
  }
  
  return 'other';
}

// Fonction pour déterminer le vendor d'un driver
function getDriverVendor(manufacturerName = []) {
  const names = manufacturerName.map(n => n.toLowerCase());
  
  for (const vendor of CONFIG.VENDOR_PRIORITY) {
    if (names.some(name => name.includes(vendor))) {
      return vendor;
    }
  }
  
  return 'generic';
}

// Fonction pour générer un nom de dossier cohérent
function generateDriverFolderName(driverName, manufacturerName = [], modelId = [], capabilities = []) {
  const vendor = getDriverVendor(manufacturerName);
  const category = getDriverCategory(driverName, capabilities);
  
  // Nettoyer le nom du modèle
  let model = 'unknown';
  if (modelId.length > 0) {
    model = modelId[0].toLowerCase()
      .replace(/[^a-z0-9._-]/g, '')
      .substring(0, 20);
  }
  
  // Nettoyer le nom du driver
  const cleanDriverName = driverName.toLowerCase()
    .replace(/[^a-z0-9._-]/g, '')
    .substring(0, 30);
  
  return `${vendor}-${category}-${model || cleanDriverName}`;
}

// Fonction principale de réorganisation
async function reorganizeDrivers() {
  log('🚀 RÉORGANISATION FORCÉE DES DRIVERS AVEC INSPIRATION .tmp*...');
  echo();
  
  const driversDir = path.join(process.cwd(), CONFIG.DRIVERS_DIR);
  if (!fs.existsSync(driversDir)) {
    log(`❌ Dossier drivers non trouvé: ${driversDir}`, 'error');
    return false;
  }
  
  // Analyser la structure actuelle
  const drivers = [];
  const st = [driversDir];
  
  while (st.length) {
    const current = st.pop();
    try {
      const stat = fs.statSync(current);
      if (stat.isDirectory()) {
        const items = fs.readdirSync(current);
        
        // Vérifier si c'est un driver
        const composeFile = ['driver.compose.json', 'driver.json']
          .map(name => path.join(current, name))
          .find(p => fs.existsSync(p));
        
        if (composeFile) {
          const relativePath = path.relative(driversDir, current);
          drivers.push({
            path: current,
            relativePath,
            name: path.basename(current),
            composeFile
          });
        }
        
        // Ajouter les sous-dossiers à explorer
        for (const item of items) {
          const itemPath = path.join(current, item);
          try {
            const itemStat = fs.statSync(itemPath);
            if (itemStat.isDirectory()) {
              st.push(itemPath);
            }
          } catch (e) {
            // Ignorer les erreurs d'accès
          }
        }
      }
    } catch (e) {
      // Ignorer les erreurs d'accès
    }
  }
  
  log(`📊 ${drivers.length} drivers trouvés pour réorganisation`);
  echo();
  
  // Réorganiser chaque driver
  let successCount = 0;
  let errorCount = 0;
  
  for (const driver of drivers) {
    try {
      log(`🔄 Réorganisation de: ${driver.name}`);
      
      // Lire les métadonnées du driver
      let driverInfo = {};
      try {
        const composeContent = await fsp.readFile(driver.composeFile, 'utf8');
        driverInfo = JSON.parse(composeContent);
      } catch (parseError) {
        log(`⚠️  Erreur de parsing JSON pour ${driver.name}: ${parseError.message}`, 'warning');
        driverInfo = { name: driver.name };
      }
      
      // Générer le nouveau nom de dossier
      const newFolderName = generateDriverFolderName(
        driverInfo.name || driver.name,
        driverInfo.manufacturerName || [],
        driverInfo.modelId || [],
        driverInfo.capabilities || []
      );
      
      const newPath = path.join(driversDir, newFolderName);
      
      // Vérifier si le renommage est nécessaire
      if (path.basename(driver.path) === newFolderName) {
        log(`✅ ${driver.name} déjà correctement nommé`);
        successCount++;
        continue;
      }
      
      // Forcer le renommage
      const result = await forceRename(driver.path, newPath);
      
      if (result.success) {
        log(`✅ Réorganisation réussie: ${driver.name} → ${newFolderName}`);
        successCount++;
      } else {
        log(`❌ Échec de la réorganisation: ${driver.name}`, 'error');
        errorCount++;
      }
      
      echo();
      
    } catch (error) {
      log(`❌ Erreur lors de la réorganisation de ${driver.name}: ${error.message}`, 'error');
      errorCount++;
    }
  }
  
  // Résumé final
  echo();
  log(`📊 RÉORGANISATION TERMINÉE:`);
  log(`   ✅ Succès: ${successCount}`);
  log(`   ❌ Erreurs: ${errorCount}`);
  log(`   📁 Total: ${drivers.length}`);
  
  return errorCount === 0;
}

// Fonction pour nettoyer les dossiers vides
async function cleanupEmptyDirectories() {
  log('🧹 NETTOYAGE DES DOSSIERS VIDES...');
  
  const driversDir = path.join(process.cwd(), CONFIG.DRIVERS_DIR);
  let cleanedCount = 0;
  
  function cleanupRecursive(dir) {
    try {
      const items = fs.readdirSync(dir);
      let hasContent = false;
      
      for (const item of items) {
        const itemPath = path.join(dir, item);
        const stat = fs.statSync(itemPath);
        
        if (stat.isDirectory()) {
          if (cleanupRecursive(itemPath)) {
            hasContent = true;
          }
        } else {
          hasContent = true;
        }
      }
      
      if (!hasContent && dir !== driversDir) {
        try {
          fs.rmdirSync(dir);
          log(`🗑️  Dossier vide supprimé: ${path.relative(driversDir, dir)}`);
          cleanedCount++;
        } catch (e) {
          // Ignorer les erreurs de suppression
        }
      }
      
      return hasContent;
    } catch (e) {
      return false;
    }
  }
  
  cleanupRecursive(driversDir);
  log(`🧹 ${cleanedCount} dossiers vides nettoyés`);
  
  return cleanedCount;
}

// Fonction principale
async function reorganizeDriversUltimate() {
  try {
    log('🚀 LANCEMENT DE LA RÉORGANISATION ULTIMATE DES DRIVERS...');
    echo();
    
    // Étape 1: Réorganisation forcée
    const reorganizationSuccess = await reorganizeDrivers();
    
    if (!reorganizationSuccess) {
      log(`⚠️  Réorganisation terminée avec des erreurs`, 'warning');
    }
    
    echo();
    
    // Étape 2: Nettoyage des dossiers vides
    await cleanupEmptyDirectories();
    
    echo();
    
    if (reorganizationSuccess) {
      log('🎉 RÉORGANISATION ULTIMATE TERMINÉE AVEC SUCCÈS !');
    } else {
      log('⚠️  RÉORGANISATION TERMINÉE AVEC DES ERREURS PARTIELLES');
    }
    
    return reorganizationSuccess;
    
  } catch (error) {
    log(`❌ Erreur fatale lors de la réorganisation: ${error.message}`, 'error');
    return false;
  }
}

// Exécution si appelé directement
if (require.main === module) {
  reorganizeDriversUltimate()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      log(`❌ Erreur d'exécution: ${error.message}`, 'error');
      process.exit(1);
    });
}

module.exports = {
  reorganizeDriversUltimate,
  forceRename,
  mergeDirectories,
  generateDriverFolderName,
  CONFIG
};
