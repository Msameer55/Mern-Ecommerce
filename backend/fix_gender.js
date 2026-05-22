import fs from 'fs';
let c = fs.readFileSync('data/product.js', 'utf8');
c = c.replace(/gender: "Men"/g, 'gender: "men"').replace(/gender: "Women"/g, 'gender: "women"');
fs.writeFileSync('data/product.js', c);
console.log('Fixed genders');
