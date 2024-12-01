const asyncHandler = require('express-async-handler');
const {User} = require('../Models/index.js');

exports.getAllUsers = asyncHandler(async (req, res, next) => {
    const users = await User.findAll();

    res.status(200).json(users);
});

exports.getMe = asyncHandler(async (req, res, next) => {
    const user = await User.findByPk(req.user.id,{attributes:["id","username", "email","role"],});
    const services = await user.getServices({attributes:["id","name"],});
    // user.services = services;
    res.status(200).json({...user.toJSON(),services});
});