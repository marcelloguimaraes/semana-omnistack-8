const dev = require('../models/dev');

module.exports = {
  async store(request, response) {
    
    const { user  } = request.headers;
    const { devIdReceiving } = request.params;

    const devGiving = await dev.findById(user);
    const devReceiving = await dev.findById(devIdReceiving);

    if(!devReceiving) 
      return response.status(404).json({error: "Dev receiving dislike not found."})

    if(!devGiving) 
      return response.status(404).json({error: "Dev receiving dislike not found."})

    devGiving.dislikes.push(devReceiving._id);
    devGiving.save();

    console.log(`Dev \"${devGiving.name}\" disliked \"${devReceiving.name}\"`);

    return response.json(devGiving);
  }
}