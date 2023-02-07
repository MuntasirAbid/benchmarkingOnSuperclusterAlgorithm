/* eslint-disable object-curly-spacing */
import Supercluster from './index.js';
import fs from 'fs';

const n_max = 1000000;
const repetitions = 5;

const data = ['N, Time'];

let n = 0;
while (n <= n_max) {
    const points = [];
    for (let i = 0; i < n; i++) {
        points.push({
            type: 'Feature',
            properties: {
                index: i
            },
            geometry: {
                type: 'Point',
                coordinates: [
                    -180 + 360 * Math.random(),
                    -80 + 160 * Math.random()
                ]
            }
        });
    }

    let r = 0;

    const t0 = performance.now();

    while (r < repetitions) {

        const index = new Supercluster({ log: false, maxZoom: 6 }).load(points);

        index.getClusters([-180, -90, 180, 90], 0).map(f => JSON.stringify(f.properties));

        r++;
    }

    const total_time = performance.now() - t0;

    const average_time = total_time / r;

    data.push(`${n}, ${average_time}`);

    console.log(`Average time it takes to make and retrieve clusters for ${n} points: ${average_time} ms`);

    if (n < 1000)
        n += 10;
    else if (n < 10000)
        n += 100;
    else if (n < 100000)
        n += 1000;
    else
        n += 10000;
}


fs.writeFile('./data.csv', data.join('\r\n'), (err) => {
    console.log(err || 'done');
});
