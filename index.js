
const fs = require('fs')
const cheerio = require('cheerio');
const {
   Builder,
   By,
   until
} = require('selenium-webdriver');
let chrome = require('selenium-webdriver/chrome');


async function pars() {
   var html = '';
   let $ = '';
   await new Promise((resolve, reject) => {
         resolve(
            new Builder()
            .forBrowser('chrome')
            .setChromeOptions(new chrome.Options().headless())
            .build()
            .then(driver => {
               return driver.get("https://www.marathonbet.ru/su/events.htm?id=11")
                  .then(async () => {
                     var fl = false;
                     while (!fl) {
                        driver.getPageSource().then(src => {
                           fl = src.includes('Итоги');
                           html = src
                        });
                        console.log(fl);
                        driver.findElement(By.id('events_content')).
                        then(el => driver.executeScript("(arguments[0].lastElementChild).scrollIntoView();", el))
                        await new Promise((resolve, reject) => setTimeout(resolve, 3000))
                     }
                  })
                  .then(_ => driver.sleep(4000))
                  .then(_ => driver.quit())
            })
         );
      })
      .then(_ => {
         var event_link = new Map();
         $ = cheerio.load(html);
         $('.coupon-row').each((i, e) => {
            event_link.set($(e).attr('data-event-name') , $(e).attr('data-event-path'));
         })
         jsonData = JSON.stringify([...event_link])

         fs.writeFile('./app/info.json',  JSON.stringify(jsonData), (err) =>{
            if (err){
               console.error(err);
               return
            }
         })
      })
}
pars()
