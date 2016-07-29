'use strict';

var async = require('async');
var express = require('express');
var Joi = require('joi');
var httpCode = require('../http-status-codes');
var postsRouter = express.Router();

const postSchema = Joi.object().keys({
  title: Joi.string().min(3).max(30).required(),
  body: Joi.string().required()
});

postsRouter.post('/', (req, res) => {
  const createPost = require('./create-post');
  const postData = req.body;
  const database = req.db;
  const user = req.user;

  async.waterfall([
    (callback) => Joi.validate(postData, postSchema, callback),
    (postData, callback) => createPost(database, postData, user._id, callback)
  ], (error, post) => {
    if (error) {
      if(error.name === 'ValidationError') {
        res.status(httpCode.HTTP_BAD_REQUEST)
          .json({ message: error.message });
      } else {
        req.logger.error(error);
        res.status(httpCode.HTTP_INTERNAL_SERVER_ERROR)
          .json({ message: "Unexpected error" });
      }

      return;
    }

    res.status(httpCode.HTTP_CREATED)
      .json(post);
  });
});


postsRouter.get('/', (req, res) => {
  const listPosts = require('./list-posts');
  const database = req.db;
  const page = req.query.page || 1;

  listPosts(database, page, (error, posts) => {
    if (error) {
      req.logger.error(error);
      return res.status(httpCode.HTTP_INTERNAL_SERVER_ERROR)
        .json({ message: "Unexpected error" });
    }

    res.status(httpCode.HTTP_CREATED)
      .json({
        data: posts,
        page: page
      });
  });
});

module.exports = postsRouter;
