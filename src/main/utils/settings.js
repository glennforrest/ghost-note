import electron from 'electron';
import fs from 'fs';
import path from 'path';

const dataPath = electron.app.getPath('userData');
const filePath = path.join(dataPath, 'config.json');

export function writeSetting(key, value) {
  let settings = parseSetting()

  settings[key] = value;

  fs.writeFileSync(filePath, JSON.stringify(settings));
}

export function readSetting(key, defaultValue = false) {
 let settings = parseSetting()

 return settings[key] != 'undefined'
  ? settings[key]
  : defaultValue;
}

function parseSetting() {
  try {
   return JSON.parse(fs.readFileSync(filePath));
 } catch(error) {
   return {}
 }
}
