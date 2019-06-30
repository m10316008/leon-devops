var Brand = require('./db/brand');

async function main() {
    var vaildateBrand = await Brand.sync({ force: false, logging: console.log });

    console.log(vaildateBrand);

    process.exit();
}

main();
