## Seneca Email Microservice

This microservice is part of my personal blog project [https://github.com/maxwellobi/nodejs-personal-blog-website](https://github.com/maxwellobi/nodejs-personal-blog-website). This service sends email using [SenecaJs](http://senecajs.org/) and [SendGrid](https://sendgrid.com/) 

This service uses tcp as the seneca transport merchanism to listen for incoming connections and transmit messages.

[Redis](https://redis.io/) is used to manage sessions across all the services.
All messages to this service includes a session id. The seneca middleware checks if the session id exists in redis before fufilling the request.

The message for this service is defined as 

```json
    {
        sessionid: 'current_session_id',
        receiver_email: 'receiver@email.com',
        receiver_name: 'Email Receiver',
        subject: 'Testing Email Microservice',
        body: 'This is a body <br/>'
    }
```

