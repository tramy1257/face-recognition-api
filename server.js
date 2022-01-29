import express from 'express';
import cors from 'cors';
import knex from 'knex';
import bcrypt from 'bcrypt-nodejs';

const app = express();

const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'postgres',
    password: 'postgres',
    database: 'face-recognition'
  }
});

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send(database.users);
})

app.post('/signin', (req, res) => {
  const { email, password } = req.body;

  db.select('hash').from('login').where('email', email)
  .then(hash => {
    const passwordMatch = bcrypt.compareSync(password, hash[0].hash);
    if (passwordMatch) {
      // return user if password is correct
      db('users').select('*').where('email', email)
      .then(user => {
        res.json(user[0]);
      })
      .catch(err => res.status(400).json('Failed to Sign in'));
    } else {
      res.status(400).json('Email/password combination is incorrect');
    }
  })
  .catch(err => res.status(400).json('Email/password combination is incorrect'));
})

app.post('/register', (req, res) => {
  const { email, name, password } = req.body;
  const hash = bcrypt.hashSync(password);

  db.transaction(trx => {
      trx.insert({
        hash: hash,
        email: email
      })
      .into('login')
      .returning('email')
      .then(loginEmail => {
        return trx('users')
        .returning('*')
        .insert({
          email: loginEmail[0].email,
          name: name,
          joined: new Date()
        })
        .then(user => {
            res.json(user[0]);
        })
      })
      .then(trx.commit)
      .catch(trx.rollback)
  })
  .catch(err => res.status(400).json('Unable to Register'));
})

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  let currUser = null;

  db.select('*').from('users').where('id', id)
    .then(user => {
        if (user.length === 0) {
          res.status(404).json("User not Found");
        } else {
          res.json(user[0]);
        }
      })
    .catch(err => res.status(400).json("Error Finding User"));
})

app.put('/image', (req, res) => {
  let { id } = req.body;

  db('users').where('id', id).returning('entries').increment('entries', 1)
    .then(entries => {
        if (entries.length === 0) {
          res.status(404).json("User not Found");
        } else {
          res.json(entries[0].entries);
        }
      })
    .catch(err => res.status(400).json("Error Updating Entries"));
})

app.listen(2000, () => {
  console.log('app is running on port 2000');
});