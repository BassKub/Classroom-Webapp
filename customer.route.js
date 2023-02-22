module.exports = (app) => {
    const customer = require("./Controllers/customer.controller.js");
    const sessions = require('express-session');
    const express = require('express');
    const cookieParser = require('cookie-parser');
    const collection = require('./models/customer.js')
    const classes = require('./models/classroom.js');

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

    function isValidEmail(email) {
        const pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return pattern.test(email);
    }

    function generateClassCode() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let code = '';
      
        for (let i = 0; i < 6; i++) {
          code += characters.charAt(Math.floor(Math.random() * characters.length));
        }
      
        return code;
      }
      
      const classCode = generateClassCode();
      

    var session;

    app.get('/', (req, res) =>{
        session = req.session;
        if(session.Useremail){
            res.sendFile(__dirname + '/view/Home/Home.html')
        }else
            res.sendFile(__dirname + '/view/Login/Login.html')
    });

    app.post('/login',async (req, res) => {
        try{
            const check=await collection.findOne({Useremail:req.body.username})

            if(check.Password===req.body.password){
                session = req.session;
                session.Useremail = req.body.username;
                console.log(req.session)
                res.sendFile(__dirname + '/view/Home/Home.html');
            }
            else {
            res.send('<script>alert("Invalid password!!!"); window.location.href="/";</script>');
            }
        }
        catch{
            res.send('Error')
        }
        
    })

    app.post('/signup', async (req, res) => {
    const email = req.body.username;
    const check = await collection.findOne({ Useremail: email });
    // check email that user will use is already registered
    if (check) {
        console.log("Email already exists");
        res.send('<script>alert("Email already exists!!!"); window.location.href="/view/Sign up/Signup.html";</script>');
        return;
    }

    if (isValidEmail(email) && req.body.password != "" && req.body.fullname != "") {
        const data = {
            Useremail: email,
            FullName: req.body.fullname,
            Password: req.body.password
        };

        await collection.insertMany([data]);
        res.sendFile(__dirname + '/view/Login/Login.html');
    } else {
        console.log("Error");
    }
    });

    app.post('/classroom', async (req, res) => {
        const name = req.body.className;
        const check = await classes.findOne({ ClassName: name });
        // check classroom name that user will use is already registered
        if (check) {
            console.log("classroom already exists!!!"); 
            res.send('<script>alert("classroom already exists!!!"); window.location.href="/view/Create Classroom/Cc.html";</script>');
            return;
        }
        //check that input no empty
        if ( req.body.classname != "" && req.body.classDescription != "" ) {
            const data = {
                classId: classCode,
                ClassName: name,
                Description: req.body.classDescription
            };

            await classes.insertMany([data]);
            res.sendFile(__dirname + '/view/Home/Home.html');
        } else {
            console.log("Error");
        }
    });

    app.post('/joinclassroom', async (req, res) => {
        const classID = req.body.classId;
        const user = req.body.username;
      
        try {
          // Find the classroom with the given ID
          const classroom = await classes.findOne({ classId: req.body.classId });
      
          if (classroom) {
            // Update the classroom's member list with the user's email
            await classes.updateOne({ classId: classID }, { $addToSet: { student: user} });
            res.send('<script>alert("Join Complete!!!"); window.location.href="/view/Home/Home.html";</script>');
          } else {
            res.status(404).send('Classroom not found');
          }
        } catch (error) {
          console.error(error);
          res.status(500).send('Server error');
        }
      });

    // app.post('/edit', async(req,res) => {
    //     const userId = req.session.userId; 
    //     const name = req.body.name;
    //     const email = req.body.email;
    //     const password = req.body.password;

    
    //     db.collection('users').updateOne(
    //         { _id: ObjectID(userId) },
    //         { $set: { name: name, email: email, password: password } },
    //         (err, result) => {
    //             if (err) throw err;
    //             res.redirect('/profile');
    //         }
    //     );
    // })

    app.get('/api/customer/:customerId', customer.findById)
    
    app.delete('/api/customer/:customerId', customer.delete)

    app.get('/logout', (req,res) =>{
        req.session.destroy();
        res.redirect('/');
    });

}