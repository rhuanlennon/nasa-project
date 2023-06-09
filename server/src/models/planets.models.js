const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse');

const habitablePlanents = [];

function isHabitblePlanet(planet) {
    return planet['koi_disposition'] === 'CONFIRMED'
        && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
        && planet['koi_prad'] < 1.6;
}

function loadPlanetsData() {
    return new Promise((resolve, reject) => {
        fs.createReadStream(path.join(__dirname, '..', '..', 'data', 'kepler_data.csv'))
            .pipe(parse({
                comment: '#',
                columns: true
            }))
            .on('data', (data) => {
                if (isHabitblePlanet(data)) {
                    habitablePlanents.push(data);
                }
            })
            .on('error', (error) => {
                console.log(error);
                reject(error);
            })
            .on('end', () => {
                console.log(habitablePlanents.map((planet) => {
                    return planet['kepler_name']
                }));
                console.log(`${habitablePlanents.length} habitable planets found!`);
                resolve();
            });
    });
}

function getAllPlanets() {
    return habitablePlanents;
}

module.exports = {
    loadPlanetsData,
    getAllPlanets
};