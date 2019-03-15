const apiRouter = require('express').Router();
const db = require('./db');
const { validateHouseInput, houseAsSqlParams } = require('./validation');

const HOUSES_PER_PAGE = 5;


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
  .get(async (req, res) => {
    try {
      let { price_min = 0,
        price_max = 1000000,
        location_city = "",
        location_country = "",
        order = "location_country_asc",
        page = 1
      } = req.query;

      price_min = parseInt(price_min);
      price_max = parseInt(price_max);
      page = parseInt(page);

      if (Number.isNaN(price_min) || price_min < 0 || Number.isNaN(price_max) || price_max < 0) {
        return res.status(400).json({
          error: "Price must be positive number."
        })
      } else if (price_max < price_min) {
        return res.status(400).json({ error: "Price max must be bigger than price min." });
      }

      if (Number.isNaN(page) || page < 0) {
        return res.status(400).json({
          error: "Page must be positive number."
        })
      }

      let order_field, order_direction;
      const index = order.lastIndexOf('_');
      if (index > 0) {
        order_field = order.slice(0, index);
        order_direction = order.slice(index + 1);

        if (['asc', 'desc'].indexOf(order_direction) === -1) {
          return res.status(400).json({
            error: "'order' param is wrong."
          })
        }
      } else {
        return res.status(400).json({
          error: "'order' param is wrong."
        })
      }

      const offset = (page - 1) * HOUSES_PER_PAGE;

      const conditions = [`(price_value between ? and ?)`];
      const params = [price_min, price_max];

      if (location_city.length) {
        conditions.push(`location_city=?`);
        params.push(location_city);
      }

      const sqlGetQuery = `select * from houses
                            where ${conditions.join(' and ')}
                            order by
                              ${ db.escapeId(order_field, true)} ${order_direction}
                            limit ${HOUSES_PER_PAGE}
                            offset ${offset}`;
      const sqlTotalHouses = `select count(*) as total from houses`;


      const totalNumHouses = await db.queryPromise(sqlTotalHouses);
      const houses = await db.queryPromise(sqlGetQuery, params);//db.queryPromiseStandal...
      //console.log(houses);
      res.send({ houses, HOUSES_PER_PAGE, totalNumHouses });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }

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

const getCities = async (req, res) => {
  try {
    const sqlGetDiffCities = `select distinct location_city from houses;`
    const diffCityList = await db.queryPromise(sqlGetDiffCities);

    res.send(diffCityList);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
apiRouter.route('/houses/cities')
  .get(getCities);

apiRouter.route('/houses/:id')
  .get((req, res) => {
    const { id } = req.params;
    const sqlOneHouse = `select * from houses where id=${id}`;
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
