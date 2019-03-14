var express = require('express');
var path = require('path');
var cherrio = require('cheerio');
var app = express();
var request = require('request');
var fs = require('fs');
var port = 8080;


//const HouseList = [];

let fileIsEmpty = true;
let itemLastId = 0;
var url = 'https://www.huislijn.nl/koopwoning/nederland/groningen/groningen';
urlNext = url;
loadPage(urlNext);

for (let pageIndex = 2; pageIndex < 13; pageIndex++) {
  urlNext = url + '?page=' + pageIndex + '&order=relevance';
  loadPage(urlNext);
}

function loadPage(url) {
  request(url, async function (err, resp, body) {


    if (!err && resp.statusCode === 200) {

      var $ = cherrio.load(body);

      //in the web page, visit all houses
      const str = $('hl-search-object-display').text();

      const searchLength = $('.object-panel > a', str).length;
      await $('.object-panel > a', str).each(async (index, value) => {

        const HouseObj = {
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

        await new Promise(resolve => setTimeout(resolve, 10000)); // 3 sec

        let detailedLink = 'https://www.huislijn.nl' + $(value).attr('href');

        itemLastId++;
        console.log(itemLastId + '. item is added.');
        HouseObj.id = itemLastId;
        HouseObj.link = detailedLink;
        HouseObj.market_date = '2019-03-14';

        request(detailedLink, async function (err, resp, bodyDetailed) {//examine detailed info in each page.
          if (!err && resp.statusCode === 200) {
            $_detail = cherrio.load(bodyDetailed);

            let address1 = $_detail('.address-line').text().trim();
            let zip = $_detail('.zip').text().trim();
            let place = $_detail('.place').text().trim();

            HouseObj.location_country = 'Netherlands';
            HouseObj.location_city = place;
            HouseObj.location_address = address1 + ' ' + zip;

            let coords = JSON.parse($_detail('hl-page-detail').attr(':location'));
            HouseObj.location_coordinates_lat = coords.lat;
            HouseObj.location_coordinates_lng = coords.lon;

            let rooms = $_detail('#kenmerken table td').eq(5).text().trim();
            HouseObj.size_rooms = rooms;

            let woonOppervlakte = $_detail('#kenmerken table td').eq(9).text().trim()
            HouseObj.size_living_area = woonOppervlakte;

            /**Price */
            let pricing = $_detail('.pricing > h2').text().trim();
            let tempPricing = pricing.split(' ');
            if (tempPricing[0] === '€') {
              HouseObj.price_currency = 'EUR';
            } else if (tempPricing[0] === '$') {
              HouseObj.price_currency = 'USD';
            } else if (tempPricing[0] === '£') {
              HouseObj.price_currency = 'GBP'
            }
            HouseObj.price_value = tempPricing[1];
            /**Price */

            let description = $_detail(".content > p").eq(1).text();
            HouseObj.description = description;
            let title = $_detail("meta[property='og:title']").attr('content');
            HouseObj.title = title;

            /**Image addresses */
            $_mainImg = cherrio.load($_detail('hl-object-media noscript').text().trim())//Main Img
            let mainImg_add = $_mainImg('img').attr('src');
            let Img_addresses = mainImg_add;
            const imgLength = $_detail('.media-slot .content > img').length;//small images
            for (let i = 0; i < imgLength; i++) {
              let ii = i + 1;
              let searchStr = '.media-slot-' + ii + ' .content > img';
              let smallImg_add = $_detail(searchStr).attr('src');
              Img_addresses = Img_addresses + ',' + smallImg_add;
            }
            HouseObj.images = Img_addresses;
            /**Image addresses */
            let sold = $_detail('h2').attr('style', 'display:inline-block;').text().trim();
            if (sold.includes('Verkocht')) {
              HouseObj.sold = 1;
            } else {
              HouseObj.sold = 0;
            }
            //write File
            try {
              (fileIsEmpty) ?
                await fs.appendFileSync("huiseList.json", JSON.stringify(HouseObj)) :
                await fs.appendFileSync("huiseList.json", "," + JSON.stringify(HouseObj));
              fileIsEmpty = false;
            } catch (err) {
              console.log('File error: ' + err);
            }

          } else { console.log('There is a problem in second request loop'); }

        })//request

      })//each

    } else {
      console.log('There is error in first page.');
    }
    console.log('Bye!');
  })//request
}

app.listen(port);
console.log('server running on' + port);
