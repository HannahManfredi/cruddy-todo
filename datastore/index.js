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

exports.update = (id, text, callback) => {

  const route = path.join(exports.dataDir, `${id}.txt`);
  fs.stat(route, (err, data) => {
    if (err) {
      callback(err);
    } else {
      fs.readFile(route, (err, data) => {
        if (err) {
          callback(err);
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
    }
  })

};

exports.delete = (id, callback) => {

  const route = path.join(exports.dataDir, `${id}.txt`);
  fs.stat(route, (err, data) => {
    if (err) {
      callback(err);
    } else {
      fs.unlink(route, (err) => {
        if (err) {
          console.log(err);
        } else {
          callback();
        }
      })
    }
  });

};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};

// Deleting a Todo
// Lastly, refactor the delete function to remove the todo file stored in the dataDir based on the supplied id.

// You'll know this is working because when you refresh the page, the delete todo item will no longer be present.

// Commit your progress: "Complete deleting a todo"