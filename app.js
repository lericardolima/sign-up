require('dotenv').config();

const app = require('express')();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Hello world!!').status(200);
});

app.listen(PORT, () => {
    console.debug(`Server running on port ${PORT}`);
});