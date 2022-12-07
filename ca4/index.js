const express = require("express");
const socket = require("socket.io");
const argon2 = require("argon2");
const fs = require("fs");
const router = express.Router();

// App setup
const PORT = 4000;
const app = express();
// Sive through request to find data.
app.post('/login.html', function(req, res) {
  res.send('POSTING!!!!')
});
const server = app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}` + " Relative path is: " + __dirname);
  
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

async function create_user(email, password) {
  try {
    // Hashes are salted automatically.
    const p_hash = await argon2.hash(password);
    const e_hash = await argon2.hash(email);
    write_file(e_hash, p_hash); 
  } catch(err) {
    // Create web popup for errors
      console.log(err);
  }
}

async function login_user(entered_email, entered_password) {
  //user_list = read_file();
  var user_list = ["a@b.com", "pword"];
  if (entered_email == user_list[1]) {
    console.log('MATCHING');
    return;
  }
  for (var index in user_list) {
    try {
      if(await argon2.verify(user_list[index], entered_email) && argon2.verify(user_list[index + 1], entered_password)) {
        isAuthenticated = true;
      } else {
        isAuthenticated = false;
      }
    } catch {
      if(err) {
        console.log(err);
      }
    }
    index++
  }
  return isAuthenticated;
}

function read_file() {
  // Fs readfile is async
  fs.readFile('/users.txt', (err, data) => {
    if(err) throw err;
    user_list = data.toString().split('\n');
  })
  return user_list;
}

// Flags a+ means to append to file or create file if not exist.
function write_file(hash_email, hash_pword) {
    const stream = fs.createWriteStream('/users.txt', {flags:'a+'});
    stream.write('\n' + hash_email + '\n' + hash_pword);
    stream.end();
}
