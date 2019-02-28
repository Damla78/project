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
const substituteFields = [{
  firstItem: ["location_address"],
  secondItem: ["location_coordinates_lat", "location_coordinates_lng"]
}]


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