const apiRouter = require('express').Router();
const db = require('./db');
const { validateHouseInput, houseAsSqlParams } = require('./validation');

let lastId = 3;

const housesData = [
  { id: 1, price: 500 },
  { id: 2, price: 1000 },
]
/*const housesData = [
  [
    'www.adres1.nl', '27.2.2019', 'Nederland', 'Amstelveen', 'Punter 56 1186 RE',
    null, null, 75, 4, 1000.00, 'EUR', null, null, null, 0
  ],
  [
    'www.adres2.nl', '27.2.2019', 'Nederland', 'Amstelveen', 'Punter 56 1186 RE',
    null, null, 75, 4, 1000.00, 'EUR', null, null, null, 0
  ]
];*/

const addHousesSql = `insert into houses (
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
  ) values ?;`;

apiRouter.route('/houses')
  .get((req, res) => {
    res.send(housesData);
  })
  .post(async (req, res) => {
    if (!Array.isArray(req.body)) {
      return res.status(400).json({ error: 'Input data should be an array.' });
    }
    const processedData = req.body.map(houseObj => { return validateHouseInput(houseObj) });
    //console.log(processedData);

    const validData = [];
    const invalidData = [];

    processedData.forEach(el => {
      if (el.valid) {
        validData.push(el);
      } else {
        invalidData.push(el);
      }
    });

    const report = {
      valid: validData.length,
      invalid: {
        count: invalidData.length,
        items: invalidData
      }
    };

    if (validData.length) {
      try {
        //db.connect();

        const housesData = validData.map(el => houseAsSqlParams(el.raw));
        await db.queryPromise(addHousesSql, [housesData]);
        //console.log('housesData: ', housesData);

        //db.end();

        return res.json(report);
      } catch (err) {
        return res.status(500).json({ error: 'Database error while recording new information.' + err.message })
      }

    } else {
      res.json(report);
    }



  });

apiRouter.route('/houses/:id')
  .get((req, res) => {
    const { id } = req.params;

    const house = housesData.find(house => { return house.id === parseInt(id, 10) });
    if (house) {
      res.send(house);
    } else {
      res.status(404).json({ error: 'No item is found.' });
    }

  })
  .delete((req, res) => {
    const { id } = req.params;

    let wasDeleted = false;
    const indexHouse = housesData.findIndex(house => { return house.id === parseInt(id) });

    if (indexHouse > -1) {
      housesData.splice(indexHouse, 1);
      wasDeleted = true;
    }

    if (wasDeleted) {
      res.send('Deleted');
    } else {
      res.send('Can not deleted...');
    }
  })

apiRouter.use((req, res) => {
  res.status(404).send('404 Page not found!...');
})



module.exports = apiRouter;
