const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const sessions = require('express-session')
const dbConfig = require('./Config/mongodb.config.js')
const Customer = require('./models/customer.js')

const cors = require('cors')
const app = express();
const PORT = 3000;
const oneday = 1000 * 60 * 60 * 24;
app.use(sessions({
    secret: 'keyboard cat',
    cookie: { maxAge: oneday },
    saveUninitialized: true,
    resave: false
}));

app.use(express.json());
app.use(express.urlencoded({
        extended: true
}));

app.use(express.static(__dirname));

app.use(cookieParser());

const username = "6410301044@cdti.ac.th"
const password = "16559"
function isValidEmail(email) {
    const pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return pattern.test(email);
  }

var session;


app.get('/', (req, res) =>{
    session = req.session;
    if(session.userid){
        res.sendFile(__dirname + '/view/Home/Home.html')
    }else
    res.sendFile(__dirname + '/view/Login/Login.html')
});

app.post('/user', (req, res) => {
    if(req.body.username == username && req.body.password == password) {
        session=req.session;
        session.userid = req.body.Username;
        console.log(req.session)
        res.sendFile(__dirname + '/view/Home/Home.html');
    }
    else {

    }
})
app.post('/signupuser', (req, res) => {
    const email = req.body.username
    if(isValidEmail(email) && req.body.password != "" && req.body.fullname != "") {
        session=req.session;
        session.userid = req.body.Username;
        console.log(req.session)
        let data = [
            {
            Useremail: req.body.username,
            FullName:  req.body.fullname,
            Password:  req.body.password
            }
        ]
        for(let i=0; i<data.length;i++){
            const c = new Customer(data[i]);
            c.save()
        res.sendFile(__dirname + '/view/Login/Login.html');    
        }
    }
    else {
        
    }
})
app.listen(process.env.PORT, () => console.log(`Server listening on ${PORT}`));

mongoose.set('strictQuery', false);
mongoose.connect(dbConfig.url)
    .then(()=>{
        console.log('Connect to Database')
        
    }).catch(err=>{
        console.log('Cannot Connect to MongoDB.')
        process.exit();
    })

    app.use(cors())
    require('./routes/customer.route.js')(app);

    const server = app.listen(process.env.PORT || 3000, () => {
        console.log('Run')
    })