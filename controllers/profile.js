const profile = (req, res, db) => {
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
}

export default profile;