var express = require('express');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var app = express();

const MongoClient = require('mongodb').MongoClient;
var mongo = require('mongodb');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var env = require(__dirname + '/env-vars.js');
var gmail_login = env.gmail_login;
var gmail_pass = env.gmail_pass;
var db;
var http = require('http');
var request=require('request');
var _ =require('lodash');
var multer = require('multer');
var upload = multer({ dest: 'uploads/' })
var multipart = require('connect-multiparty');
var formidable = require('express-formidable');
var fs = require('fs');


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(express.json()); //convert req to json
app.use(express.static(__dirname + '/app'));
app.use(session({secret: "Sam is awesome"}));
// app.use(formidable());

app.use(bodyParser.json()); // Configures bodyParser to accept JSON
app.use(bodyParser.urlencoded({
    extended: false
}));


var allPages = ['/home','/what-we-do','/organization','/faces-of-our-members','/faq','/news','/contact','/become-member','/member-app','/volunteer-to-drive','/volunteer-app','/family-involvement','/member-programs','/pay-online','/donate','/corporate', '/non-rider-member','/dashboard','/login', '/view-form','/draft','/million-rides-campaign-photo-album','/annual-report-2017','/about','/ways-to-give','/find-your-itn','/portal','/login-portal','/itnamerica','/itn-operations','/other','/rides-in-sight','/nda2018xyz','/rides','/calendar','/human-resources','/agenda','/ttp','/research','/important-docs', '/important-docs-landing','/employee-profiles','/dept-report','/hr-tickets', '/calendar-ris','/affiliate','/comments','/web-traffic','/affiliate-info','/rides-data','/documents','/timesheet', '/timesheets','/affiliate-landing','/shift-scheduler','/annual-report-2018'];

MongoClient.connect('mongodb://itnadmin:itnUser0136!@ds119442.mlab.com:19442/itnamerica-new', function(err, client) {
  if (err) {
    console.log('db not connecting, but inside mongo block - 1', err);
  };
  db = client.db('itnamerica-new');

  console.log('inside first mongo block');


  app.get('/getBlogContent', formidable(), function(req, res) {
    console.log('params are ', req.query.blogURL)
    request.get(req.query.blogURL, function(err,result,body) {
      res.send(result.body)
    });
  });

  app.get('/getNDAForms', formidable(), function (req,res) {
      db.collection('ndaform').find().toArray(function (err, result) {
        res.send(result);
      })
  }); // end of /getContactForms get request

  app.get('/getContactForms', formidable(), function (req,res) {
      db.collection('contactform').find().toArray(function (err, result) {
        res.send(result);
      })
  }); // end of /getContactForms get request

  app.get('/getHRContactForms', formidable(), function (req,res) {
      db.collection('hrcontactform').find().toArray(function (err, result) {
        res.send(result);
      })
  }); // end of /getHRContactForms get request

  app.get('/getNewsletterForms', formidable(), function (req,res) {
      db.collection('newsletterform').find().toArray(function (err, result) {
        res.send(result);
      })
  }); // end of /getNewsletterForms get request

  app.get('/getAllRides', formidable(), function (req,res) {
      db.collection('ridesdatamonthly').find().toArray(function (err, result) {
        res.send(result);
      })
  }); // end of /getRidesData get request

  app.get('/getEmployees', formidable(), function (req,res) {
      db.collection('employees').find().toArray(function (err, result) {
        res.send(result);
      })
  }); // end of /getEmployees get request

  app.get('/getCommentsPhoto', formidable(), function (req,res) {
    db.collection('commentsphoto').find().toArray(function (err, result) {
      res.send(result);
    })
  }); // end of /getRidesData get request


  app.get('/viewCalendarEvents', formidable(), function (req,res) {
    db.collection('calendar').find().toArray(function (err, result) {
      res.send(result);
    })
  }); // end of /viewCalendarEvents get request

  app.get('/viewRISCalendarEvents', formidable(), function (req,res) {
    db.collection('calendar-ris').find().toArray(function (err, result) {
      res.send(result);
    })
  }); // end of /viewRISCalendarEvents get request

  app.get('/viewAffiliateCalendarEvents', formidable(), function (req,res) {
    var affiliateName = req.query.affiliateName;
    db.collection('commentsphoto').find({name: affiliateName}).toArray(function (err, result) {
      res.send(result);
    })
  }); // end of /viewRISCalendarEvents get request

  app.get('/fetchCommentsPhoto', formidable(), function (req,res) {
    var affiliateName = req.query.affiliateName;
    console.log('affiliate name is ', affiliateName);
    if (affiliateName !== "all"){
      db.collection('commentsphoto').find({name: affiliateName}).toArray(function (err, result) {
        res.send(result);
      })
    } else {
      db.collection('commentsphoto').find().toArray(function (err, result) {
        res.send(result);
      })
    }
  }); // end of /fetchCommentsPhoto get request

  app.get('/fetchCommentsPerAffiliate', formidable(), function (req,res) {
    var affiliateName = req.query.affiliateName;
    affiliateName = JSON.parse(affiliateName);
    affiliateName = affiliateName.name;
    if (affiliateName !== "all"){
      // console.log('fetching all comments from ', affiliateName);
      db.collection('commentsphoto').find({name: affiliateName}).toArray(function (err, result) {
        res.send(result);
      })
    } else {
      // console.log('fetching all comments');
      db.collection('commentsphoto').find().toArray(function (err, result) {
        res.send(result);
      })
    }
  }); // end of /fetchCommentsPhoto get request

  app.get('/removeFile', formidable(), function (req,res) {
        console.log('inside removeFile, queries are ', req.query);
    var fileName = req.query.fileName;
    var tableName = req.query.tableName;
    db.collection('commentsphoto').find({name: tableName}).toArray(function (err, result) {
      if (err) { throw new Error('No record found. ', err) };
      var recordId = result[0]._id;
      // var newFileArr = { $pull: { 'contact.phone': { number: '+1786543589455' } } } // if want to modify name only
      var newFileArr = { $pull: { 'fileUploads': { name: fileName } } };
      db.collection('commentsphoto').update(
         { _id: recordId },
         newFileArr
      )
      res.send(result);
    });
  }); // end of /removeFile get request

  app.get('/updateCategory', formidable(), function (req,res) {
      console.log('inside update cat, queries are ', req.query);
    var fileName = req.query.fileName;
    var tableName = req.query.tableName;
    var categoryName = req.query.categoryName;
    db.collection('commentsphoto').find({name: tableName}).toArray(function (err, result) {
      if (err) { throw new Error('No record found. ', err) };
      var recordId = result[0]._id;
            console.log('recordId is ', recordId);
      db.collection('commentsphoto').updateOne(
         { _id: recordId, 'fileUploads.name': fileName },
         {$set: {'fileUploads.$.category': categoryName}}
      )
      // var newFileArr = { $addToSet: { 'category': { name: fileName } } };
      // db.collection('commentsphoto').update(
      //    { _id: recordId },
      //    newFileArr
      // )
      res.send(result);
    });
  }); // end of /updateCategory get request

  app.get('/loginPrivilege', formidable(), function (req,res) {
      var userInput = JSON.parse(req.query.formData);
      var tableName = req.query.tableName;
      var privilegeType = req.query.privilegeType;
      console.log('inside backend loginprivilege, user input is ', userInput, 'tablename is ', tableName, 'privilegeType ', privilegeType);

      db.collection(tableName).find({username: userInput.username}).toArray(function (err, result) {
        console.log('result from db is ', result[0]);
        if ( ((result[0].username === userInput.username) && (result[0].password === userInput.password) && result[0].privilege === privilegeType) || ((result[0].username === userInput.username) && (result[0].password === userInput.password) && result[0].privilege === 'Master') ){
          console.log('a match, initializing session');
          req.session.user = userInput;
          console.log('new session is ', req.session.user, 'and', req.session);
          res.send(result);
        }
        else {
          res.status(500).send('error')
        }
      })
  }); // end of /loginPrivilege get request

  app.get('/loginEmployees', formidable(), function (req,res) {
    var userInput = JSON.parse(req.query.formData);
    var employeeSelected = JSON.parse(req.query.employeeSelected);
    db.collection('employees').find({'email': employeeSelected.email}).toArray(function (err, result) {
      console.log('result is ', result[0]);
      if ((result[0].email === employeeSelected.email) && (result[0].email === userInput.email) && (result[0].password === userInput.password)){
        req.session.user = userInput;
        res.send(result);
      }
      else {
        db.collection('admins').find({'username': userInput.email}).toArray(function (err2, result2) {
          if (err2) { throw new Error('No record found. ', err2) };
          console.log('result2 is ', result2)
          if ((result2 && result2[0]) && (result2[0].username === userInput.email) && (result2[0].password === userInput.password) && (result2[0].privilege === 'Master')){
            res.send(result2);
          } else {
            console.log('no match')
            // if (err2) { throw new Error('No record found. ', err2) };
            res.status(500).send('error')
          }
        })
      }
    })
  }); // end of /loginEmployees get request

  app.get('/fetchgeneralInfoPerAffiliate', formidable(), function (req,res) {
    var affiliateName = req.query.affiliateName;
    console.log('affiliate name is ',affiliateName, typeof(affiliateName));
    db.collection('generalinfo').find({'name': affiliateName}).toArray(function (err, result) {
      if (err) { throw new Error('No record found. ', err) };
      console.log('result is ', result);
      if (result[0]){
        res.send(result[0]);
      } else {
        throw new Error('No record found. ', err)
      }
    })
  }); // end of /fetchgeneralInfoPerAffiliate get request


  app.put('/saveTimesheet', function (req,res) {
    var timesheet = req.body.timesheet;
    var affiliate = req.body.timesheet.affiliate;

    db.collection('timesheets').find({name: affiliate}).toArray(function (err, result) {
      if (err) { throw new Error('No record found. ', err) };
      var recordId = result[0]._id;
      console.log('recordId:', recordId);
      var newTimesheet = { $addToSet: {timesheets: timesheet} };
      db.collection('timesheets').update(
         { _id: recordId },
         newTimesheet
      )
      console.log('timesheet is saved in db', timesheet, typeof(timesheet));
      res.send(result);
    })
  });

  app.put('/deleteTimesheet', function (req,res) {
    var timesheet = req.body.timesheet;
    var affiliate = req.body.timesheet.affiliate;
    console.log('ts is ', timesheet, typeof(timesheet));

    db.collection('timesheets').find({name: affiliate}).toArray(function (err, result) {
      if (err) { throw new Error('No record found. ', err) };
      var recordId = result[0]._id;
      console.log('recordId:', recordId);
      var newTimesheet = { $pull: {timesheets: timesheet} };
      db.collection('timesheets').update(
         { _id: recordId },
         newTimesheet
      )
      console.log('timesheet is delete from db', timesheet, typeof(timesheet));
      res.send(result);
    })
  });



  app.post('/addCalendarEvent', formidable(), function (req,res) {
    db.collection('calendar').save(req.body.newEvent, function(err, result){
      if (err) { return console.log('connecting to db, but not saving obj', err);}
      console.log('contact form saved to database', result);
      res.send(result);
    })
  });



  app.post('/addCalendarEvent', formidable(), function (req,res) {
    db.collection('calendar').save(req.body.newEvent, function(err, result){
      if (err) { return console.log('connecting to db, but not saving obj', err);}
      console.log('contact form saved to database', result);
      res.send(result);
    })
  });

  //the GET call below is meant to be the POST CALL above but smth is parsing wrong.
  app.get('/fetchRISSchedulerEvent', formidable(), function (req,res) {
    console.log('inside fetch ris calendar', req.query.newEvent);
    var parsedNewEvent = JSON.parse(req.query.newEvent);
    db.collection('calendar-ris').save(parsedNewEvent, function(err, result){
      if (err) { return console.log('connecting to db, but not saving obj', err);}
      console.log('contact form saved to database', result);
      res.send(result);
    })
  });

  //the GET call below is meant to be the POST CALL above but smth is parsing wrong.
  app.get('/fetchAffiliateSchedulerEvent', formidable(), function (req,res) {
    console.log('inside addcalendarevent, backend');
    console.log('inside fetch affiliate calendar', req.query.newEvent);
    var parsedNewEvent = JSON.parse(req.query.newEvent);
    var affiliateName = req.query.affiliateName
    db.collection('commentsphoto').find({name: affiliateName}).toArray(function (err, result) {
      if (err) { throw new Error('No record found. ', err) };
      var recordId = result[0]._id;
      var eventObj = { $addToSet: {scheduler: parsedNewEvent} };
      console.log('recordId:', recordId);
      console.log("event obj is ", eventObj);
      db.collection('commentsphoto').update(
         { _id: recordId },
         eventObj
      )
      res.send(result);
    });
  });


  app.post('/addEmployee', formidable(), function (req,res) {
    db.collection('employees').save(req.body.newEmployee, function(err, result){
      if (err) { return console.log('connecting to db, but not saving obj', err);}
      console.log('new employee saved to database', result);
      res.send(result);
    })
  });

  app.post('/uploadFiles', formidable(), function(req, res) {
          console.log('uploadFiles from backend is ', req.files);
    var binaryLocation = req.files.file.path;
    var fileName = req.files.file.name;
          console.log('file name is ', fileName);
    var binaryData = fs.readFileSync(binaryLocation);
    var theFile = {};
    theFile.data = binaryData
    theFile.name = fileName;
    theFile.category = 'all';
    var fileObj = { $push: {"fileUploads": theFile} };
    var tableName = req.query.tableName;
          console.log('table name backend is ', tableName);
    db.collection('commentsphoto').update(
       { name: tableName },
       fileObj
    )
    res.send();
  });

//fetchComment should be a POST request, but not working for some reason
  app.get('/fetchComment', formidable(), function (req,res) {
    console.log('adding new comment');
    var parsedContent = JSON.parse(req.query.content);
    var parsedAffiliate = JSON.parse(req.query.affiliate);
    var updatedComment = {
      message: parsedContent.message,
      author: parsedContent.author,
      email: parsedContent.email
    };
    console.log('affiliate is ', parsedAffiliate.name, 'content is ', updatedComment);

    db.collection('commentsphoto').find({name: parsedAffiliate.name}).toArray(function (err, result) {
      if (err) { throw new Error('No record found. ', err) };
      var recordId = result[0]._id;
      var commentObj;
      console.log('recordId:', recordId);
      commentObj = { $addToSet: {comments: updatedComment} };

      db.collection('commentsphoto').update(
         { _id: recordId },
         commentObj
      )
      res.send(result);
    });
  }); // end of /fetchComment post request




  app.put('/updateCommentsPhoto', formidable(), function (req,res) {
    console.log('inside update comments photo');
    var newComment = {
      message: req.body.content.message,
      author: req.body.content.author,
      email: req.body.content.email
    }
    console.log('affiliate is ', req.body.affiliate, 'content is ', req.body.content);

    db.collection('commentsphoto').find({name: req.body.affiliate.name}).toArray(function (err, result) {
      if (err) { throw new Error('No record found. ', err) };
      var operation = req.body.operation;
      var recordId = result[0]._id;
      var commentObj;
      console.log('operation: ', operation, 'recordId:', recordId);

      if (operation === 'add') {
        commentObj = { $addToSet: {comments: newComment} };
      } else if (operation === 'delete') {
        commentObj = { $pull: {comments: newComment} };
      }

      console.log("comment obj is ", commentObj);
      db.collection('commentsphoto').update(
         { _id: recordId },
         commentObj
      )
      res.send(result);
    });
  });


  app.put('/updateAffiliateRidesData', formidable(), function(req,res) {
    console.log('req body is ', req.body);
    var myQuery = {_id: new mongo.ObjectId(req.body._id)};
    var newValues = {$set: {affiliateName: req.body.affiliateName, totalRideCount: req.body.totalRideCount, totalMiles: req.body.totalMiles, totalActiveMembers: req.body.totalActiveMembers  } };
    //add extra param if object is itnamerica and has extra voluteer ride count, so newValues obj must be modified.
    db.collection('ridesdatamonthly').findAndModify(myQuery, [['_id','asc']], newValues, {}, function(err, result){
      if (err) { throw new Error('No record found. ', err) };
      console.log('record has been updated, i think');
      res.send(result);
    });
  }); // end of /updateAffiliateRidesData edit request


  app.put('/updateEmployee', formidable(), function(req,res) {
    console.log('employee is ', req.body.employee);
    var employee = req.body.employee;
    var myQuery = {_id: new mongo.ObjectId(employee._id)};
    var newValues = {$set: {firstName: employee.firstName, lastName: employee.lastName, avatar: employee.avatar, dob: employee.dob, bio: employee.bio, email: employee.email, username: employee.username, password: employee.password, position: employee.position, files: employee.files  } };
    db.collection('employees').findAndModify(myQuery, [['_id','asc']], newValues, {}, function(err, result){
      if (err) { throw new Error('No record found. ', err) };
      console.log('record has been updated, i think');
      res.send(result);
    });
  }); // end of /updateEmployee edit request



  app.delete('/deleteComment', formidable(), function (req,res) {
    console.log('inside delete comments');
    var parsedContent = JSON.parse(req.query.content);
    var parsedAffiliate = JSON.parse(req.query.affiliate);
    var operation = req.query.operation;
    var updatedComment = {
      message: parsedContent.message,
      author: parsedContent.author,
      email: parsedContent.email
    };
    console.log('affiliate is ', parsedAffiliate.name, 'content is ', updatedComment, 'operation is ', operation);

    db.collection('commentsphoto').find({name: parsedAffiliate.name}).toArray(function (err, result) {
      if (err) { throw new Error('No record found. ', err) };
      var recordId = result[0]._id;
      var commentObj;

      console.log('operation: ', operation, 'recordId:', recordId);

      if (operation === 'add') {
        commentObj = { $addToSet: {comments: updatedComment} };
      } else if (operation === 'delete') {
        commentObj = { $pull: {comments: updatedComment} };
      }
      console.log("comment obj is ", commentObj);

      db.collection('commentsphoto').update(
         { _id: recordId },
         commentObj
      )
      res.send(result);
    });
  }); // end of /deleteComment delete request


  app.delete('/deleteForm/:formId', formidable(), function (req,res) {
    console.log('req param', req.params.formId, 'req query', req.query.formType);
      var tableName = req.query.formType;
      var recordId = req.params.formId;
      db.collection(tableName).deleteOne({_id: new mongo.ObjectId(recordId)}, function(err, result){
        if (err) { throw new Error('No record found. ', err) };
        console.log('record has been removed, i think ', result);
        res.send(result);
      });
  }); // end of deleteform request

  app.delete('/deleteAgendaEvent', formidable(), function (req,res) {
      var agendaEvent = JSON.parse(req.query.agendaEvent);
      var dbName = req.query.dbName;
      console.log('agenda event is ', agendaEvent, 'db name is ', dbName);
      console.log('title and description', agendaEvent.title, agendaEvent.description);

      db.collection(dbName).deleteOne({description: agendaEvent.description}, function(err, result){
        if (err) { throw new Error('No record found. ', err) };
        console.log('record has been removed, i think');
        res.send(result);
      });
  }); // end of deleteagendaevent request

  app.delete('/deleteRISCalendarEvent/:recordId', formidable(), function (req,res) {
    var recordId = req.params.recordId;
    var dbName = req.query.dbName;
    db.collection(dbName).deleteOne({_id: new mongo.ObjectId(recordId)}, function(err, result){
      if (err) { throw new Error('No record found. ', err) };
      console.log('record has been removed, i think');
      res.send(result);
    });
  }); // end of deleteriscalendarevent request
});//end of mongoclient


  //the GET call below is meant to be the DELETE CALL above but smth is parsing wrong.
  app.delete('/deleteAffiliateEventObj', formidable(), function (req,res) {
    var parsedEventToDelete = JSON.parse(req.query.event);
    var affiliateName = req.query.affiliateName;
    db.collection('commentsphoto').find({name: affiliateName}).toArray(function (err, result) {
      if (err) { throw new Error('No record found. ', err) };
      var recordId = result[0]._id;
      var matchConditions = {author: parsedEventToDelete.author, description: parsedEventToDelete.description, title: parsedEventToDelete.title};
      console.log('match conditions are ', matchConditions);
      var eventObj = { $pull: {scheduler: matchConditions} };
      console.log('recordId:', recordId);
      console.log("event obj is ", eventObj);
      db.collection('commentsphoto').update(
         { _id: recordId },
         eventObj
      )
      res.send(result);
    });
  });



app.post('/sendmail', function(req, res){
  console.log('post req', req.body);

    let transporter = nodemailer.createTransport(smtpTransport({
       service: "Gmail",  // sets automatically host, port and connection security settings
       auth: {
           user: gmail_login,
           pass: gmail_pass
       }
    })
  )

  let mailOptions = {};
  if (req.body && req.body.pdf && req.body.formType === 'ndaform'){ //NDA forms
    console.log('sending email with pdf, NDA form is ', req.body.formType);
    var htmlObj = "<p><strong>Name</strong>: " + req.body.text.name + "</p>\n" +
        "<p><strong>Email</strong>: " + req.body.text.email + "</p>\n " +
        "<p><strong>Signature</strong>: " + req.body.text.signature + "</p>\n " +
        "<p><strong>Date</strong>: " + req.body.text.date + "</p>\n " +
        "<p><strong>User Consented</strong>: " + req.body.text.agree + "</p>\n ";
    var htmlObj = req.body.html + htmlObj;
    mailOptions = {
        from: req.body.from, // sender address
        to: req.body.to, // list of receivers
        subject: req.body.subject, // Subject line
        text: JSON.stringify(req.body.text), // plain text body
        html: htmlObj,
        attachments: [{path: req.body.pdf}],
        bcc: 'support@itnamerica.org;katherine.freund@itnamerica.org'
    };
  }
  else if (req.body && req.body.pdf){ //membership, volunteer and non-rider apps
    console.log('sending email with pdf, membership, volunteer or non-rider forms');
    mailOptions = {
        from: req.body.from, // sender address
        to: req.body.to, // list of receivers
        subject: req.body.subject, // Subject line
        text: JSON.stringify(req.body.text), // plain text body
        attachments: [{path: req.body.pdf}],
        bcc: 'info@itnamerica.org;morgan.jameson@itnamerica.org'
    };
  }
  else if (req.body && req.body.formType === 'hrcontactform'){ ///private contact form from ITN staff to HR
    console.log('sending email without pdf, contact form');
    mailOptions = {
        from: req.body.from, // sender address
        to: req.body.to, // list of receivers
        subject: req.body.subject, // Subject line
        html: req.body.html, // html body
        bcc: 'jean.palanza@itnamerica.org'
    };
  }
  else if (req.body && req.body.formType.email){ //private contact form from ITN staff to ITN staff
    console.log('sending email without pdf, contact form');
    mailOptions = {
        from: req.body.from, // sender address
        to: req.body.to, // list of receivers
        subject: req.body.subject, // Subject line
        html: req.body.html, // html body
        bcc: req.body.formType.email
    };
  }
  else if (req.body && req.body.html){ //regular/public contact forms
    console.log('sending email without pdf, contact form');
    mailOptions = {
        from: req.body.from, // sender address
        to: req.body.to, // list of receivers
        subject: req.body.subject, // Subject line
        html: req.body.html, // html body
        bcc: 'info@itnamerica.org;morgan.jameson@itnamerica.org'
    };
  } else { //all else
    console.log('sending email with neither');
    mailOptions = {
        from: req.body.from, // sender address
        to: req.body.to, // list of receivers
        subject: req.body.subject, // Subject line
        text: JSON.stringify(req.body.text), // plain text body
        bcc: 'info@itnamerica.org;morgan.jameson@itnamerica.org'
    };
  }

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        transporter.close();
    });

    MongoClient.connect('mongodb://itnadmin:itnUser0136!@ds119442.mlab.com:19442/itnamerica-new', function(err, client) {
      if (err) {
        console.log('db not connecting, but inside mongo block - 2', err);
      };
      db = client.db('itnamerica-new');


      var objWithPDF; var pdfVal;

      if ((req.body && req.body.html) && (req.body.formType === 'contact')) {
        var contactObj = {
          subject: req.body.text.subject,
          messageBody: req.body.text.messageBody,
          name: req.body.text.name,
          email: req.body.text.email,
          phone: req.body.text.phone,
          date: req.body.text.date,
        };
        db.collection('contactform').save(contactObj, function(err, result){
          if (err) { return console.log('connecting to db, but not saving obj', err);}
          console.log('contact form saved to database', result);
          // res.redirect('/');
        })
      }
      else if (req.body.text.email && (req.body.formType === 'newsletter')) {
        db.collection('newsletterform').save(req.body.text, function(err, result){
          if (err) { return console.log('connecting to db, but not saving obj', err);}
          console.log('newsletter form saved to database', result);
          // res.redirect('/');
        })
      }
      else if (req.body && (req.body.formType === 'ndaform')) {
        var ndaObj = {
          name: req.body.text.name,
          signature: req.body.text.signature,
          date: req.body.text.date,
          email: req.body.text.email,
          affiliate: req.body.text.itnAffiliate,
          agree: req.body.text.agree,
          pdf: req.body.pdf
        };
        db.collection('ndaform').save(ndaObj, function(err, result){
          if (err) { return console.log('connecting to db, but not saving obj', err);}
          console.log('nda form saved to database', result);
          // res.redirect('/');
        })
      } else if ((req.body && req.body.html) && (req.body.formType === 'hrcontactform')) {
        console.log('inside HR backend block',req.body.html);
        var contactObj = {
          subject: req.body.text.subject,
          messageBody: req.body.text.messageBody,
          name: req.body.text.name,
          email: req.body.text.email,
          phone: req.body.text.phone,
          date: req.body.text.date,
        };
        db.collection('hrcontactform').save(contactObj, function(err, result){
          if (err) { return console.log('connecting to db, but not saving obj', err);}
          console.log('newsletter form saved to database', result);
          // res.redirect('/');
        })
      }
    });//end of mongoclient
    console.log('after mongo block');
    res.end();
  }); // end /sendmail post request




  app.get('/fetchBlah', formidable(), function(req, res){
    console.log('INSIDE FETCHMAIL, req query is ', req.query);
    var parsedAffiliateObj = JSON.parse(req.query.formType);
    var from = req.query.from;
    var to = req.query.to;
    var subject = req.query.subject;
    var html = req.query.html;
    var emailObj = {
        from: from,
        to: to,
        subject: subject,
        html: html,
        bcc: parsedAffiliateObj.email
    };
    console.log('email obj is ', emailObj);
    let transporter = nodemailer.createTransport(smtpTransport({
       service: "Gmail",  // sets automatically host, port and connection security settings
       auth: {
           user: gmail_login,
           pass: gmail_pass
       }
    }))
    transporter.sendMail(emailObj, function(error, info) {
        if (error) {return console.log(error)}
        console.log('Message sent: %s', info.messageId);
        transporter.close();
    });
      res.end();
    });// end /fetchmail get request


  app.use(allPages, function(req, res){
    res.sendFile(__dirname + '/app/index.html');
  });



app.listen(process.env.PORT || 13270);
