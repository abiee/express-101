'use strict';

var express = require('express');
var httpCode = require('../http-status-codes');
var postsRouter = express.Router();

postsRouter.post('/', (req, res) => {
  const createPost = require('./create-post');
  const postData = req.body;
  const database = req.db;
  const user = req.user;

  createPost(database, postData, user._id, (error, post) => {
    if (error) {
      return res.status(httpCode.HTTP_INTERNAL_SERVER_ERROR)
        .json({ message: "Unexpected error" });
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
