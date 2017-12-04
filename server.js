let express = require('express');
let app = express();
let config = require('./config/config');
let port = config.dev.port;

require('./config/express.config')(app);

app.listen(process.env.PORT || 3000, () => {
	console.log('review list RESTful API server started on: ' + port);
});

module.exports = app;