const apiRouter = require('express').Router();

let lastId = 3;

const housesData = [
  {
    id: 1,
    price: 1000
  }, {
    id: 2,
    price: 2000
  }, {
    id: 3,
    price: 3000
  }
]

apiRouter.route('/houses')
  .get((req, res) => {
    res.send(housesData);
  })
  .post((req, res) => {
    let { price } = req.body;
    if (typeof price === 'undefined') {
      res.status(400).end('Price field is required.');
      return;
    }

    price = parseInt(price);

    if (Number.isNaN(price) || price <= 0) {
      res.status(400).end('Price should be positive number.');
    } else {
      lastId++;
      let item = {
        id: lastId,
        price
      }
      housesData.push(item);
      res.json(item).send(item);
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
