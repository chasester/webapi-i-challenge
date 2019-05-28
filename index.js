// implement your API here
const express = require('express'); // built in node.js module to handle http traffic
const db = require('./data/db.js');
const hostname = '127.0.0.1'; // the local computer where the server is running
const port = 3000; // a port we'll use to watch for traffic

const server = express();

server.listen(port, hostname, () => {
  // start watching for connections on the port specified
  console.log(`Server running at http://${hostname}:${port}/`);
});

server.use(express.json());

server.get('/', (req, res) => { console.log(req); res.send('Hello from Express')});

server.post('/api/user', (req, res) => {
    const userinfo = req.body;
    if(!req.body)  return res.status(400).json({errorMessage:"must send all required data: body undefined"});
    const { name, bio } = req.body;
    if(!name || !bio)  {return res.status(400).json({errorMessage: "must send all required data"})}
    db
    .insert(userinfo)
    .then(response => {
        res.status(201).json(response);
      })
    .catch(error => res.status(500).json({errorMessage: error}))
});

  server.get('/api/users', (req, res) => 
  {
    db
    .find()
    .then(users => res.json({users}))
    .catch(error => res.status(500).json({errorMessage: error}));
  });

  server.get('/api/user/:id', (req, res) => 
  {
    db
    .findById(req.params.id)
    .then(users => {
        if(!users || users.length === 0 || Object.keys(users).length === 0) return res.status(404).json({errorMessage: "user not found"});
        res.json({users})
    })
    .catch(error => res.status(500).json({errorMessage: error}));
  });
  
  server.delete('/api/user/:id', (req,res) =>
  {
    db
    .remove(req.params.id)
    .then(message =>
        {
            if(!message || message === 0) return res.status(404).json({errorMessage: "user not found"});
            res.json({success: `user ${req.params.id} has been romved`});
        })
    .catch(error => res.status(500).json({errorMessage: error}))
  })

  server.put('/api/user/:id', (req,res) =>
  {
    if(!req.body)  return res.status(400).json({errorMessage: "must send all required data: body undefined"});
    const { id } = req.params;
    const { name, bio } = req.body;
    if(!name || !bio)  return res.status(400).json({errorMessage: "must send all required data"});
    console.log(id);
    db
    .update(id, req.body)
    .then(response => {
        if(response === 0) return res.status(404).json({errorMessage: "User does not exist"});
        db
        .findById(id)
        .then( user => 
        {
            if(!user || user.length == 0 || Object.keys(user).length === 0) return res.status(404).json({errorMessage: "User does not exist but may have been updated"});
            res.json(user);
        })
        .catch(error => res.status(500).json({errorMessage: error}));
    })
    .catch(error => res.status(500).json({errorMessage: error}));
  });