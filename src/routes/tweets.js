const express = require('express');

const router = express.Router();

const {
  createTweet,
  getTweetById,
  updateTweet,
  deleteTweet,
  getAllTweets,
} = require('../controllers/tweets');

const { authMiddleware } = require('../middlewares/authMiddleware');
const { paginationMiddleware } = require('../middlewares/paginationMiddleware');

router.get('/all', authMiddleware, paginationMiddleware, getAllTweets);
router.post('/', createTweet);

router.get('/:id', getTweetById);
router.put('/:id', authMiddleware, updateTweet);
router.delete('/:id', authMiddleware, deleteTweet);

module.exports = router;
