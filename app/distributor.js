

const cheerio = require('cheerio');
const request = require('request-promise')
const fs = require('fs')

const {
   Worker,
   isMainThread,
   parentPort,
   workerData
} = require('worker_threads');
const path = require('path');

const os = require('os');
const cpuCount = os.cpus().length;
const workerPath = path.resolve(`D:/projects/nodeProject/work/app/parser.js`);

 const wData = new Map(JSON.parse(JSON.parse(fs.readFileSync('./app/info.json', 'utf8', (err, data) => {
    if (err) {
       console.error(err);
       return 'err'
    }
 }))))

const doWork = number => {

   if (number === 0) {
      return 1;
   }

   return new Promise(async (parentResolve, parentReject) => {

      const links = [];
      for(let value of wData.values()){
         links.push(value);
      }
      const segmentSize = Math.ceil(wData.size / cpuCount);
      const segments = [];

      for (let sIndex = 0; sIndex < cpuCount; sIndex++) {
         const start = sIndex * segmentSize;
         const end = start + segmentSize;
         const segment = links.slice(start, end);
         segments.push(segment);
      }

      const results = await Promise.all(segments.map(
         (segment, i) => {
         new Promise((resolve, reject) => {

            const worker = new Worker((workerPath), {
               workerData: [segment, i],
            });

            worker.on('message', resolve);
            worker.on('error', reject);
            worker.on('exit', (code) => {
               if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`));
            });
         })
      })
   )
})}

doWork(4);
