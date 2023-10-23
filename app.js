const express = require('express')
const path = require('path');
const notifyRouter = require('./routes/notify')

const app = express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/notify', notifyRouter)

app.listen(3000, () => {
    console.log('server is running')
})
