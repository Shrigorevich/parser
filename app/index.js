
//поключение необходимых молулей
const fs = require('fs')
const cheerio = require('cheerio');
const {
   Builder,
   By,
   until
} = require('selenium-webdriver');
let chrome = require('selenium-webdriver/chrome');

//Мой код. Функция, которая скролит главную страницу, извлекая названия событий и ссылки на них, после чего записывает полученную  информацию в JSON файл.
//Объект Builder и его функционал является частью модуля selenium-webdriver, с помощью которого был реализован скроллинг страницы
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
                     //цикл, который скролит раздел "Футбол", пока не прогрузит всю нужную информацию. Тригером для остановки скролла является первый блок, который будет иметь в название слово "Итоги". Мною был сделан вывод, что информация, которая в этих блоках, не нужна.
                     while (!fl) {
                        driver.getPageSource().then(src => {
                           fl = src.includes('Итоги');
                           html = src
                        });
                        console.log('waiting...');
                        driver.findElement(By.id('events_content')).
                        then(el => driver.executeScript("(arguments[0].lastElementChild).scrollIntoView();", el))
                        await new Promise((resolve, reject) => setTimeout(resolve, 2700))
                     }
                     ///////////
                  })
                  .then(_ => driver.sleep(4000))
                  .then(_ => driver.quit())
            })
         );
      })
      .then(_ => {
         //парсинг html документа главной страницы, при котором извлекаются названия событий и ссылки на них, после чего помещаются в JSON файл
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
