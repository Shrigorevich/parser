//подулючение  необходимых модулей
const cheerio = require('cheerio');
const request = require('request-promise')
const fs = require('fs')
const {
   Worker,
   isMainThread,
   parentPort,
   workerData
} = require('worker_threads');
const os = require('os');


const cpuCount = os.cpus().length; // получение кол-ва ядер процессора

//мой код. Получение массива элементов формата "ключ : значение" (Название события : ссылка  на событие)
const wData = new Map(JSON.parse(JSON.parse(fs.readFileSync('./app/info.json', 'utf8', (err, data) => {
   if (err) {
      console.error(err);
      return 'err'
   }
}))))

//Мой код, функция которая распределяет информацию для обработки по потокам
const goParse = () => {
   return new Promise(async (parentResolve, parentReject) => {

      const links = [];
      for (let value of wData.values()) {
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
         (segment) => {
            new Promise((resolve, reject) => {
               const worker = new Worker(('./app/parser.js'), {
                  workerData: segment,
               });
            })
         }))
   })
}
////////////////
goParse();
