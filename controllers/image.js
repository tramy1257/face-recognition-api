const image = (req, res, db) => {
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
}

export default image;