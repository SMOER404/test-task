const fs = require('fs');
const path = require('path');

// Генерация 1000 опций
const options = Array.from({length: 1000}, (_, i) => ({
    name: `${i + 1}`,
    value: `${i + 1}`
}));

const db = {
    options: options
};

fs.writeFileSync(
    path.resolve(__dirname, 'db.json'),
    JSON.stringify(db, null, 2)
);

console.log('Generated 1000 options in db.json');