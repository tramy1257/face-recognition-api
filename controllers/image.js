import Clarifai from 'clarifai';

const app = new Clarifai.App({
 apiKey: '39251ca5e78649c08c2dad1cd10abd9d'
});

export const clarifaiApiCall = (req, res) => {
  app.models.predict("a403429f2ddf4b49b307e318f00e528b", req.body.input)
  .then(response => res.json(response))
  .catch(err => res.status(400).json('Unable to detect face'));
}

export const image = (req, res, db) => {
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
