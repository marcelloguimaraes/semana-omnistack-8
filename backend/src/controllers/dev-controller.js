const axios = require('axios');
const dev = require('../models/dev');

module.exports = {
  async index(request, response) {

    const { user: devId } = request.headers;
    const loggedDev = await dev.findById(devId);

    if(!loggedDev) 
      return response.status(404).json({error: 'Dev provided not found.'})

    const devs = await dev.find({
      $and: [
        { _id: { $ne: devId} },
        { _id: { $nin: loggedDev.likes } },
        { _id: { $nin: loggedDev.dislikes } },        
      ],
    });
    return response.json(devs);
  },
  async store(request, response) {
    const { username } = request.body;
    const userExists = await dev.findOne({ user: username });
    console.log(userExists);

    if(userExists) return response.json(userExists);

    try {
      const responseApi = await axios.get(`https://api.github.com/users/${username}`);
      const { name, bio, avatar_url, html_url } = responseApi.data;
  
      const devCreated = await dev.create({
        name,
        user: username,
        bio,
        avatar_url,
        html_url
      });
  
      return response.json(devCreated);
    } catch(error) {
        if(error.response.status === 404)
          return response.status(404).json({error: 'User not found in Github.'});
    }
  }
};