# 🛠️ Scripts de Nettoyage & Validation

**Date**: 2025-10-05T22:35:30+02:00

---

## 🎯 Script Principal (Recommandé)

### **node tools/clean_and_validate.js**

**Utilisation**:
```bash
node tools/clean_and_validate.js
```

**Actions automatiques**:
1. ✅ Suppression fichiers problématiques (`.placeholder`, `*-spec.json`, `*.svg`)
2. ✅ Suppression caches (`.homeybuild`, `.homeycompose`)
3. ✅ Validation JSON (165 fichiers)
4. ✅ Vérification assets (506 PNG)
5. ✅ Build Homey (`homey app build`)
6. ✅ Validation publish (`homey app validate --level publish`)

**Avantages**:
- 🚀 Tout-en-un
- ✅ 100% Node.js
- 📊 Rapport complet
- ⚡ Rapide (~10 secondes)

---

## 📋 Scripts Alternatifs

### 1. **clean_cache.bat** (Windows simple)
```cmd
.\clean_cache.bat
```
- ✅ Suppression cache uniquement
- ✅ Rapide (3 secondes)
- ✅ Windows natif

### 2. **CLEANUP_PERMANENT.ps1** (PowerShell complet)
```powershell
.\CLEANUP_PERMANENT.ps1
```
- ✅ Nettoyage complet
- ✅ Build + validation
- ⚠️ Plus lent (~20 secondes)

---

## 🔧 Scripts de Validation

### Validation JSON seule
```bash
node tools/validate_all_json.js
```

### Vérification Assets seule
```bash
node tools/verify_driver_assets_v38.js
```

### Validation SDK3 seule
```bash
homey app validate --level publish
```

---

## 🚀 Workflow Complet

### Développement
```bash
# 1. Nettoyer + Valider (tout-en-un)
node tools/clean_and_validate.js

# 2. Si OK, commit
git add -A
git commit -m "Update: Description"
git push origin master
```

### Publication
```bash
# 1. Valider
node tools/clean_and_validate.js

# 2. Publier
homey login
homey app publish
```

---

## 📊 Comparaison Scripts

| Script | Durée | Actions | Validation | Recommandé |
|--------|-------|---------|------------|------------|
| **clean_and_validate.js** | ~10s | 6 | ✅ Complète | ✅ **OUI** |
| clean_cache.bat | ~3s | 1 | ❌ Non | Pour debug |
| CLEANUP_PERMANENT.ps1 | ~20s | 6 | ✅ Complète | Alternative |

---

## ⚠️ Problèmes Connus & Solutions

### Erreur: ENOTEMPTY
**Cause**: Cache `.homeybuild` bloqué

**Solution**:
```bash
# Méthode 1 (recommandée)
node tools/clean_and_validate.js

# Méthode 2 (Windows)
.\clean_cache.bat

# Méthode 3 (manuelle)
taskkill /F /IM node.exe
rmdir /s /q .homeybuild
```

### Erreur: .placeholder
**Cause**: Fichiers de génération résiduels

**Solution**: Automatiquement géré par `clean_and_validate.js`

---

## ✅ Validation Finale

**Après exécution réussie**:
```
✅ JSON: 165 fichiers, 0 erreurs
✅ Build: Successful
✅ Validation: publish-level PASSED
✅ Version: 2.1.23
✅ Drivers: 162
✅ Assets: 506 PNG
```

**Prêt pour**: `homey app publish`

---

## 🔗 Liens Utiles

- **Homey CLI Docs**: https://apps.developer.homey.app/the-homey-app/cli
- **GitHub Repo**: https://github.com/dlnraja/com.tuya.zigbee
- **GitHub Actions**: https://github.com/dlnraja/com.tuya.zigbee/actions

---

**Script principal**: `node tools/clean_and_validate.js` ✅
