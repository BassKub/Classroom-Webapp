const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dbConfig = require('./Config/mongodb.config.js');
const Customer = require('./models/customer.js');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: false }));

app.listen(PORT, () => console.log(`Server listening on ${PORT}`));

mongoose.set('strictQuery', false);
mongoose.connect(dbConfig.url)
    .then(()=>{
        console.log('Connect to Database')
        
    }).catch(err=>{
        console.log('Cannot Connect to MongoDB.')
        process.exit();
    })

    app.use(cors())
    require('./customer.route.js')(app);

    