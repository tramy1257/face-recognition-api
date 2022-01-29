const signin = (req, res, db, bcrypt) => {
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
}

export default signin;