const express = require('express');
const helmet = require('helmet');
const knex = require('knex');
const knexConfig = {
  client: 'sqlite3',
  connection: {
    filename: './data/lambda.sqlite3'
  },
  useNullAsDefault: true
}

const server = express();

server.use(express.json());
server.use(helmet());

const db = knex(knexConfig);


// endpoints here

// GET

server.get('/api/zoos', (req, res) => {
  db('zoos')
  .then(zoos => {
    res.status(200).json(zoos);
  }).catch(err => {
    console.log(err);
  })
})


// Post

server.post('/api/zoos', (req, res) => {
  if(!req.body.name) {
    res.status(400).json({ message: 'Please put a name' });
  } else {
    db('zoos')
    .insert(req.body, 'id')
    .then(ids => {
      db('zoos')
      .where({ id: ids[0] })
      .first()
      .then(zoo => {
        res.status(200).json(zoo);
      })
      .catch(err => {
        res.status(500).json(err);
      })
      .catch(err => {
        res.status(500).json(err)
      })
    })

  }
})


const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
