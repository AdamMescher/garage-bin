exports.seed = (knex, Promise) =>
  knex('items').del()
    .then(() =>
      Promise.all([
        knex('items').insert([
          {
            id: 1, name: 'tennis ball', reason: 'never know when a friendly dog will come and visit', cleanliness: 'Dusty',
          },
          {
            id: 2, name: 'weird lamp', reason: 'could go in the basement if we ever finish it', cleanliness: 'Dusty',
          },
          {
            id: 3, name: 'camping gear', reason: 'not enough room in the house', cleanliness: 'Sparkling',
          },
          {
            id: 4, name: 'newspapers from 5 years ago', reason: 'never know when some newspaper could be useful', cleanliness: 'Dusty',
          },
          {
            id: 5, name: 'something rancid', reason: 'no idea', cleanliness: 'Rancid',
          },
        ]),
      ]))
    .catch((error) => {
      throw error;
    });
