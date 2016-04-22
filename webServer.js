"use strict";

/* jshint node: true */

/*
 * This builds on the webServer of previous projects in that it exports the current
 * directory via webserver listing on a hard code (see portno below) port. It also
 * establishes a connection to the MongoDB named 'cs142project6'.
 *
 * To start the webserver run the command:
 *    node webServer.js
 *
 * Note that anyone able to connect to localhost:portNo will be able to fetch any file accessible
 * to the current user in the current directory or any of its children.
 *
 * This webServer exports the following URLs:
 * /              -  Returns a text status message.  Good for testing web server running.
 * /test          - (Same as /test/info)
 * /test/info     -  Returns the SchemaInfo object from the database (JSON format).  Good
 *                   for testing database connectivity.
 * /test/counts   -  Returns the population counts of the cs142 collections in the database.
 *                   Format is a JSON object with properties being the collection name and
 *                   the values being the counts.
 *
 * The following URLs need to be implemented:
 * /user/list     -  Returns an array containing all the User objects from the database.
 *                   (JSON format)
 * /user/:id      -  Returns the User object with the _id of id. (JSON format).
 * /photosOfUser/:id' - Returns an array with all the photos of the User (id). Each photo
 *                      should have all the Comments on the Photo (JSON format)
 *
 */

var mongoose = require('mongoose');
var async = require('async');


// Load the Mongoose schema for User, Photo, and SchemaInfo
var User = require('./schema/user.js');
var Photo = require('./schema/photo.js');
var SchemaInfo = require('./schema/schemaInfo.js');

var express = require('express');
var app = express();

mongoose.connect('mongodb://localhost/cs142project6');

// We have the express static module (http://expressjs.com/en/starter/static-files.html) do all
// the work for us.
app.use(express.static(__dirname));


app.get('/', function(request, response) {
  response.send('Simple web server of files from ' + __dirname);
});

/*
 * Use express to handle argument passing in the URL.  This .get will cause express
 * To accept URLs with /test/<something> and return the something in request.params.p1
 * If implement the get as follows:
 * /test or /test/info - Return the SchemaInfo object of the database in JSON format. This
 *                       is good for testing connectivity with  MongoDB.
 * /test/counts - Return an object with the counts of the different collections in JSON format
 */
app.get('/test/:p1', function(request, response) {
  // Express parses the ":p1" from the URL and returns it in the request.params objects.
  console.log('/test called with param1 = ', request.params.p1);

  var param = request.params.p1 || 'info';

  if (param === 'info') {
    // Fetch the SchemaInfo. There should only one of them. The query of {} will match it.
    SchemaInfo.find({}, function(err, info) {
      if (err) {
        // Query returned an error.  We pass it back to the browser with an Internal Service
        // Error (500) error code.
        console.error('Doing /user/info error:', err);
        response.status(500).send(JSON.stringify(err));
        return;
      }
      if (info.length === 0) {
        // Query didn't return an error but didn't find the SchemaInfo object - This
        // is also an internal error return.
        response.status(500).send('Missing SchemaInfo');
        return;
      }

      // We got the object - return it in JSON format.
      console.log('SchemaInfo', info[0]);
      response.end(JSON.stringify(info[0]));
    });
  } else if (param === 'counts') {
    // In order to return the counts of all the collections we need to do an async
    // call to each collections. That is tricky to do so we use the async package
    // do the work.  We put the collections into array and use async.each to
    // do each .count() query.
    var collections = [{
      name: 'user',
      collection: User
    }, {
      name: 'photo',
      collection: Photo
    }, {
      name: 'schemaInfo',
      collection: SchemaInfo
    }];
    async.each(collections, function(col, done_callback) {
      col.collection.count({}, function(err, count) {
        col.count = count;
        done_callback(err);
      });
    }, function(err) {
      if (err) {
        response.status(500).send(JSON.stringify(err));
      } else {
        var obj = {};
        for (var i = 0; i < collections.length; i++) {
          obj[collections[i].name] = collections[i].count;
        }
        response.end(JSON.stringify(obj));

      }
    });
  } else {
    // If we know understand the parameter we return a (Bad Parameter) (400) status.
    response.status(400).send('Bad param ' + param);
  }
});

/*
 * URL /user/list - Return all the User object.
 */
app.get('/user/list', function(request, response) {
  User.find({}, function(err, user) {
    var collection = [];
    if (err) {
      // Query returned an error.  We pass it back to the browser with an Internal Service
      // Error (500) error code.
      console.error('Doing /user/info error:', err);
      response.status(500).send(JSON.stringify(err));
      return;
    }
    if (user.length === 0) {
      // Query didn't return an error but didn't find the SchemaInfo object - This
      // is also an internal error return.
      response.status(500).send('Missing SchemaInfo');
      return;
    }

    for (var i = 0; i < user.length; i++) {
      var u = user[i];
      var p = {};
      p.first_name = u.first_name;
      p.last_name = u.last_name;
      p.id = u.id;
      p._id = u.id;
      collection.push(p);
    }
    // We got the object - return it in JSON format.
    response.end(JSON.stringify(collection));
  });
});

/*
 * URL /user/:id - Return the information for User (id)
 */
app.get('/user/:id', function(request, response) {
  User.findOne({
    _id: request.params.id
  }, function(err, user) {
    if (err) {
      // Query returned an error.  We pass it back to the browser with an Internal Service
      // Error (500) error code.
      console.error('Dooing /user/info error:', err);
      response.status(400).send(JSON.stringify(err));
      return;
    }
    if (user.length === 0) {
      // Query didn't return an error but didn't find the SchemaInfo object - This
      // is also an internal error return.
      response.status(500).send('Missing SchemaInfo');
      return;
    }
    response.end(JSON.stringify(user));
  });
});

/*
 * URL /photosOfUser/:id - Return the Photos for User (id)
 */
app.get('/photosOfUser/:id', function(request, response) {
  var userId = request.params.id;

  var userCollection = [];
  var photoCollection = [];

  User.find({}, function(err, users) {
    var collection = [];
    if (err) {
      // Query returned an error.  We pass it back to the browser with an Internal Service
      // Error (500) error code.
      console.error('Doing /user/info error:', err);
      response.status(500).send(JSON.stringify(err));
      return;
    }
    if (users.length === 0) {
      // Query didn't return an error but didn't find the SchemaInfo object - This
      // is also an internal error return.
      response.status(500).send('Missing SchemaInfo');
      return;
    }

    var found = false;
    for (var i = 0; i < users.length; i++) {
      var u = users[i];
      var p = {};
      p.first_name = u.first_name;
      p.last_name = u.last_name;
      p.id = u.id;
      if (p.id === userId) {
        found = true;
      }
      userCollection.push(p);
    }
    if (!found) {
      response.status(400).send(JSON.stringify(err));
    }

    Photo.find({}, function(err, photos) {
      var collection = [];
      if (err) {
        // Query returned an error.  We pass it back to the browser with an Internal Service
        // Error (500) error code.
        console.error('Doing /user/info error:', err);
        response.status(500).send(JSON.stringify(err));
        return;
      }
      if (photos.length === 0) {
        // Query didn't return an error but didn't find the SchemaInfo object - This
        // is also an internal error return.
        response.status(500).send('Missing SchemaInfo');
        return;
      }

      // iterate through all the photos
      for (var i = 0; i < photos.length; i++) {
        //only run if the photo belongs to the user
        if (String(photos[i].user_id) === String(userId)) {
          //copy photo object and add properties
          var pic = {};
          pic.id = photos[i].id;
          pic.file_name = photos[i].file_name;
          pic.date_time = photos[i].date_time;
          pic.user_id = photos[i].user_id;
          pic.comments = [];

          for (var ii = 0; ii < photos[i].comments.length; ii++) {
            var comment = {};
            comment.comment = photos[i].comments[ii].comment;
            comment.user_id = photos[i].comments[ii].user_id;
            comment.date_time = photos[i].comments[ii].date_time;
            comment.user = {};
            //find the first and last name of the comment author
            for (var j = 0; j < userCollection.length; j++) {
              var us = userCollection[j];
              if (String(us.id) === String(comment.user_id)) {
                comment.user.first_name = us.first_name;
                comment.user.last_name = us.last_name;
              }
            }
            //comment object to the pictures commentsFixed object
            pic.comments.push(comment);
          }
          photoCollection.push(pic);
        }
      }
      response.end(JSON.stringify(photoCollection));
    });
  });
});


var server = app.listen(3000, function() {
  var port = server.address().port;
  console.log('Listening at http://localhost:' + port + ' exporting the directory ' + __dirname);
});
