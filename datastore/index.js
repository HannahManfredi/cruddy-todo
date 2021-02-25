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
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
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

// Retrieving all Todos
// Next, refactor the readAll function by returning an array of todos to client app whenever a
//GET request to the collection route occurs. To do this, you will need to read the dataDir directory
//and build a list of files. Remember, the id of each todo item is encoded in its filename.

// VERY IMPORTANT: at this point in the basic requirements, do not attempt to read the contents of
//each file that contains the todo item text. Failing to heed this instruction has the potential to send you down
//a rabbit hole.

// Please note, however, you must still include a text field in your response to the client, and it's
//recommended that you use the message's id (that you identified from the filename) for both the id field and the
//text field. Doing so will have the effect of changing the presentation of your todo items for the time being;
//we'll address this issue shortly.

// Commit your progress: "Complete retrieving all todos"