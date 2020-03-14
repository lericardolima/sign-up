require('dotenv').config();
require('./src/config/db.config');

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const app = require('express')();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());

require('./src/routes/app.route')(app);

app.listen(PORT, () => {
  console.debug(`Server running on port ${PORT}`);
});

module.exports = app;
