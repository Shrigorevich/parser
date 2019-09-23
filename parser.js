//
// const {Worker, parentPort, workerData} = require('worker_threads');
//
// const cheerio = require('cheerio');
// const request = require('request-promise')
// const fs = require('fs')
// const links = workerData[0];
//
// links.forEach(link => {
//    const options = {
//       method: 'GET',
//       uri: 'https://www.marathonbet.ru/su/betting/'+ link
//    }
//    request(options)
//       .then(function(response) {
//          let $ = cheerio.load(response)
//          let title = $('title');
//          let div = $('.category-container');
//          fs.writeFile(`${title.text()}.txt`, $.html(div), function (err) {
//               if (err) throw err;
//               //console.log('Saved!');
//             }
//          )
//       })
//       .catch(function(err) {
//          console.error(err);
//       })
// })

const http = require('http')

http.createServer((request, response) =>{
   console.log(request.url);
   if(request.url == '/') {
      response.end('<a href = "/cat">kekich</a>')
   }else if(request.url == '/cat'){
      response.end('SHOK');
   }
}).listen(3000);
//n#3wtE)3rVT n#3wtE)3rVT
//parentPort.postMessage('done!');
