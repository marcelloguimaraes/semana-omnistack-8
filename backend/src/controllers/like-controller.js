const dev = require('../models/dev');

module.exports = {
  async store(request, response) {

    console.log(request.connectedUsers);
    
    const { user  } = request.headers;
    const { devIdReceiving } = request.params;

    const devGiving = await dev.findById(user);
    const devReceiving = await dev.findById(devIdReceiving);

    if(!devGiving) 
      return response.status(404).json({error: "Dev giving like not found."})
      
    if(!devReceiving) 
      return response.status(404).json({error: "Dev receiving like not found."})


    if(devReceiving.likes.includes(devGiving._id)) {
      const loggedSocket = request.connectedUsers[user];
      const targetSocket = request.connectedUsers[devIdReceiving];

      if(loggedSocket)
        request.io.to(loggedSocket).emit('match', devReceiving);

      if(targetSocket)
        request.io.to(targetSocket).emit('match', devGiving);
      
      console.log('DEU MATCH!');
    }

    devGiving.likes.push(devReceiving._id);
    devGiving.save();

    console.log(`Dev \"${devGiving.name}\" liked \"${devReceiving.name}\"`);

    return response.json(devGiving);
  }
}