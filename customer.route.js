module.exports = (app) => {
    const customer = require("./Controllers/customer.controller.js");
    const sessions = require('express-session');
    const express = require('express');
    const cookieParser = require('cookie-parser');
    const collection = require('./models/customer.js')

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
            console.log("Error")
            }
        }
        catch{
            res.send('Error')
        }
        
    })

    app.post('/signup',async (req, res) => {
        const email = req.body.username
        if(isValidEmail(email) && req.body.password != "" && req.body.fullname != "") {
            let data = 
                {
                Useremail: req.body.username,
                FullName:  req.body.fullname,
                Password:  req.body.password
                }
            
            await collection.insertMany([data])
            res.sendFile(__dirname + '/view/Login/Login.html');    
        
        }
        else {
            console.log("Error")
        }
    })

    app.get('/api/customer/:customerId', customer.findById)
    app.put('/api/customer/:customerId', customer.update)
    app.delete('/api/customer/:customerId', customer.delete)

    app.get('/logout', (req,res) =>{
        req.session.destroy();
        res.redirect('/');
    });

}