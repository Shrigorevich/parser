//подключение необходимых модулей
const {
   Worker,
   parentPort,
   workerData
} = require('worker_threads');
const cheerio = require('cheerio');
const request = require('request-promise')
const fs = require('fs')
const links = workerData
//////////////////////////////////

// функции deley(), delayedLog(), processArray()  необходимы для имитации асинхронной работы цикла forEach
function delay() {
   return new Promise(resolve => setTimeout(resolve, 500));
}

async function delayedLog(link) {
   //код, написынный мною, который непосредственно отвечает за парсинг
   await delay();
   const options = {
      method: 'GET',
      uri: 'https://www.marathonbet.ru/su/betting/' + link
   }

   request(options)
      .then((response) => {
         let $ = cheerio.load(response)
         let title = $('title');
         //let div = $('.category-container'); - взятие блока с информацией по событию(матчу), который слишком большой, что бы его выводить в текстовый файл ${title.text()}
         fs.appendFile(`data.txt`, `*******${title.text()}*******`, function(err) {
            if (err) throw err;
         })
      })
   /////////////////////
}

async function processArray(links) {
   for (const link of links) {
      await delayedLog(link);
   }
}

processArray(links)
