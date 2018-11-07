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
// var router = express.Router();
var multer = require('multer');
// var upload = multer({ storage : storage}).single('userPhoto');
var upload = multer({ dest: 'uploads/' })
var multipart = require('connect-multiparty');
var formidable = require('express-formidable');


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(express.json()); //convert req to json
app.use(express.static(__dirname + '/app'));
app.use(session({secret: "Sam is awesome"}));
app.use(formidable());

// app.use(bodyParser.json({limit: '50mb'}));
// app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
// app.use(multer({ dest: './tmp/'}));
app.use(bodyParser.json()); // Configures bodyParser to accept JSON
app.use(bodyParser.urlencoded({
    extended: false
}));
//
// app.use(multipart({
// 	uploadDir: 'app/dist'
// }));


var allPages = ['/home','/what-we-do','/organization','/faces-of-our-members','/faq','/news','/contact','/become-member','/member-app','/volunteer-to-drive','/volunteer-app','/family-involvement','/member-programs','/pay-online','/donate','/corporate', '/non-rider-member','/dashboard','/login', '/view-form','/draft','/million-rides-campaign-photo-album','/annual-report-2017','/about','/ways-to-give','/find-your-itn','/portal','/login-portal','/itnamerica','/itn-operations','/other','/rides-in-sight','/nda2018xyz','/rides','/calendar','/human-resources','/agenda','/ttp','/research','/important-docs', '/important-docs-landing','/employee-profiles','/dept-report','/hr-tickets', '/calendar-ris'];

MongoClient.connect('mongodb://itnadmin:itnUser0136!@ds119442.mlab.com:19442/itnamerica-new', function(err, client) {
  if (err) {
    console.log('db not connecting, but inside mongo block - 1', err);
  };
  db = client.db('itnamerica-new');

  console.log('inside first mongo block');

  app.get('/getBlogContent', function(req, res) {
    console.log('params are ', req.query.blogURL)
    request.get(req.query.blogURL, function(err,result,body) {
      res.send(result.body)
    });
  });

  app.get('/getNDAForms', function (req,res) {
      db.collection('ndaform').find().toArray(function (err, result) {
        res.send(result);
      })
  }); // end of /getContactForms get request

  app.get('/getContactForms', function (req,res) {
      db.collection('contactform').find().toArray(function (err, result) {
        res.send(result);
      })
  }); // end of /getContactForms get request

  app.get('/getHRContactForms', function (req,res) {
      db.collection('hrcontactform').find().toArray(function (err, result) {
        res.send(result);
      })
  }); // end of /getHRContactForms get request

  app.get('/getNewsletterForms', function (req,res) {
      db.collection('newsletterform').find().toArray(function (err, result) {
        res.send(result);
      })
  }); // end of /getNewsletterForms get request

  app.get('/getAllRides', function (req,res) {
      db.collection('ridesdatamonthly').find().toArray(function (err, result) {
        res.send(result);
      })
  }); // end of /getRidesData get request

  app.get('/getEmployees', function (req,res) {
      db.collection('employees').find().toArray(function (err, result) {
        res.send(result);
      })
  }); // end of /getEmployees get request

  app.get('/getCommentsPhoto', function (req,res) {
    db.collection('commentsphoto').find().toArray(function (err, result) {
      res.send(result);
    })
  }); // end of /getRidesData get request

  app.get('/viewCalendarEvents', function (req,res) {
    db.collection('calendar').find().toArray(function (err, result) {
      res.send(result);
    })
  }); // end of /viewCalendarEvents get request

  app.get('/viewRISCalendarEvents', function (req,res) {
    db.collection('calendar-ris').find().toArray(function (err, result) {
      res.send(result);
    })
  }); // end of /viewRISCalendarEvents get request

  app.post('/addCalendarEvent', function (req,res) {
    db.collection('calendar').save(req.body.newEvent, function(err, result){
      if (err) { return console.log('connecting to db, but not saving obj', err);}
      console.log('contact form saved to database', result);
      res.send(result);
    })
  });

  app.post('/addRISCalendarEvent', function (req,res) {
    db.collection('calendar-ris').save(req.body.newEvent, function(err, result){
      if (err) { return console.log('connecting to db, but not saving obj', err);}
      console.log('contact form saved to database', result);
      res.send(result);
    })
  });

  app.post('/addEmployee', function (req,res) {
    db.collection('employees').save(req.body.newEmployee, function(err, result){
      if (err) { return console.log('connecting to db, but not saving obj', err);}
      console.log('new employee saved to database', result);
      res.send(result);
    })
  });
  
  app.post('/uploadFiles', function(req, res) {
    console.log('uploadFiles from backend is ');
    console.log(req.files);
    var fileObj = { $push: req.files };
    var tableName = req.query.tableName
    console.log('table name backend is ', tableName);
    db.collection('commentsphoto').update(
       { name: tableName },
       fileObj
    )
    res.end();
  });

  app.put('/updateCommentsPhoto', function (req,res) {
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
  }); // end of /updateCommentsPhoto get request

  app.put('/updateAffiliateRidesData', function(req,res) {
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


  app.put('/updateEmployee', function(req,res) {
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

  app.get('/loginPrivilege', function (req,res) {
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


  app.get('/loginEmployees', function (req,res) {
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

  app.delete('/deleteForm/:formId', function (req,res) {
    console.log('req param', req.params.formId, 'req query', req.query.formType);
      var tableName = req.query.formType;
      var recordId = req.params.formId;
      db.collection(tableName).deleteOne({_id: new mongo.ObjectId(recordId)}, function(err, result){
        if (err) { throw new Error('No record found. ', err) };
        console.log('record has been removed, i think ', result);
        res.send(result);
      });
  }); // end of deleteform request


  app.delete('/deleteAgendaEvent', function (req,res) {
      var agendaEvent = JSON.parse(req.query.agendaEvent);
      console.log('title and description', agendaEvent.title, agendaEvent.description);

      db.collection('calendar').deleteOne({"title": agendaEvent.title}, function(err, result){
        console.log('record has been removed, i think');
        res.send(result);
      });
  }); // end of deleteagendaevent request

});//end of mongoclient



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
        bcc: 'katherine.freund@itnamerica.org;'
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


  app.use(allPages, function(req, res){
    res.sendFile(__dirname + '/app/index.html');
  });

  // app.get('/affiliates/:affiliateName', function(req , res){
  //   res.render('affiliates' + req.params.affiliateName);
  // });



app.listen(process.env.PORT || 13270);
