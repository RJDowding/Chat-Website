const express = require("express");
const socket = require("socket.io");
const argon2 = require("argon2");
const fs = require("fs");
const { dirname } = require("path");
const router = express.Router();

// App setup
const PORT = 4000;
const app = express();
app.use(express.urlencoded());
app.use(express.json());
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


// This post is from the login webpage, it takes the input email and password and compares that with 
// all the other hashed details to find a match. If a match has been found the user is presented with the chat.
app.post('/login.html', function(req, res) {
  var isAuthenticated = login_user(req.body.user.email, req.body.user.password);
  console.log(req.body.user.email, req.body.user.password);
  // After successful login user is redirected to the chat.
  if (isAuthenticated == true) {
    res.sendFile(__dirname + '/public/chat.html');
  } else {
    res.sendFile(__dirname + '/public/login.html')
    console.log('Not authenticating')
  }
  // Wanted to add error message if authentication failed but due to time restrictions chose not to.
});

// This processes the post from the sign up form. It takes the entered email and password from the form and 
// hashes the data using an argon2 implementation. I origionally went with scrypt however, after several days of 
// Troubleshooting why it wasnt working I read the documentation and noticed it deprecated. Argon2 will stay.
// Once the users information has been stored they're redirected to the login page.
app.post('/sign-up.html', function(req, res) {
  create_user(req.body.user.email, req.body.user.password);
  console.log(req.body.user.email, req.body.user.password);
  res.redirect(301, '/login.html');
});

async function create_user(email, password) {
  try {
    // Hashes are salted automatically. Processed async.
    const p_hash = await argon2.hash(password);
    const e_hash = await argon2.hash(email);
    console.log("Hashed Email: ", e_hash, "Hashed Password: ", p_hash)
    write_file(e_hash, p_hash); 
  } catch(err) {
    // Again wanted to create error messages in website but time did not allow it.
    if (err) {
      console.log(err);
    }
  }
}

function login_user(entered_email, entered_password) {
  // Returns list of users which has been read by fs.
  // Loop goes through every element or hash in the list and compares it with the entered information.
  // The users.txt file is structured so that every even number is an email and every odd is a password. As being hashed its difficult to identify emails and passwords.
  var user_list = read_file()
  console.log('data is ', user_list)
  for (var index in user_list) {
    index++
    // I know the end of the list as it wont contain anything.
    if (user_list[index] == false) {
      return
    }
    console.log('HASHED LOGGED IS ', user_list[index]);
    try {
      // Argon has built-in functions to verify hashes, even with the hash being salted, I dont have to pass through the salt. Argon automatically records.
      if(argon2.verify(user_list[index], entered_email) && argon2.verify(user_list[index + 1], entered_password)) {
        console.log('MATCHING');
        return true
      } else {
        console.log('NOT MATCHING');
        return false
      }
    } catch (err) {
      if(err) {
        console.log(err);
        return
      }
    }
  }
}

function read_file(list) {
  var data = fs.readFileSync(__dirname + '/users.txt', 'utf-8');
  var list = data.toString('utf-8').split('\n');
  return list;
}

// Flags a+ means to append to file or create file if not exist.
function write_file(hash_email, hash_pword) {
  try {
    fs.appendFileSync(__dirname + '/users.txt', '\n' + hash_email + '\n' + hash_pword);
    console.log('Writing to file...')
  } catch (err) {
      console.log(err)
  }
}

// Wanted to give cookies to the user so they didnt have to login all the time.
// Also would of used cookies to display users name as chat id instead of the random numbers.
function giveCookie(name, value, path, options = {}) {
  options = {
    path: path,
    ...options
  }
}