const ApiError = require('../utils/ApiError');

const { User } = require('../database/models');
const UserSerializer = require('../serializers/UserSerializer');
const AuthSerializer = require('../serializers/AuthSerializer');
const UsersSerializer = require('../serializers/UsersSerializer');
const { generateAccessToken } = require('../services/jwt');

const { ROLES } = require('../config/constants');

const getAllUsers = async (req, res, next) => {
  try {
    req.isRole(ROLES.admin);

    const users = await User.findAll({ ...req.pagination });

    res.json(new UsersSerializer(users, await req.getPaginationInfo(User)));
  } catch (err) {
    next(err);
  }
};

const createUser = async (req, res, next) => {
  try {
    const { body } = req;

    if (body.username == null
      || body.name == null
      || body.email == null
      || body.password == null
      || body.passwordConfirmation == null) {
      throw new ApiError('Payload must contain name, username, email and password', 400);
    }

    if (body.password !== body.passwordConfirmation) {
      throw new ApiError('Passwords do not match', 400);
    }

    const user = await User.create({
      username: body.username,
      email: body.email,
      name: body.name,
      password: body.password,
    });

    res.json(new UserSerializer(user));
  } catch (err) {
    next(err);
  }
};

const getUserById = async (req, res, next) => {
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

const updateUser = async (req, res, next) => {
  try {
    const { params, body } = req;

    if (body.username == null
      || body.email == null
      || body.name == null) {
      throw new ApiError('Payload can only contain username, email or name', 400);
    }

    const userUpdated = await User.update({ where: { id: params.id } }, body);

    if (userUpdated) {
      if (userUpdated.active === undefined || userUpdated.active) {
        res.json(new UserSerializer(userUpdated));
      } else if (userUpdated.active === false) {
        throw new ApiError('User not found', 400);
      }
    } else {
      throw new ApiError('User not found', 400);
    }
  } catch (err) {
    next(err);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { body } = req;

    const user = await User.findOne({ username: body.username });
    if (!(await user.comparePassword(body.password))) {
      throw new ApiError('User not found', 400);
    }
    const accessToken = generateAccessToken(user.id, user.role);
    res.json(new AuthSerializer(accessToken));
  } catch (err) {
    next(err);
  }
};

const deactivateUser = async (req, res, next) => {
  try {
    const { params } = req;

    const user = await User.findOne({ where: { id: params.id } });
    if (user) {
      if (user.active === undefined || user.active) {
        const userDeactivated = await User.update(
          { where: { id: params.id } },
          { active: false },
        );

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

const findUser = async (where) => {
  Object.assign(where, { active: true });

  const user = await User.findOne({ where });
  if (!user) {
    throw new ApiError('User not found', 400);
  }

  return user;
};

module.exports = {
  createUser,
  getUserById,
  updateUser,
  deactivateUser,
  getAllUsers,
  loginUser,
};
