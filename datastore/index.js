const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {

  counter.getNextUniqueId((err, data) => {

    let route = path.join(exports.dataDir, `${data}.txt`);
    fs.writeFile(route, text, (err) => {
      if (err) {
        console.log('error');
      } else {
        callback(null, {id: data, text: text});
      }
    });
  });

};

exports.readAll = (callback) => {

  fs.readdir(exports.dataDir, (err, data) => {
    if (err) {
      console.log('does not exist');
    } else {
      const todos = [];
      data.forEach(item => {
        let newId = item.slice(0, -4);
        let todo = {id: newId, text: newId};
        todos.push(todo);
      });
      callback(null, todos);
    }
  });

};

  // var text = items[id];
  // if (!text) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback(null, { id, text });
  // }

exports.readOne = (id, callback) => {
  const route = path.join(exports.dataDir, `${id}.txt`);
  fs.readFile(route, (err, data) => {
    if (err) {
      callback(err);
    } else {
      callback(null, {id: id, text: data.toString()});
    }
  });

};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};

// Retrieving one Todo
// Next, refactor the readOne to read a todo item from the dataDir based on the message's id. For this function, you must read the contents of the todo item file and respond with it to the client.

// You'll know you've correctly written this function because when you click edit on the UI, you'll see the todo text in the popup window.

// Commit your progress: "Complete retrieving one todo"