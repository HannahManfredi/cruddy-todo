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

// var item = items[id];
  // if (!item) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   items[id] = text;
  //   callback(null, { id, text });
  // }
exports.update = (id, text, callback) => {
  //rewrite the todo item stored in the dataDir based on its id
  //use id to check if file exists
    //if it exists
      //overwrite text
  const route = path.join(exports.dataDir, `${id}.txt`);
  fs.readFile(route, (err, data) => {
    if(err) {
      console.log('file does not exist')
    } else {
      fs.writeFile(route, text, (err, data) => {
        if (err) {
          callback(err);
        } else {
          callback(null, { id: id, text: text});
        }
      });
    }
  });

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

// Updating a Todo
// Next, refactor the update function to rewrite the todo item stored in the dataDir based on its id.

// You'll know this is working because you'll be able to save the edited todo item and upon subsequent clicks of the edit button, the changes will persist. You should also confirm the counter isn't changing between updates. Refreshing the page should also show the updated todo.

// Commit your progress: "Complete updating a todo"