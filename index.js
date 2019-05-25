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


// GET by id

server.get('/api/zoos/:id', (req, res) => {
  db('zoos')
  .where({ id: req.params.id })
  .first()
  .then(zoo => {
    if(zoo) {
      res.status(200).json(zoo);
    } else {
      res.status(404).json({message: 'Zoo not found'})
    }
  })
  .catch(err => {
    res.status(500).json(err);
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


// Update

server.put('/api/zoos/:id', (req, res) => {
  db('zoos')
  .where({ id: req.params.id })
  .update(req.body)
  .then(count => {
    if(count > 0 ) {
      res.status(200).json({ message: `${count} ${count > 1 ? 'records' : 'record'} updated.` })
    } else {
      res.status(404).json({ message: 'Zoos does not exist' })
    }
  })
  .catch(err => {
    res.status(500).json(err);
  })
})


// Delete

server.delete('/api/zoos/:id', (req, res) => {
  db('zoos')
  .where({ id: req.params.id })
  .del()
  .then(count => {
    if(count > 0) {
      res.status(200).json({ message: `${count} ${count > 1 ? 'records' : 'record'} deleted.` })
    } else {
      res.status(404).json({ message: 'Zoo does not exist' })
    }
  })
  .catch(err => {
    res.status(500).json(err)
  })
})


const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
