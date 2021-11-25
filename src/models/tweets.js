const TWEETS = [];

/**
 *
 * @param {
 * status: string
 * data: {
 * id: string
 * text: string
 * likeCounter: number
 * user: string
 * }} tweet
 *
 * @returns {Object}
 */
const create = (tweet) => new Promise((resolve, reject) => {
  const newTweet = {
    status: 'success',
    data: {
      id: TWEETS.length + 1,
      likeCounter: 0,
      ...tweet,
    },
  };
  TWEETS.push(newTweet);

  resolve(newTweet);
});
/**
 *
 * @param {{ where: Object }} Object Search filters
 * @param {(find|filter)} kind
 * @returns {Object|Array}
 */
const find = ({ where }, kind) => new Promise((resolve, reject) => {
  const filters = Object.keys(where);
  const tweet = TWEETS[kind]((obj) => {
    let match = true;
    filters.forEach((filter) => {
      // eslint-disable-next-line eqeqeq
      if (obj[filter] != where[filter]) {
        match = false;
      }
    });
    return match;
  });

  resolve(tweet);
});
/**
 *
 * @param {{ where: Object }} Object Search filters
 * @returns {Object}
 */
const findOne = (where) => find(where, 'find');
/**
 *
 * @param {{ where: Object }} Object Search filters
 * @returns number
 */
const count = async (where) => (await find(where, 'filter')).length;

/**
 *
 * @param {{ where: Object }} Object Search filters
 * @returns {Object}
 */
const update = (whereClause, newValues) => new Promise((resolve, reject) => {
  findOne(whereClause)
    .then((tweet) => {
      if (!tweet) {
        resolve(null);
      }
      Object.assign(tweet, newValues);
      resolve(tweet);
    })
    .catch((err) => reject(err));
});
module.exports = {
  create,
  findOne,
  update,
  count,
};
