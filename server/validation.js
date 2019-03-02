const validator = require('validator');

const requiredFields = ["link",
  "market_date",
  "location_country",
  "location_city",
  "size_living_area",
  "size_rooms",
  "price_value",
  "price_currency",
  "sold"
]

const houseFields = ['link',
  'market_date',
  'location_country',
  'location_city',
  'location_address',
  'location_coordinates_lat',
  'location_coordinates_lng',
  'size_living_area',
  'size_rooms',
  'price_value',
  'price_currency',
  'description',
  'title',
  'images',
  'sold'];
/*const substituteFields = [{
  firstItem: ["location_address"],
  secondItem: ["location_coordinates_lat", "location_coordinates_lng"]
}]*/

const houseAsSqlParams = (houseObj) => {
  return [
    'link',
    'market_date',
    'location_country',
    'location_city',
    'location_address',
    'location_coordinates_lat',
    'location_coordinates_lng',
    'size_living_area',
    'size_rooms',
    'price_value',
    'price_currency',
    'description',
    'title',
    'images',
    'sold'
  ].map(field => houseObj[field]);
}

const currencyVale = [
  'EUR',
  'USD',
  'TL',
  'GBP'
]



const validateHouseInput = (houseObj) => {
  let valid = true;
  let error = [];
  //console.log('******');
  //console.log(houseObj["link"]);
  //console.log('******');
  if (typeof houseObj !== 'object') {
    valid = false;
    error.push(`House should be object.`);
  } else {
    requiredFields.forEach(field => {
      //console.log('***Field: ' + field + ' type:' + typeof houseObj[field]);
      if (typeof houseObj[field] === 'undefined' || houseObj[field] === null) {
        valid = false;
        error.push(`${field}: is required`);
      }
    })
    if (houseObj["location_address"] === null) {
      if (houseObj["location_coordinates_lat"] === null || houseObj["location_coordinates_lng"] === null) {
        valid = false;
        error.push('location_address or location_coordinates_lat & location_coordinates_lng must be filled.');
      }
    }

    houseFields.map(field => {
      switch (field) {
        case 'location_country':
        case 'location_city':
        case 'location_address':
        case 'description':
        case 'title':
          if (houseObj[field] !== null) {
            if (typeof field !== "string") {
              valid = false;
              error.push(`${field} must be string.`);
            }
          }
          break;
        case 'images':
          if (houseObj[field] !== null) {
            if (typeof field !== "string") {
              valid = false;
              error.push(`${field} must be string.`);
            } else {
              const tempImgList = houseObj[field].split(',');
              for (imgUrl of tempImgList) {
                if (!validator.isURL(imgUrl)) {
                  valid = false;
                  error.push(`imgUrl is not correct URL in ${field}`);//I did not check.
                }
              }
            }
          }
          break;

        case 'location_coordinates_lat':
        case 'location_coordinates_lng':
        case 'price_value':
          if (!validator.isFloat("" + houseObj[field])) {
            valid = false;
            error.push(`${field} must be float.`);
          }
          break;
        case 'size_living_area':
        case 'size_rooms':
          if (!validator.isInt("" + houseObj[field])) {
            valid = false;
            error.push(`${field} must be int.`);
          }
          break;
        case "price_currency":
          if (typeof field !== "string") {
            valid = false;
            error.push(`${field} must be string.`);
          } else if (!currencyVale.includes(houseObj[field])) {
            valid = false;
            error.push(`This web site doesn't support ${houseObj[field]}`);
          }
          break;
        case 'sold':
          if (!(houseObj[field] === 1 || houseObj[field] === 0)) {
            console.log('houseObj[field]: ' + houseObj[field]);
            console.log('Type: ' + typeof houseObj[field]);
            valid = false;
            error.push(`${field} must be only 1 or 0.`);
          }
          break;
        case 'link':
          if (typeof field !== "string") {
            valid = false;
            error.push(`${field} must be string.`);
          } else if (!validator.isURL(houseObj[field])) {
            valid = false;
            error.push(`${field} is not right.`);
          }
          break;
        case 'market_date':
          if (typeof field !== "string") {
            valid = false;
            error.push(`${field} must be string.`);
          } else if (!validator.isISO8601(houseObj[field])) {
            valid = false;
            error.push(`${houseObj[field]} is not correct date. It must be [YYYY] - [MM] - [DD]`);
          } else if (validator.isAfter(houseObj[field])) {
            valid = false;
            error.push(`${field} must be before today.`);
          }
          break;
        default:
          console.log('Primitive validations are ok.');
      }
    })


  }
  return {
    valid,
    error,
    raw: houseObj
  };
}

module.exports = {
  validateHouseInput,
  houseAsSqlParams
}