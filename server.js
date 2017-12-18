/* eslint no-console: 0 */
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const enviroment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[enviroment];
const database = require('knex')(configuration);

app.set('port', process.env.PORT || 3000);

app.locals.title = 'Garage Bin';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public')));

app.get('/api/v1/items', (request, response) => {
  database('items').select()
    .then((items) => {
      if (!items) {
        return response.status(404).json({ error: 'No items exist in garage' });
      }
      return response.status(200).json({ items });
    })
    .catch((error) => {
      throw error;
    });
});

app.get('/api/v1/items/:id', (request, response) => {
  const { id } = request.params;
  database('items').where('id', id).select()
    .then((item) => {
      if (!item.length) {
        return response.status(404).json({ error: `No item exists in garage with 'id' of '${id}' ` });
      }
      return response.status(200).json({ item: item[0] });
    });
});

app.post('/api/v1/items', (request, response) => {
  const { name, reason, cleanliness } = request.body;
  const item = { name, reason, cleanliness };

  for (const requiredParameter of ['name', 'reason', 'cleanliness']) {
    if (!request.body[requiredParameter]) {
      return response.statusps(422).json({ error: `You are missing the '${requiredParameter}' property` });
    }
  }

  database('items').insert(item, 'id')
    .then(postedItem => response.status(201).json({ itemId: postedItem[0] }))
    .catch(error => response.json({ error }));
});

app.patch('/api/v1/items/:id', (request, response) => {
  const { id } = request.params;
  const { name, reason, cleanliness } = request.body;
  const body = { name, reason, cleanliness };

  database('items').where('id', id).update(body, '*')
    .then((item) => {
      if (!item.length) {
        return response.status(404).json({ error: `Could not find an item in garage with 'id' ${id}` });
      }
      return response.status(202).json({ item: item[0] });
    })
    .catch(error => response.status(500).json({ error }));
});

app.use((request, response) => response.status(404).send("404: Sorry can't find that!"));

app.use((error, request, response) => {
  console.error(error.stack);
  return response.status(500).send('Something broke!');
});

app.listen(app.get('port'), () => console.log(`${app.locals.title} is running on ${app.get('port')}`));

module.exports = app;

