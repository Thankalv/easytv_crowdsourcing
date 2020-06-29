var nodemailer = require('nodemailer');


if(sails.config.custom.isDocker=='NO')
  var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
      user: 'thanassiskalv@gmail.com',
      pass: 'czihbhsihtousfdz'
    },
    testMode: false,
    ssl: true
  });
else
  var transporter = nodemailer.createTransport({
    host: "193.178.235.20",
    port: 25,
    secure: false,
    tls: { rejectUnauthorized: false}
  });



module.exports = {

  friendlyName: 'Send template email',


  description: 'Send an email using a template.',


  extendedDescription: 'To ease testing and development, if the provided "to" email address ends in "@example.com", '+
    'then the email message will be written to the terminal instead of actually being sent.'+
    '(Thanks [@simonratner](https://github.com/simonratner)!)',


  inputs: {

    template: {
      description: 'The relative path to an EJS template within our `views/emails/` folder -- WITHOUT the file extension.',
      extendedDescription: 'Use strings like "foo" or "foo/bar", but NEVER "foo/bar.ejs".  For example, '+
        '"marketing/welcome" would send an email using the "views/emails/marketing/welcome.ejs" template.',
      example: 'email-reset-password',
      type: 'string',
      required: true
    },

    templateData: {
      description: 'A dictionary of data which will be accessible in the EJS template.',
      extendedDescription: 'Each key will be a local variable accessible in the template.  For instance, if you supply '+
        'a dictionary with a \`friends\` key, and \`friends\` is an array like \`[{name:"Chandra"}, {name:"Mary"}]\`),'+
        'then you will be able to access \`friends\` from the template:\n'+
        '\`\`\`\n'+
        '<ul>\n'+
         '<% for (friend of friends){ %><li><%= friend.name %></li><% }); %>\n'+
        '</ul>\n'+
        '\`\`\`'+
        '\n'+
        'This is EJS, so use \`<%= %>\` to inject the HTML-escaped content of a variable, \`<%= %>\` to skip HTML-escaping '+
        'and inject the data as-is, or \`<% %>\` to execute some JavaScript code such as an \`if\` statement or \`for\` loop.',
      type: {},
      defaultsTo: {}
    },

    to: {
      description: 'The email address of the primary recipient.',
      extendedDescription: 'If this is any address ending in "@example.com", then don\'t actually deliver the message. '+
        'Instead, just log it to the console.',
      example: 'foo@bar.com',
      required: true
    },

    cc: {
      description: 'The email address of the cc recipient.',
      extendedDescription: 'If this is any address ending in "@example.com", then don\'t actually deliver the message. '+
        'Instead, just log it to the console.',
      example: 'foo2@bar.com',
      required: false
    },

    subject: {
      description: 'The subject of the email.',
      example: 'Hello there.',
      defaultsTo: ''
    },

    layout: {
      description: 'Set to `false` to disable layouts altogether, or provide the path (relative '+
        'from `views/layouts/`) to an override email layout.',
      defaultsTo: 'layout-email',
      custom: (layout)=>layout===false || _.isString(layout)
    },

  },


  exits: {

    success: {
      outputFriendlyName: 'Email delivery report',
      outputDescription: 'A dictionary of information about what went down.',
      outputType: {
        loggedInsteadOfSending: 'boolean'
      }
    }

  },


  fn: async function(inputs) {

    var path = require('path');
    var url = require('url');
    var util = require('util');


    if (!_.startsWith(path.basename(inputs.template), 'email-')) {
      sails.log.warn(
        'The "template" that was passed in to `sendTemplateEmail()` does not begin with '+
        '"email-" -- but by convention, all email template files in `views/emails/` should '+
        'be namespaced in this way.  (This makes it easier to look up email templates by '+
        'filename; e.g. when using CMD/CTRL+P in Sublime Text.)\n'+
        'Continuing regardless...'
      );
    }

    // Determine appropriate email layout and template to use.
    var emailTemplatePath = path.join('emails/', inputs.template);
    var layout;
    if (inputs.layout) {
      layout = path.relative(path.dirname(emailTemplatePath), path.resolve('layouts/', inputs.layout));
    } else {
      layout = false;
    }

    // Compile HTML template.
    // > Note that we set the layout, provide access to core `url` package (for
    // > building links and image srcs, etc.), and also provide access to core
    // > `util` package (for dumping debug data in internal emails).
    var htmlEmailContents = await sails.renderView(
      emailTemplatePath,
      _.extend({layout, url, util }, inputs.templateData)
    )
    .intercept((err)=>{
      err.message =
      'Could not compile view template.\n'+
      '(Usually, this means the provided data is invalid, or missing a piece.)\n'+
      'Details:\n'+
      err.message;
      return err;
    });

    // If that's the case, or if we're in the "test" environment, then log
    // the email instead of sending it:
    var dontActuallySend = (
      sails.config.environment === 'test'
    );

    // Otherwise, we'll check that all required Mailgun credentials are set up
    // and, if so, continue to actually send the email.
    var mailOptions = {
        from: 'EasyTV@platform.com',
        to: inputs.to,
        cc: inputs.cc,
        subject: inputs.subject,
        html: htmlEmailContents
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          sails.log.error(error);
        } 
        else {
          sails.log('An email sent to: '+ inputs.to +' with response: ' + info.response);
        }
    });

    // All done!
    return {
      loggedInsteadOfSending: dontActuallySend
    };

  }

};
