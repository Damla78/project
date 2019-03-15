var cheerio = require('cheerio');
var request = require('request');
var fs = require('fs');



const houseList = [];

let itemLastId = 0;
var url = 'https://www.huislijn.nl/koopwoning/nederland/groningen/groningen';
urlNext = url;


async function loadOneHouse($, value) {
  const houseObj = {
    "id": 0,
    "link": "",
    "market_date": "",
    "location_country": "",
    "location_city": "",
    "location_address": "",
    "location_coordinates_lat": null,
    "location_coordinates_lng": null,
    "size_living_area": null,
    "size_rooms": null,
    "price_value": null,
    "price_currency": null,
    "description": "",
    "title": "",
    "images": "",
    "sold": 0
  }

  await new Promise(resolve => setTimeout(resolve, 3000)); // 3 sec

  let detailedLink = 'https://www.huislijn.nl' + $(value).attr('href');

  itemLastId++;
  console.log(itemLastId + '. item is added.');
  houseObj.id = itemLastId;
  houseObj.link = detailedLink;
  houseObj.market_date = '2019-03-14';

  return new Promise((resolve, reject) => {
    request(detailedLink, async function (err, resp, bodyDetailed) {//examine detailed info in each page.
      if (!err && resp.statusCode === 200) {
        let $detail = cheerio.load(bodyDetailed);

        let address1 = $detail('.address-line').text().trim();
        let zip = $detail('.zip').text().trim();
        let place = $detail('.place').text().trim();

        houseObj.location_country = 'Netherlands';
        houseObj.location_city = place;
        houseObj.location_address = address1 + ' ' + zip;

        let coords = JSON.parse($detail('hl-page-detail').attr(':location'));
        houseObj.location_coordinates_lat = parseFloat(coords.lat);
        houseObj.location_coordinates_lng = parseFloat(coords.lon);

        let rooms = $detail('#kenmerken table td').eq(5).text().trim();
        houseObj.size_rooms = parseInt(rooms);

        let woonOppervlakte = $detail('#kenmerken table td').eq(9).text().trim()
        houseObj.size_living_area = parseInt(woonOppervlakte, 10);

        /**Price */
        let pricing = $detail('.pricing > h2').text().trim();
        let tempPricing = pricing.split(' ');
        if (tempPricing[0] === '€') {
          houseObj.price_currency = 'EUR';
        } else if (tempPricing[0] === '$') {
          houseObj.price_currency = 'USD';
        } else if (tempPricing[0] === '£') {
          houseObj.price_currency = 'GBP'
        }
        houseObj.price_value = tempPricing[1].replace('.', '');
        /**Price */

        let description = $detail(".content > p").eq(1).text();
        houseObj.description = description;
        let title = $detail("meta[property='og:title']").attr('content');
        houseObj.title = title;

        /**Image addresses */
        $_mainImg = cheerio.load($detail('hl-object-media noscript').text().trim())//Main Img
        let mainImg_add = $_mainImg('img').attr('src');
        let Img_addresses = mainImg_add;
        const imgLength = $detail('.media-slot .content > img').length;//small images
        for (let i = 0; i < imgLength; i++) {
          let ii = i + 1;
          let searchStr = '.media-slot-' + ii + ' .content > img';
          let smallImg_add = $detail(searchStr).attr('src');
          Img_addresses = Img_addresses + ',' + smallImg_add;
        }
        houseObj.images = Img_addresses;
        /**Image addresses */
        let sold = $detail('h2').attr('style', 'display:inline-block;').text().trim();
        if (sold.includes('Verkocht')) {
          houseObj.sold = 1;
        } else {
          houseObj.sold = 0;
        }
        houseList.push(houseObj);
        resolve();
      } else {
        console.log('There is a problem in house detail request loop');
        reject();
      }
    })//request
  });
}
function loadPage(url) {
  return new Promise((resolve, reject) => {
    request(url, async function (err, resp, body) {
      if (!err && resp.statusCode === 200) {

        var $ = cheerio.load(body);

        //in the web page, visit all houses
        const str = $('hl-search-object-display').text();

        const newPageHuiseList = []
        await $('.object-panel > a', str).each(async (index, newHuiseObj) => {
          newPageHuiseList.push(newHuiseObj);
        })//each

        for (newHuiseItem of newPageHuiseList) {
          await loadOneHouse($, newHuiseItem);
        }
        resolve();
      } else {
        console.log('There is error in first page.');
        reject();
      }
      console.log('Bye!');
    })//request
  });

}

(async () => {
  await loadPage(urlNext);//First Page

  for (let pageIndex = 2; pageIndex < 13; pageIndex++) {//Second Page...   12.Page
    urlNext = `${url}?page=${pageIndex}&order=relevance`;
    await loadPage(urlNext);
  }

  try {
    await fs.writeFileSync("huiseList.json", JSON.stringify(houseList, null, 2));
  } catch (err) {
    console.log('File error: ' + err);
  }
})();




