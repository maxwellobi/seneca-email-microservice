let debug = require('debug')('admin:email_service');
let stringify = require('json-stringify-safe');
let config = require('./config');

module.exports = function email(options){
    let seneca = this;

    seneca.add('role:email_service, cmd: send_email', send_email); 
    seneca.add('role:email_service, cmd: save_email', save_email);
    seneca.add('role:email_service, cmd: get_emails', get_emails);

    seneca.wrap('role:email_service', (args, reply) => {

        debug(`Email service initiated: ${stringify(args)}`);

        //if sessionid was not sent - wrong payload
        if(!args.sessionid) {

            debug('Invalid session param in payload');
            return reply({ msg: 'Session parameter is invalid'}, null);
        }else{

            //check inside redis if the session exist
            let redis = require('redis').createClient(config.redis.port, config.redis.host);
            let key = `sess:${args.sessionid}`;

            redis.on("error", function (err) {
                debug(`Redis refused connection: ${err}`);
                reply({ msg: 'Redis refused connection. ' + err }, null);
            });

            debug(`Session key is ${key} =>  Checking redis now`);
            redis.get(key, function(err, user) {
                
                if(user){

                    //proceed to do the action cos session is found
                    debug(`Session data retrieved from redis: ${user}`);

                    //seneca.prior(args, reply) //is not working
                    eval(eval(args.cmd)(args, reply)); 

                }else reply({ msg: 'Session not found ' + err }, null);

            });
        }

    });
}

function send_email(args, reply){
    
    debug('SendEmail action started:');

    //args definitions
    //{ receiver_email, receiver_name, subject, body, sessionid}
    try {
            
        let sendgrid = require('sendgrid').mail;

        let fromEmail = new sendgrid.Email(config.email.send_from_email, config.email.send_from_name);
        let toEmail = new sendgrid.Email(args.receiver_email, args.receiver_name);
        let subject = args.subject;
        let content = new sendgrid.Content('text/html', args.body);
        let mail = new sendgrid.Mail(fromEmail, subject, toEmail, content);

        sendgrid = require('sendgrid')(config.email.sendgrid_api_key);
        let request = sendgrid.emptyRequest({
            method: 'POST',
            path: '/v3/mail/send',
            body: mail.toJSON()
        });

        //send the mail
        sendgrid.API(request, function (error, response) {
            if (error) {
                debug('Email was not sent: => Error: ' + error);
                return reply(error, null);
            }
            
            //email was sent
            debug('Email Sent => Response: ' + response.statusCode);
            return reply(null, response);
        });

    }
    catch (error) {
        return reply(error, null);
    }

}

function save_email(args, reply){

    debug('SaveEmail action started:');
    try {
        
        //save email to the email-service database for broadcasts
    } 
    catch (error) {
        
    }
}

function get_emails(args, reply){

    debug('GetEmail action started:');
    try {
        
        //retrieve all email in db for broadcasts
    } 
    catch (error) {
        
    }
}