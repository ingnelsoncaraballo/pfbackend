const ApiError = require('../utils/ApiError');

const Tweet = require('../models/tweets');
const TweetSerializer = require('../serializers/TweetSerializer');

const createTweet = async (req, res, next) => {
  try {
    const { body } = req;
    if (body.data == null) {
      throw new ApiError('Payload must contain a message', 400);
    }
    const tweet = await Tweet.create({
      user_id: req.user.id,
      message: body.message,
    });
  } catch (err) {
    next(err);
  }
};

const updateTweet = async (req, res, next) => {
  try {
    const { params, body } = req;

    if (body.message == null) {
      throw new ApiError('Payload shoud contain a message', 400);
    }

    const tweetUpdated = await Tweet.update({ where: { id: params.id } }, body);

    res.json(new TweetSerializer(tweetUpdated));
  } catch (err) {
    next(err);
  }
};

const getTweetById = async (req, res, next) => {
  try {
    const { params } = req;

    const user = await User.findOne({ where: { id: params.id } });

    if (user) {
      if (user.active === undefined || user.active) {
        res.json(new UserSerializer(user));
      } else if (user.active === false) {
        throw new ApiError('User not found', 400);
      }
    } else {
      throw new ApiError('User not found', 400);
    }
  } catch (err) {
    next(err);
  }
};

const deleteTweet = async (req, res, next) => {
  try {
    const { params } = req;

    const user = await User.findOne({ where: { id: params.id } });
    if (user) {
      if (user.active === undefined || user.active) {
        const userDeactivated = await user.destroy();
        res.json(new UserSerializer(null));
      } else {
        throw new ApiError('success', 200);
      }
    } else {
      throw new ApiError('User not found', 400);
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createTweet,
  updateTweet,
  getTweetById,
  deleteTweet,
};
