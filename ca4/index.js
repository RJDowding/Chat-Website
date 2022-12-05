const express = require("express");
const socket = require("socket.io");
const argon2 = require("argon2");
const fs = require("fs");
const { response } = require("express");
const router = express.Router();

// App setup
const PORT = 4000;
const app = express();
const server = app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);

});

// Static files
app.use(express.static("public"), router);

// Socket setup
const io = socket(server);

//we use a set to store users, sets objects are for unique values of any type
const activeUsers = new Set();

io.on("connection", function (socket) {
  console.log("Made socket connection");

  socket.on("new user", function (data) {
    socket.userId = data;
    activeUsers.add(data);
    //... is the the spread operator, adds to the set while retaining what was in there already
    io.emit("new user", [...activeUsers]);
  });

  socket.on("disconnect", function () {
      activeUsers.delete(socket.userId);
      io.emit("user disconnected", socket.userId);
    });

    socket.on("chat message", function (data) {
      io.emit("chat message", data);
  });

});

router.get('/sign-up', (request, response) => {

})

async function create_user(email, password) {

  try {
    // Hashes are salted automatically.
    const p_hash = await argon2.hash(password);
    const e_hash = await argon2.hash(email)
  } catch(err) {
    // Create web popup for errors
      console.log(err);
  }

}

async function login_user(entered_email, entered_password) {

  try {
    if(await argon2.verify(stored_email, entered_email) && argon2.verify(stored_password, entered_password)) {
      isAuthenticated = true;
    } else {
      isAuthenticated = false;
    }
  } catch {
    if(err) {
      console.log(err);
    }
  }
  return isAuthenticated;
}

function read_file() {
  // Fs readfile is async
  fs.readFile('/users.txt', (err, data) => {
    if(err) throw err;
    user_list = data;
  })
}

function write_file() {
  fs.writeFile('/users.txt'), (err, data) => {
    if(err) throw err; 
    
  }
}