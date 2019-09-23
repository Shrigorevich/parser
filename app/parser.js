
const {Worker, parentPort, workerData} = require('worker_threads');
const cheerio = require('cheerio');
const request = require('request-promise')
const fs = require('fs')
const links = workerData[0]

function delay() {
  return new Promise(resolve => setTimeout(resolve, 500));
}

async function delayedLog(link) {
  await delay();
  const options = {
     method: 'GET',
     uri: 'https://www.marathonbet.ru/su/betting/'+ link
  }

  request(options)
     .then((response) => {
        let $ = cheerio.load(response)
        let title = $('title');
        let div = $('.category-container');
        fs.appendFile(`data.txt`, $.html(div), function (err) {
             if (err) throw err;
          })
        })
}

async function processArray(links) {
  for (const link of links) {
    await delayedLog(link);
  }
}

processArray(links)
