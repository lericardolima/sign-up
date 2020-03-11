require('dotenv').config();

require('./src/config/mongodb.config');

const app = require('express')();
const PORT = process.env.PORT || 3000;

require('./src/routes/app.route')(app);

app.listen(PORT, () => {
  console.debug(`Server running on port ${PORT}`);
});

module.exports = app;
