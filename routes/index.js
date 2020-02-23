var express = require('express');
var router = express.Router();
const myJson = require("../product.json");
var mongoose = require('mongoose');
let bdd = require('../models/BDD');
const productModel = require('../models/product');
const userModel = require('../models/user');
var uid2 = require('uid2');
var SHA256 = require('crypto-js/sha256');
var encBase64 = require('crypto-js/enc-base64');

/* GET home page. */
router.get('/', async function (req, res, next) {
  console.log('hello', myJson.products);
  await productModel.deleteMany({ __v: 0 },
    function (error) {
      console.log('je remets a zero ma bdd')
    });
  for (var i = 0; i < myJson.products.length; i++) {
    let newproduct = new productModel({
      name: myJson.products[i].name,
      price: myJson.products[i].price,
      type: myJson.products[i].type,
      enabled: myJson.products[i].enabled
    });
    await newproduct.save(
      function (error, product) {
        console.log("j'ai un nouveau produit", product)
      });
  }

  res.render('index', { title: 'Express' });
});

//récuperer tous les produits
router.get('/product', function (req, res, next) {
  productModel.find({ __v: 0 },
    function (err, products) {
      console.log('listprod', products);
      res.json({ products });
    })
});

//supprimer un produit
router.post('/deleteproduct', async function (req, res, next) {
  console.log(req.body.id)
  await productModel.deleteOne({ _id: req.body.id });
  productModel.find({ __v: 0 },
    function (err, products) {
      console.log('listprod', products);
      res.json({ products });
    })
});

//ajouter un produit
router.post('/addproduct', async function (req, res, next) {
  console.log(req.body)
  let newproduct = new productModel({
    name: req.body.name,
    price: req.body.price,
    type: req.body.type,
    enabled: true
  });
  await newproduct.save(
    function (error, product) {
      console.log("j'ai un nouveau produit", product)
      res.json({ result: true });
    });
});

//récuperer un produit dans la bdd
router.get('/get-one-product', function (req, res, next) {
  productModel.findOne({ _id: req.query.id },
    function (err, products) {
      console.log('produit a modifier', products);
      res.json({ products });
    })
});

//modifier un produit
router.post('/changeproduct', async function (req, res, next) {
  console.log(req.body)
  productModel.updateOne(
    { _id: req.body.id },
    { name: req.body.name, price: req.body.price, type: req.body.type }, function (error, raw) {
    });
  res.json({ result: true });
});

//connexion d'un utilisateur
router.post('/login', async function (req, res, next) {
  //je check si l'user existe deja
  let user = await userModel.findOne({ email: req.body.email });
  //si aucun user trouvé, retour erreur
  if (user == undefined) {
    res.json({ status: false, error: 'wrong email or password' });
  } else {
    //je verifie le mdp
    if (user.password == SHA256(req.body.password + user.salt).toString(encBase64)) {
      res.json({ status: true, name: user.name });
    } else {
      res.json({ status: false, error: 'wrong email or password' });
    }
  }
});

// Créer un nouvel utilisateur
router.post('/newuser', async function (req, res, next) {
  //je check si l'user existe deja
  let user = await userModel.findOne({ email: req.body.email });
  //si aucun user trouvé, je cree le compte
  if (user == undefined) {
    let salt = uid2(32);
    let newUser = new userModel({
      name: req.body.name,
      email: req.body.email,
      password: SHA256(req.body.password + salt).toString(encBase64),
      token: uid2(32),
      salt: salt,
    });
    await newUser.save();
    console.log(newUser)
    res.json({ status: true, name: newUser.name });
  } else {
    res.json({ status: false });
  }
});


module.exports = router;
