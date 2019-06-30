var Login = require('../db/login');

if (process.argv.length < 4) {
    console.log('Please provider username and password');
    process.exit();
}

var resetLoginTable = false;
if (process.argv.length > 4 && process.argv[4].toLowerCase().trim() === 'reset') {
    resetLoginTable = true;
}

var admin = {
    username: process.argv[2].toLowerCase().trim(),
    password: process.argv[3].trim(),
    userRole: 'admin',
    superAdmin: false,
    brand: '*',
    active: true,
    createdBy: 'CLI'
};

async function main() {
    if (resetLoginTable) {
        await Login.sync({ force: true });
    }

    await Login.create(admin);

    process.exit();
}

main();
