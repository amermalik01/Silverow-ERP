var MailListener = require("mail-listener4");
var config = require('./config.json');
var request = require('request');
var fs = require('fs');
var employeeList = [];
var virtualEmailList = [];
let Token;
let imapConfig = {};
let mailListeners = {};
let virtualMailListeners = {};

/* process.argv.forEach(function (val, index, array) {
  console.log(index + ': ' + val);

}); */

config.silverow_username = process.argv[2];
config.silverow_password = process.argv[3];

// var employees = [
//   { id: 1, username: "ahmad.hassan@silverow.com", password: "Bs2k9fm245" },
//   { id: 2, username: "silverow_pivet@outlook.com", password: "thetrust@321" }
// ];

let getEmployeeEmails = function (token) {
  console.log("getting employee emails...");
  return new Promise(function (resolve, reject) {
    var uri = config.silverow_getAllEmployeeEmails + '?token=' + Token;
    request(uri, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var jsonbody = JSON.parse(body);
        employeeList = jsonbody.response;
        resolve(employeeList);
      }
      else {
        console.log(response.statusCode);
      }
    });


  });
}


let getVirtualEmails = function (token) {
  console.log("getting Virtual emails...");
  return new Promise(function (resolve, reject) {
    var uri = config.silverow_getAllVirtualEmails + '?token=' + Token;
    request(uri, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var jsonbody = JSON.parse(body);
        virtualEmailList = jsonbody.response;
        resolve(virtualEmailList);
      }
    });


  });
}



let getPrimaryConfiguration = function (token) {
  console.log("getting primary configuration...");
  return new Promise(function (resolve, reject) {
    var uri = config.silverow_getPrimaryConfiguration + '?token=' + token;
    request(uri, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var jsonbody = JSON.parse(body);
        imapConfig.host = jsonbody.imapserver;
        imapConfig.port = jsonbody.imapport;
        imapConfig.ssl = jsonbody.imapssl == "On" ? true : false;
        resolve(jsonbody);
      }
    });


  });
}

let getUserToken = new Promise(function (resolve, reject) {
  console.log("getting user token...");
  var uri = config.silverow_login_URL + '?user_name=' + config.silverow_username + '&password=' + config.silverow_password + '&fromNode=1';
  request(uri, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var jsonbody = JSON.parse(body);
      Token = jsonbody.response.token;
      resolve(jsonbody);
    }
    else if (error) {
      console.log(error);
    }
    else {
      console.log('Request URL:', uri);
      console.log('Response Status Code: ', response.statusCode);
    }

  });
});

getUserToken.then(function (resp) {
  Token = resp.response.token;
  getEmployeeEmails(Token).then(function (resp2) {
    getVirtualEmails(Token).then(function (resp3) {
      getPrimaryConfiguration(Token).then(function (resp4) {
        initiateListeners();
      })
    })

  })
})


let initiateListeners = function (emp) {
  mailListeners = {};
  mailListeners.count = 0;


  employeeList.forEach(function (obj) {
    mailListeners.count++;
    console.log("Filter for", obj.user_email, ((obj.lastUID ? (parseInt(obj.lastUID) + 1) : 0) + ':*'));
    mailListeners[obj.id] = new MailListener({
      username: obj.user_email,
      password: obj.email_password,
      host: obj.imapserver,
      port: obj.imapport, // imap port
      tls: true,
      connTimeout: 10000, // Default by node-imap
      authTimeout: 5000, // Default by node-imap,
      socketTimeout: 0,
      debug: console.log, // Or your custom function with only one incoming argument. Default: null
      tlsOptions: {
        rejectUnauthorized: false
      },
      mailbox: "Inbox", // mailbox to monitor
      searchFilter: [`${obj.lastUID ? (parseInt(obj.lastUID) + 1) : 1}:*`], // the search filter being used after an IDLE notification has been retrieved      
      markSeen: false, // all fetched email willbe marked as seen and not fetched next time
      fetchUnreadOnStart: true, // use it only if you want to get all unread email on lib start. Default is `false`,
      mailParserOptions: {
        streamAttachments: true
      }, // options to be passed to mailParser lib.
      attachments: true, // download attachments as they are encountered to the project directory
      attachmentOptions: {
        directory: '\\attachments/'
      } // specify a download directory for attachments
    });
    mailListeners[obj.id].on("server:connected", function () {
      console.log("imapConnected", obj.user_email);
    });

    mailListeners[obj.id].on("server:disconnected", function () {
      console.log("imapDisconnected", obj.user_email);

      if (mailListeners && mailListeners[obj.id]) {
        mailListeners[obj.id].stop();
        mailListeners[obj.id].start();
      }
      // setTimeout(function () {
      //   console.log("Trying to establish imap connection again");
      // restartMailListener(obj.id);
      // }, 5 * 1000);
    });

    mailListeners[obj.id].on("error", function (err) {
      console.log("Error occured");
      console.table(err);
      if (err.errno == "ECONNRESET" || err.source == "timeout") {
        mailListeners[obj.id].start();
      }
      else {
        if (mailListeners && mailListeners[obj.id]) {
          mailListeners[obj.id].stop();
          delete mailListeners[obj.id];
        }
      }
    });

    mailListeners[obj.id].on("mail", function (mail, seqno, attributes) {
      if (attributes && attributes.uid && obj.lastUID && attributes.uid <= obj.lastUID) {
        console.log("ignoring this email", obj.user_email, attributes.uid);
        return;
      }
      else {
        if (attributes && attributes.uid)
          console.log("Current UID", attributes.uid, "Last UID", obj.lastUID);
      }
      console.log('-----------------------------------------------------------------------');
      // do something with mail object including attachments
      console.log("Email Recieved Fr \n", mail.from);
      console.log("Email Recieved To \n", mail.to);
      console.log("Email Recieved CC \n", mail.cc);
      console.log("Seq No.", seqno);
      console.log("attributes", attributes);

      mail.to = mail.to.map(function (obj) {
        return obj.address;
      }).join(";");
      if (mail.cc && mail.cc.length) {
        mail.cc = mail.cc.map(function (obj) {
          return obj.address;
        }).join(";");
      }
      // console.log("MAIL OBJECT \n", mail.html);
      // console.log(mail);
      var uploademail = {
        token: Token,
        creation_time: '',
        subject: mail.subject,
        body: mail.html,
        sender: mail.from,
        receiverId: obj.empId,
        receiver: obj.user_email,
        receiverAlias: obj.empAlias,
        sender_name: mail.from.name,
        sender_email_address: mail.from.address,
        attachments: mail.attachments,
        cc: mail.cc,
        to: mail.to,
        bcc: '',
        attachment_count: '',
        company_id: obj.company_id,
        uid: attributes && attributes.uid ? attributes.uid : ''
      };



      UploadEmail(uploademail, function (response) {
        console.log('Server Response: ', response);




        console.log('-----------------------------------------------------------------------');
      });
      // var jsonmail;
      // for (var email of mail.from) {
      //   jsonmail = email;
      // }
      // for (var email of EmailList) {
      //   if (email == jsonmail.address) {
      //     console.log("Email address exist...");



      //   } //End if
      // }
      // mail processing code goes here
      console.log('-----------------------------------------------------------------------');
    });

    mailListeners[obj.id].on("attachment", function (attachment) {
      console.log('-----------------------------------------------------------------------');
      console.log('Attachment is found');
      console.log(attachment.fileName);

      var file = fs.createWriteStream("./attachments/" + attachment.fileName);
      file.on('pipe', (file) => {
        console.log('Test download ')
      });
      attachment.stream.pipe(file);
      console.log('-----------------------------------------------------------------------');
    });

    mailListeners[obj.id].start(); // start listening
  });


  virtualEmailList.forEach(function (obj) {
    obj.id = obj.virtualEmailId;
    console.log("Filter for", obj.virtualEmailAddress, ((obj.lastUID ? (parseInt(obj.lastUID) + 1) : 0) + ':*'));
    virtualMailListeners[obj.id] = new MailListener({
      username: obj.virtualEmailAddress,
      password: obj.virtualEmailPassword,
      host: obj.imapserver,
      port: obj.imapport, // imap port
      tls: true,
      connTimeout: 10000, // Default by node-imap
      authTimeout: 5000, // Default by node-imap,
      socketTimeout: 0,
      debug: console.log, // Or your custom function with only one incoming argument. Default: null
      tlsOptions: {
        rejectUnauthorized: false
      },
      mailbox: "Inbox", // mailbox to monitor
      searchFilter: [`${obj.lastUID ? (parseInt(obj.lastUID) + 1) : 1}:*`], // the search filter being used after an IDLE notification has been retrieved
      markSeen: false, // all fetched email willbe marked as seen and not fetched next time
      fetchUnreadOnStart: start, // use it only if you want to get all unread email on lib start. Default is `false`,
      mailParserOptions: {
        streamAttachments: true
      }, // options to be passed to mailParser lib.
      attachments: true, // download attachments as they are encountered to the project directory
      attachmentOptions: {
        directory: '\\attachments/'
      } // specify a download directory for attachments
    });
    virtualMailListeners[obj.id].on("server:connected", function () {
      console.log("imapConnected", obj.virtualEmailAddress);
    });

    virtualMailListeners[obj.id].on("server:disconnected", function () {
      console.log("imapDisconnected", obj.virtualEmailAddress);
      if (virtualMailListeners && virtualMailListeners[obj.id]) {
        virtualMailListeners[obj.id].stop();
        virtualMailListeners[obj.id].start();
      }
      // setTimeout(function () {
      //   console.log("Trying to establish imap connection again");
      // restartMailListener(obj.id);
      // }, 5 * 1000);
    });

    virtualMailListeners[obj.id].on("error", function (err) {
      console.log("Error occured", err);
      if (err.errno == "ECONNRESET" || err.source == "timeout") {
        virtualMailListeners[obj.id].start();
      }
      else {
        if (virtualMailListeners && virtualMailListeners[obj.id]) {

          virtualMailListeners[obj.id].stop();
          delete virtualMailListeners[obj.id];
        }
      }
    });

    virtualMailListeners[obj.id].on("mail", function (mail, seqno, attributes) {
      if (attributes && attributes.uid && obj.lastUID && attributes.uid <= obj.lastUID) {
        console.log("ignoring this email", obj.virtualEmailAddress, attributes.uid);
        return;
      }
      else {
        if (attributes && attributes.uid)
          console.log("Current UID", attributes.uid, "Last UID", obj.lastUID);
      }
      console.log('-----------------------------------------------------------------------');
      // do something with mail object including attachments
      console.log("Email Recieved from \n", mail.from);
      // console.log("MAIL OBJECT \n", mail.html);

      var virtualEmailData = {};
      virtualEmailData.id = obj.id;
      virtualEmailData.alias = obj.virtualEmailAlias;
      virtualEmailData.address = obj.virtualEmailAddress;
      virtualEmailData.company_id = obj.virtualEmailCompanyId;

      mail.to = mail.to.map(function (obj) {
        return obj.address;
      }).join(";");
      if (mail.cc && mail.cc.length) {
        mail.cc = mail.cc.map(function (obj) {
          return obj.address;
        }).join(";");
      }

      var uploademail = {
        token: Token,
        creation_time: '',
        subject: mail.subject,
        body: mail.html,
        sender: mail.from,
        receiverId: obj.id,
        receiver: mail.to,
        sender_name: mail.from.name,
        sender_email_address: mail.from.address,
        attachments: mail.attachments,
        to: mail.to,
        cc: mail.cc,
        bcc: '',
        attachment_count: '',
        company_id: virtualEmailData.company_id,
        virtualEmailData: virtualEmailData,
        uid: attributes && attributes.uid ? attributes.uid : ''
      };


      UploadEmail(uploademail, function (response) {
        console.log('Server Response: ', response);
        console.log('-----------------------------------------------------------------------');
      });
      // var jsonmail;
      // for (var email of mail.from) {
      //   jsonmail = email;
      // }
      // for (var email of EmailList) {
      //   if (email == jsonmail.address) {
      //     console.log("Email address exist...");



      //   } //End if
      // }
      // mail processing code goes here
      console.log('-----------------------------------------------------------------------');
    });

    virtualMailListeners[obj.id].on("attachment", function (attachment) {
      console.log('-----------------------------------------------------------------------');
      console.log('Attachment is found');
      console.log(attachment.fileName);

      var file = fs.createWriteStream("./attachments/" + attachment.fileName);
      file.on('pipe', (file) => {
        console.log('Test download ')
      });
      attachment.stream.pipe(file);
      console.log('-----------------------------------------------------------------------');
    });

    virtualMailListeners[obj.id].start(); // start listening
  })
}





var GetUserToken = function (username, password, callback) {
  var uri = config.silverow_login_URL + '?user_name=' + config.silverow_username + '&password=' + config.silverow_password;
  request(uri, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var jsonbody = JSON.parse(body);
      Token = jsonbody.response.token;
      callback(jsonbody.response.token);
    }
    else if (error) {
      console.log(error);
    }
    else {
      console.log('Request URL:', uri);
      console.log('Response Status Code: ', response.statusCode);
    }

  });
}

var GetEmailList = function (token, callback) {
  var uri = config.silverow_getregisteredemails_URL + '?token=' + token;
  request(uri, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var jsonbody = JSON.parse(body);
      callback(jsonbody)
    }
  });
}

var restartMailListener = function (id) {
  mailListeners[id].stop();
  mailListeners[id].start();
}

var UploadEmail = function (email, callback) {
  var uri = config.silverow_uploademail_URL;
  request.post({
    url: config.silverow_uploademail_URL,
    body: JSON.stringify(email),
    headers: {
      "content-type": "application/json"
    }
  }, function (error, response, body) {
    try {
      body = JSON.parse(body);

    }
    catch (ex) {
      console.log(ex);
      return;
    }
    console.log("error", error);
    if (body.ack && body.fileNames && body.fileNames.length) {
      console.log(body.fileNames);
      body.fileNames.forEach(function (file) {

        var formData = {
          file: {
            value: fs.createReadStream("./attachments/" + file),
            options: {
              filename: file
            }
          },
          token: Token,
          emailAttachment: 1,
          moduleTypeForAttachments: 0,
          recordId: 0,
          emailId: body.id,
          attachmentFromNode: 1,
          dateNow: Date.now(),
          company_id: email.company_id
        };

        request.post({ url: config.silverow_uploadAttachment_URL, formData: formData }, function (err, resp, body) {
          // console.log("Status Code",resp.statusCode)
          if (err) {
            console.log('Error!', err);
          } else {
            console.log('Response: ' + body);
            // fs.unlinkSync("./attachments/" + file);
          }
        });



        // var postData = {
        //   token: Token
        // }

        // var req = request.post({
        //   url: config.silverow_uploadAttachment_URL,
        //   body: JSON.stringify(postData),
        //   headers: {
        //     "content-type": "application/json"
        //   }
        // }, function(error,response,body){

        //   console.log("Error:",error);
        //   // console.log("response:",response);
        //   console.log("body:",body);
        // });
        // var form = req.form(); 
        // var f = fs.createReadStream(path.join(__dirname,"./attachments/" + file));
        // console.log("File:",f);
        // form.append('file', f);


        // var req = request.post(config.silverow_uploadAttachment_URL, function (err, resp, body) {
        //   if (err) {
        //     console.log('Error!');
        //   } else {
        //     console.log('URL: ' + body);
        //   } 
        // }); 
        // var form = req.form(); 
        // var file = fs.createReadStream("./attachments/" + file);
        // console.log(file);
        // form.append('file', file);




        /* request.post({
          url: config.silverow_uploadAttachment_URL,
          body: JSON.stringify(email),
          headers: {
            "content-type": "application/json"
          }
        }, function (error, response, body2) {
          console.log("body from attachments posting", body2);
        }); */
      });
    }
    callback(body);
  });
}

// GetUserToken(config.silverow_username, config.silverow_password, function (usertoken) {
//   console.log("User Token: " + usertoken);
//   GetEmailList(usertoken, function (emaillist) {
//     //console.log("Email List: " + emaillist.emails);
//     emaillist.emails.forEach(function (value) {
//       EmailList.push(value.email);
//     });
//     console.log(EmailList);
//   });
// });

