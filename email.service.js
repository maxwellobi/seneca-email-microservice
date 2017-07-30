let config = require('./config');

require('seneca')()
  .use(require('./email'))
  .listen({ 
      port: config.services.email, 
      host: 'localhost', 
      type: 'tcp',
      pin: 'role:email_service'
    });