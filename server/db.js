var mysql = require('mysql');
const { promisify } = require('util');

var db = mysql.createConnection({
  host: 'localhost',
  user: 'newuser17',
  password: 'password17',
  database: 'class17_db'
});

db.queryPromise = promisify(db.query);
db.queryPromiseStandalone = promisify(db.query.bind(db));
module.exports = db;

/*
db.connect();

const sql = `insert into houses (
link,
  market_date,
  location_country,
  location_city,
  location_address,
  location_coordinates_lat,
  location_coordinates_lng,
  size_living_area,
  size_rooms,
  price_value,
  price_currency,
  description,
  title,
  images,
  sold
  ) values ?;`

values = [
  [
    'www.adres1.nl',
    '27.2.2019',
    'Nederland',
    'Amstelveen',
    'Punter 56 1186 RE',
    null,
    null,
    75,
    4,
    1000.00,
    'EUR',
    null,
    null,
    null,
    0
  ],
  [
    'www.adres2.nl',
    '27.2.2019',
    'Nederland',
    'Amstelveen',
    'Punter 56 1186 RE',
    null,
    null,
    75,
    4,
    1000.00,
    'EUR',
    null,
    null,
    null,
    0
  ]
]

db.query(sql, [values], function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results);
});

db.end();*/