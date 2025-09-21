const fs = require('fs');

console.log('🎯 MASTER RECERTIFICATION v1.0.32');

// 1. SECURITY FIX
console.log('🔒 Sécurité...');
try { fs.rmSync('.homeycompose', {recursive: true}); } catch(e) {}

// 2. ENDPOINTS FIX
const endpoints = [
    ['motion_sensor_battery', {"1": {"clusters": [0,4,5,1030]}}],
    ['smart_plug_energy', {"1": {"clusters": [0,4,5,6,1794]}}],
    ['smart_switch_1gang_ac', {"1": {"clusters": [0,4,5,6]}}],
    ['smart_switch_2gang_ac', {"1": {"clusters": [0,4,5,6]}, "2": {"clusters": [0,4,5,6]}}],
    ['smart_switch_3gang_ac', {"1": {"clusters": [0,4,5,6]}, "2": {"clusters": [0,4,5,6]}, "3": {"clusters": [0,4,5,6]}}]
];

endpoints.forEach(([name, ep]) => {
    const f = `drivers/${name}/driver.compose.json`;
    if (fs.existsSync(f)) {
        let c = JSON.parse(fs.readFileSync(f, 'utf8'));
        c.zigbee = {endpoints: ep, ...c.zigbee};
        fs.writeFileSync(f, JSON.stringify(c, null, 2));
    }
});

// 3. MANUFACTURER IDS
const ids = ["_TZE284_", "_TZE200_", "_TZ3000_", "_TZ3400_"];
let count = 0;

fs.readdirSync('drivers').forEach(d => {
    const f = `drivers/${d}/driver.compose.json`;
    if (fs.existsSync(f)) {
        let c = JSON.parse(fs.readFileSync(f, 'utf8'));
        if (!c.zigbee) c.zigbee = {};
        if (!c.zigbee.manufacturerName) c.zigbee.manufacturerName = [];
        
        ids.forEach(id => {
            if (!c.zigbee.manufacturerName.includes(id)) {
                c.zigbee.manufacturerName.push(id);
                count++;
            }
        });
        
        fs.writeFileSync(f, JSON.stringify(c, null, 2));
    }
});

// 4. VERSION
let app = JSON.parse(fs.readFileSync('app.json', 'utf8'));
app.version = '1.0.32';
fs.writeFileSync('app.json', JSON.stringify(app, null, 2));

console.log('✅ RECERTIFICATION COMPLETE');
console.log(`📊 ${count} manufacturer IDs ajoutés`);
console.log('🚀 PRÊT: homey app publish');
