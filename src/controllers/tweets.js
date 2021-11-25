const ApiError = require('../utils/ApiError');

const Tweet = require('../models/tweets');
const TweetSerializer = require('../serializers/TweetSerializer');

const createTweet = async (req, res, next) => {
  try {
    const { body } = req;
    if (body.data == null) {
      throw new ApiError('Payload must contain name, username, email and password', 400);
    }
    const tweet = await Tweet.create({
      username: body.username,
      email: body.email,
      name: body.name,
      password: body.password,
    });
  } catch (err) {
    next(err);
  }
};

const updateTweet = async (req, res, next) => {
  try {
    const { params, body } = req;

    if (body.text == null
        || body.id == null
        || body.name == null) {
      throw new ApiError('Payload can only contain username, email or name', 400);
    }

    const tweetUpdated = await Tweet.update({ where: { id: params.id } }, body);

    res.json(new TweetSerializer(tweetUpdated));
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createTweet,
  updateTweet,
};
