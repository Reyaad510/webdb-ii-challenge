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

server.get('/api/zoos', (req, res) => {
  db('zoos')
  .then(zoos => {
    res.status(200).json(zoos);
  }).catch(err => {
    console.log(err);
  })
})


const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
