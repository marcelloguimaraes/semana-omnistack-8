const express = require('express');
const DevController = require('./controllers/dev-controller');
const LikeController = require('./controllers/like-controller');
const DislikeController = require('./controllers/dislike-controller');
const routes = express.Router();

routes.get('/devs', DevController.index);

routes.post('/devs', DevController.store);
routes.post('/devs/:devIdReceiving/likes', LikeController.store);
routes.post('/devs/:devIdReceiving/dislikes', DislikeController.store);


module.exports = routes;