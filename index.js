const path = require('path');
const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();

//paramètre de connexion
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'node_db'
});

//connexion à la db
conn.connect((err) => {
    if(err) throw err;
    console.log('Mysql s\'est connecté'); 
});

//mise en place des fichiers des vues
app.set('views',path.join(__dirname,'views'));
app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/assets', express.static(__dirname + '/public'));

//Route de la page d'accueil
app.get('/', (req, res) => {
    let sql = "SELECT * FROM item";
    let query = conn.query(sql, (err, results) => {
        if(err) throw err;
        res.render('item_view' ,{
            results: results
        });
    });
});

//"create" route
app.post('/save',(req, res) => {
    let data = {name: req.body.name, price: req.body.price};
    let sql = "INSERT INTO item SET ?";
    let query = conn.query(sql, data,(err, results) => {
      if(err) throw err;
      res.redirect('/');
    });
  });

//"update" route
app.post('/update',(req, res) => {
    let sql = "UPDATE item SET name='"+req.body.name+"', price='"+req.body.price+"' WHERE id="+req.body.id;
    let query = conn.query(sql, (err, results) => {
      if(err) throw err;
      res.redirect('/');
    });
  });
   
  //"delete" route
  app.post('/delete',(req, res) => {
    let sql = "DELETE FROM item WHERE id="+req.body.id;
    let query = conn.query(sql, (err, results) => {
      if(err) throw err;
        res.redirect('/');
    });
  });
   
  //server listening
  app.listen(8000, () => {
    console.log('Server en marche sur le port 8000');
  });