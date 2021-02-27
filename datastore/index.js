const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird');
Promise.promisifyAll(fs);

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

// exports.readAll = (callback) => {

//   fs.readdir(exports.dataDir, (err, data) => {
//     if (err) {
//       console.log('does not exist');
//     } else {
//       const todos = [];
//       data.forEach(item => {
//         let newId = item.slice(0, -4);
//         let todo = {id: newId, text: newId};
//         todos.push(todo);
//       });
//       callback(null, todos);
//     }
//   });

// };

// exports.readAll = (callback) => {
//   let todos = [];
//   fs.readdir(exports.dataDir, (err, data) => {
//     if (err) {
//       callback(err);
//     } else {
//       callback(null, todos)
//     }
//   });
//   console.log('files: ', files);
//   if (files.length === 0) {
//     return todos;
//   } else {
//     const todo = {};
//     files.forEach(item => {
//       let newId = item.slice(0, -4).toString();
//       todo.id = newId;
//     });
//   }
// };

// exports.readAll = (callback) => {
//   const todos = [];
//   let files = fs.readdir(exports.dataDir);
//   console.log('files: ', files);
//   if (files.length === 0) {
//     return todos;
//   } else {
//     files.forEach(item => {
//       let todo = {};
//       let newId = item.slice(0, -4).toString();
//       todo.id = newId;
//       exports.readOne(newId, (err, data) => {
//         if (err) {
//           callback(err, 0);
//         } else {
//           callback(null, data);
//         }
//       })
//       todos.push(todo);
//     });
//   }
//   return Promise.all(todos);
// };

exports.readAll = (callback) => {

  const todos = [];
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      callback(err, 0);
    } else {
      files.forEach(item => {
        const todo = {};
        let newId = item.slice(0, -4).toString();
        todo.id = newId;
        let filepath = path.join(exports.dataDir, item);
        return fs.readFileAsync(filepath)
          .then((data) => {
            if (!todo.text) {
              todo.text = data.toString();
            }
            todos.push(todo);
            return todo;
          })
          .catch((err) => {
            return err;
          });
        });
        setTimeout(() => {

          Promise.all(todos)
            .then((data) => {
              callback(null, data);
            })
            .catch((err) => {
            })
        }, 25,000);
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
  });

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
      });
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

// Finish fixing readAll
// At this point, it's time to circle back to finishing your work on readAll. You should first find the test for readAll and refactor it to expect the correct todo text instead of the id. Next, you'll need to refactor the function. Because each todo entry is stored in its own file, you'll end up with many async operations (n files = n async operations) that all need to complete before you can respond to the API request. This poses a significant challenge: your next task is to read up on promises to see how they can help you. (Hint, you'll very likely need to make use of Promise.all.)

// Learn about promises by completing the 'Bare Miniumum Requirements' of [Course] Promises. Then come back to this course and complete readAll.

// Commit your progress: "Complete Bare Minimum Requirements"