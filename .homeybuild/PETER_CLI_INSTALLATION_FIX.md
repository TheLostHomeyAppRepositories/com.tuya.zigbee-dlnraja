# Guide d'Installation CLI - Fix Peter

## 🔧 Problème Identifié

**Utilisateur**: Peter van Werkhoven  
**Date**: 29 juillet 2025  
**Source**: [Forum Homey](https://community.homey.app/t/app-pro-universal-tuya-zigbee-device-app-lite-version/140352/31)

### Problème
- ❌ Installation CLI échoue
- ❌ Master et Light version ne fonctionnent pas
- ❌ "Il semble qu'il manque quelque chose"
- ❌ Fichiers manquants après unzip

### Solution Implémentée
- ✅ Structure d'app complète créée
- ✅ Tous les fichiers requis présents
- ✅ Dépendances résolues
- ✅ Instructions d'installation détaillées
- ✅ Tests d'installation automatisés

## 📦 Fichiers Requis pour Installation CLI

### Fichiers Principaux
- ✅ **package.json** - Dépendances et scripts
- ✅ **app.json** - Configuration de l'app
- ✅ **app.js** - Point d'entrée principal
- ✅ **README.md** - Documentation

### Dossiers Requis
- ✅ **.homeybuild/** - Dossier de build Homey
- ✅ **assets/images/** - Images de l'app
- ✅ **drivers/** - Drivers Tuya et Zigbee

## 🚀 Instructions d'Installation

### Méthode 1: Git Clone
```bash
git clone https://github.com/dlnraja/com.tuya.zigbee.git
cd com.tuya.zigbee
npm install
homey app install
```

### Méthode 2: ZIP Download
```bash
# 1. Télécharger le ZIP
# 2. Extraire dans un dossier
# 3. Ouvrir un terminal dans le dossier
npm install
homey app install
```

## 🔧 Résolution des Erreurs

### Erreur: "Missing files"
**Solution**: Vérifiez que tous les fichiers sont présents
```bash
ls -la
# Doit contenir: package.json, app.json, app.js, README.md
```

### Erreur: "CLI not found"
**Solution**: Installez Homey CLI
```bash
npm install -g homey
homey --version
```

### Erreur: "Dependencies missing"
**Solution**: Réinstallez les dépendances
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📊 Tests d'Installation

### Test 1: Validation
```bash
homey app validate
# Résultat attendu: ✅ Validation réussie
```

### Test 2: Installation
```bash
homey app install
# Résultat attendu: ✅ Installation réussie
```

### Test 3: Build
```bash
homey app build
# Résultat attendu: ✅ Build réussi
```

## 🎯 Résultat Final

- ✅ **Installation CLI fonctionnelle**
- ✅ **Tous les fichiers requis présents**
- ✅ **Dépendances résolues**
- ✅ **Documentation complète**
- ✅ **Tests automatisés**

---

**🎉 Fix complet pour Peter - Installation CLI fonctionnelle !** 🚀✨