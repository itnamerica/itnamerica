var express = require('express');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var app = express();

const MongoClient = require('mongodb').MongoClient;
var mongo = require('mongodb');
var session = require('express-session');
var cookieParser = require('cookie-parser');

var env = require(__dirname + '/env-vars.js');
var gmail_login = env.gmail_login;
var gmail_pass = env.gmail_pass;
var db;
// var router = express.Router();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


app.use(express.json()); //convert req to json
app.use(express.static(__dirname + '/app'));

app.use(session({secret: "Sam is awesome"}));




// app.use(function(req, res, next) {
  // res.header("Access-Control-Allow-Origin", "*");
  // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  // next();
  // res.setHeader('Access-Control-Allow-Origin', 'http://blog.itnamerica.org/life-keeps-going/');
  // session({secret: "Sam is awesome"})
// });


app.get('http://blog.itnamerica.org', function (req,res) {
    console.log('response is ', res);
    res.send(res);
}); 


var allPages = ['/home','/what-we-do','/organization','/faces-of-our-members','/faq','/news','/contact','/become-member','/member-app','/volunteer-to-drive','/volunteer-app','/family-involvement','/member-programs','/pay-online','/donate','/corporate', '/non-rider-member','/dashboard','/login', '/view-form','/draft','/million-rides-campaign-photo-album','/annual-report-2017','/about','/ways-to-give','/find-your-itn','/portal','/login-portal'];

MongoClient.connect('mongodb://itnadmin:itnUser0136!@ds119442.mlab.com:19442/itnamerica-new', function(err, client) {
  if (err) { 
    console.log('db not connecting, but inside mongo block - 1', err);
  };
  db = client.db('itnamerica-new');
  
  console.log('inside first mongo block');
  
  app.get('/getContactForms', function (req,res) {
      db.collection('contactform').find().toArray(function (err, result) {
        console.log('result is ', result);
        res.send(result);
      })
  }); // end of /getContactForms get request
  
  app.get('/getNewsletterForms', function (req,res) {
      db.collection('newsletterform').find().toArray(function (err, result) {
        console.log('result is ', result);
        res.send(result);
      })
  }); // end of /getNewsletterForms get request
  
  
  app.get('/getAdmin', function (req,res) {
    var tableName;
      if (req.query.isStaff) {
        tableName = 'staffusers';
      } else {
        tableName = 'users';
      }
      db.collection(tableName).find().toArray(function (err, result) {
        var userInput = JSON.parse(req.query.formData);
        console.log('user input is ',userInput, 'result from db is ', result);
        if ((result[0].username === userInput.username) && (result[0].password === userInput.password)){
          console.log('a match, initializing session');
          req.session.user = userInput;
          console.log('new session is ', req.session.user, 'and', req.session);
          res.send(result);
        }
        else {
          res.status(500).send('error')
        }  
      })
  }); // end of /getAdmin get request
  
  app.delete('/deleteForm/:formId', function (req,res) {
    console.log('req param', req.params.formId, 'req query', req.query.formType);
      var tableName = req.query.formType;
      var recordId = req.params.formId;
      db.collection(tableName).deleteOne({_id: new mongo.ObjectId(recordId)}, function(err, result){
        console.log('record has been removed, i think');
        res.send(result);
      });
  }); // end of delete request
  
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
  if (req.body && req.body.pdf){
    console.log('sending email with pdf, membership, volunteer or non-rider forms');
    mailOptions = {
        from: req.body.from, // sender address
        to: req.body.to, // list of receivers
        subject: req.body.subject, // Subject line   
        text: JSON.stringify(req.body.text), // plain text body
        attachments: [{path: req.body.pdf}],
        bcc: 'info@itnlanier.org'
    };
  }
  else if (req.body && req.body.html){
    console.log('sending email without pdf, contact form');
    mailOptions = {
        from: req.body.from, // sender address
        to: req.body.to, // list of receivers
        subject: req.body.subject, // Subject line   
        text: JSON.stringify(req.body.text), // plain text body
        html: req.body.html, // html body
        bcc: 'info@itnlanier.org'
    };
  } else {
    console.log('sending email with neither');
    mailOptions = {
        from: req.body.from, // sender address
        to: req.body.to, // list of receivers
        subject: req.body.subject, // Subject line   
        text: JSON.stringify(req.body.text), // plain text body
        bcc: 'info@itnlanier.org'
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
        db.collection('contactform').save(req.body.text, function(err, result){
          if (err) { return console.log('connecting to db, but not saving obj', err);}
          console.log('contact form saved to database', result);
          // res.redirect('/');
        })
      }
      else if (req.body.text.email && (req.body.formType === 'newsletter')) {
        console.log('inside newsletter backend block',req.body.text);
        db.collection('newsletterform').save(req.body.text, function(err, result){
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
  


app.listen(process.env.PORT || 13270);

