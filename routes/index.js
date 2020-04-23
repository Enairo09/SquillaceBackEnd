var express = require('express');
var router = express.Router();
const myJson = require("../product.json");
var mongoose = require('mongoose');
let bdd = require('../models/bdd');
const productModel = require('../models/product');
const userModel = require('../models/user');
const orderModel = require('../models/order');
var uid2 = require('uid2');
var SHA256 = require('crypto-js/sha256');
var encBase64 = require('crypto-js/enc-base64');
var nodemailer = require('nodemailer');
const creds = require('../models/emailConfig');

function allOptions(name) {
  if (name === 'undefined' || name == 'undefined' || name === null || name === undefined || name === '' || name === [] || name === 'null' || name == 'null') {
    return false;
  } else {
    return true;
  }
};
function auMillieme(nombre) {
  return Math.round(1000 * nombre) / 1000;
};

function updatePrice(productList = []) {
  let finalPrice = 0
  for (var i = 0; i < productList.length; i++) {
    finalPrice = productList[i].price + finalPrice;
  }
  return finalPrice;
};

//config l'envoi d'email CONTACT PAGE ================================================
let transport = {
  host: 'smtp.gmail.com',
  auth: {
    user: creds.USER,
    pass: creds.PASS
  }
}

var transporter = nodemailer.createTransport(transport)

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Server is ready to take messages');
  }
});

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
      description: myJson.products[i].description,
      img: myJson.products[i].img,
      enabled: myJson.products[i].enabled
    });
    await newproduct.save(
      function (error, product) {
        console.log("j'ai un nouveau produit", product)
      });
  }

  res.json({ result: 'true' });
});

//récuperer tous les produits
router.get('/product', function (req, res, next) {
  productModel.find({ __v: 0 },
    function (err, products) {
      // console.log('listprod', products);
      res.json({ products });
    })
});


//J'initialise mon APP je recupere les infos du localstorage et je les renvoie a mon front USER ET ORDER: 
router.post('/get-order-and-user-from-storage', async function (req, res, next) {
  console.log('je recupere l id order du front APP', req.body)
  // CAS 1 : J'ai un user et un order : 
  if (allOptions(req.body.user) && allOptions(req.body.order)) {
    let order = await orderModel.findOne({ _id: req.body.order });
    let user = await userModel.findOne({ _id: req.body.user });
    //Je vérifie si mon order est déja associée a cet user : 
    const checkOrderList = (orderID, user) => {
      let orderExist = false;
      for (var i = 0; i < user.orders.length; i++) {
        if (user.orders[i].orderID == orderID) {
          orderExist = true;
        } else {
        }
      }
      return orderExist;
    }
    let needAddID = checkOrderList(req.body.order, user);
    console.log('Cas 1 j ai un order qui correspond a mon user : ', needAddID);
    if (!needAddID) {
      let userOrderCopy = user.orders;
      userOrderCopy.push({ orderID: req.body.order, status: false });
      await userModel.updateOne({ _id: req.body.user },
        { orders: userOrderCopy });
      //console.log('Cas 1 userordercopy', userOrderCopy);
      await orderModel.updateOne({ _id: req.body.order }, { userID: req.body.user })
    }
    console.log('Cas 1', order.productList);
    res.json({ status: true, basket: order.productList, orderID: req.body.order });
  }
  // CAS 2 : J'ai un user et pas d'order : 
  else if (allOptions(req.body.user) && !allOptions(req.body.order)) {
    let user = await userModel.findOne({ _id: req.body.user });
    let orderID = '';
    //je verifie si j'ai des orders en cours associés a cet user :
    for (var i = 0; i < user.orders.length; i++) {
      console.log('user order status', user.orders[i].status, user.orders[i].orderID)

      if (!user.orders[i].status) {
        let orderIDTemp = user.orders[i].orderID;
        //console.log(orderIDTemp)
        let orderTemp = await orderModel.findOne({ _id: orderIDTemp });
        console.log('ordertemp', orderTemp)
        if (allOptions(orderTemp.productList)) {
          orderID = user.orders[i].orderID
        }
      }
    }

    if (allOptions(orderID)) {
      let order = await orderModel.findOne({ _id: orderID });
      console.log('Cas 2 : je recupere mon dernier panier vide', order.productList)
      res.json({ status: true, basket: order.productList, orderID: order._id });

    } else {
      console.log('Cas 2 : je n ai aucun panier en cours ')
      res.json({ status: true, basket: [], orderID: '' });
    }
  }   // CAS 3: J'ai un order et pas d user :
  else if (!allOptions(req.body.user) && allOptions(req.body.order)) {
    let order = await orderModel.findOne({ _id: req.body.order });
    res.json({ status: true, basket: order.productList, orderID: order._id });
  }   // CAS 4 : Je n ai ni order ni user : 
  else {
    console.log('Cas 4', req.body)
    res.json({ status: true, basket: [], orderID: '' });
  }
});

// ===============================================
// DASHBOARD MARTINA
// ===============================================

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

//modifier un produit
router.post('/changeproduct', async function (req, res, next) {
  console.log(req.body)
  productModel.updateOne(
    { _id: req.body.id },
    { name: req.body.name, price: req.body.price, type: req.body.type }, function (error, raw) {
    });
  res.json({ result: true });
});



// ===============================================
// CONTACT PAGE
// ===============================================

//envoyer un message depuis la page contact
router.post('/contact', async (req, res, next) => {
  var name = req.body.name
  var email = req.body.email
  var message = req.body.message
  var content = `Bonjour Martina, \n\n Vous avez reçu un nouveau message de ${name} \n\n Email client : ${email} \n\n message: \n\n ${message} `
  console.log('hello', content)
  let mail = await transporter.sendMail({
    from: name,
    to: 'agnoste.loky@gmail.com',  //Change to email address that you want to receive messages on
    subject: 'New Message from Contact Form',
    text: content
  }, (err, data) => {
    if (err) {
      console.log("message fail");
      res.json({
        msg: 'fail'
      })
    } else {
      console.log("message sent");
      res.json({
        msg: 'success'
      })
    }
  })
  //console.log("Message sent: %s", mail.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
})


// ===============================================
// CONCERNING ORDERS
// ===============================================

//récuperer ma fiche produit dans PRODUCT et je renvoie mon ORDER EN COURS
router.post('/get-one-product', async function (req, res, next) {
  console.log('retour du front', req.body)
  if (allOptions(req.body.orderID)) {
    //si j'ai un ORDER je récupere mon PRODUIT ET MON PANIER
    let product = await productModel.findOne({ _id: req.body.id },
      function (err, products) {
        console.log('produit a afficher', products);
      });
    let order = await orderModel.findOne({ _id: req.body.orderID },
      function (err, products) {
        console.log('order a afficher', products);
      });
    res.json({ products: product, orderID: order._id, basket: order.productList });

  } else {
    //si je n'ai pas d'order je récupere mon PRODUIT
    productModel.findOne({ _id: req.body.id },
      function (err, products) {
        console.log('produit a afficher', products);
        res.json({ products: products, orderID: null, basket: null });
      });

  }
});

//Je récupère mon panier 
router.post('/cart', async function (req, res, next) {
  //CREER UNE OPTION ECHEC
  console.log('retour du front', req.body)
  if (allOptions(req.body.orderID)) {
    orderModel.findOne({ _id: req.body.orderID },
      function (err, data) {
        console.log('bdd me renvoie l ORDER', data);
        res.json({ status: true, orderID: data._id, basket: data.productList, totalCart: data.totalorder });

      });
  } else {
    res.json({ status: false });
  }
});


//Je crée un nouvel order : 
router.post('/createorder', async function (req, res, next) {
  console.log('user ID NULL = ', req.body.id)
  let newOrder;
  if (allOptions(req.body.id)) {
    newOrder = new orderModel({
      userID: req.body.id,
      createdate: Date.now(),
      productList: [{
        productID: req.body.productID,
        name: req.body.name,
        price: req.body.price,
        type: req.body.type,
        img: req.body.img,
        quantity: req.body.quantity,
        size: req.body.size
      }],
      paymentvalid: false,
      totalorder: req.body.price
    });
    let user = await userModel.findOne({ _id: req.body.id });
    let userOrderCopy = user.orders;
    userOrderCopy.push({ orderID: newOrder._id, status: false });
    await userModel.updateOne({ _id: user._id },
      { orders: userOrderCopy });
  } else {
    newOrder = new orderModel({
      createdate: Date.now(),
      productList: [{
        productID: req.body.productID,
        name: req.body.name,
        price: req.body.price,
        type: req.body.type,
        img: req.body.img,
        quantity: req.body.quantity,
        size: req.body.size
      }],
      paymentvalid: false,
      totalorder: req.body.price
    })
  }
  await newOrder.save();
  console.log(newOrder)
  res.json({ status: true, orderID: newOrder._id, basket: newOrder.productList });
});



//Je récupère un order existant : 
router.post('/getorder', async function (req, res, next) {
  //console.log('je recupere l id order du front', req.body)
  let order = await orderModel.findOne({ _id: req.body.orderID });
  res.json({ status: true, basket: order });
});

// router.post('/getorder', async function (req, res, next) {
//   console.log('lalalalala', req.body)
//   res.json({ status: true });
// });


//JE METS A JOUR MON ORDER mon order : 
router.post('/add-product-to-order', async function (req, res, next) {

  var json = req.body.tempStore;
  var data = JSON.parse(json);
  let totalCart = 0;
  console.log('j enregistre quoi ? ', data)
  let order = await orderModel.findOne({ _id: req.body.orderID });
  let tempStore = [...order.productList];

  let exist = false;
  let key;

  for (var i = 0; i < tempStore.length; i++) {
    console.log('je boucle sur, mon ID storée', tempStore[i].productID, 'mon id a ajouter', data.productID, 'ma size storée', tempStore[i].size, 'ma size a ajouter', data.size)
    if (tempStore[i].productID == data.productID && tempStore[i].size == data.size) {
      console.log('pourtant je passe dans ma condition ')
      exist = true;
      key = i;
    }
  }

  if (exist) {
    console.log('je passe dans le if donc jai deja ce produit')
    tempStore[key].quantity = tempStore[key].quantity + 1;
    tempStore[key].price = auMillieme(tempStore[key].quantity * tempStore[key].price);
  } else {

    console.log('je passe dans le else donc je nai pas deja ce produit')

    tempStore.push(data);
  }
  //maj du panier total
  //for (let i = 0; i < tempStore.length; i++) {
  totalCart = updatePrice(tempStore);
  //}

  console.log('jenregistre quoi en bdd', tempStore)
  //si j'ai un userID j'enregistre : 
  if (allOptions(req.body.id)) {
    await orderModel.updateOne(
      { _id: req.body.orderID },
      {
        userID: req.body.id, productList: tempStore, data, totalorder: totalCart
      });

    // je verifie que l'order soit déja associé a mon user sinon je l'ajoute
    let user = userModel.findOne({ _id: req.body.id });

    let userOrderCopy = user.orders;
    if (!allOptions(userOrderCopy)) {
      userOrderCopy = []
    }
    let existTwo = false;
    for (var i = 0; i < userOrderCopy.length; i++) {
      if (userOrderCopy[i].orderID == req.body.orderID) {
        console.log('je passe dans ma condition pour verif si l order est enregistrée dans luser')
        existTwo = true
      }
    }
    if (!existTwo) {
      userOrderCopy.push({ orderID: req.body.orderID, status: false });
      await userModel.updateOne({ _id: user._id },
        { orders: userOrderCopy });
    }

  } else {
    //sinon j'enregistre sans user
    await orderModel.updateOne(
      { _id: req.body.orderID },
      { productList: tempStore, totalorder: auMillieme(totalCart) });
  }
  res.json({ status: true, orderID: req.body.orderID, basket: tempStore, totalCart: auMillieme(totalCart) });
});

//Je supprime un produit dans mon order : 
router.post('/delete-product-from-order', async function (req, res, next) {
  //console.log('je recupere l id order du front', req.body)
  let order = await orderModel.findOne({ _id: req.body.orderID });
  let orderListTemp = [...order.productList]

  //console.log('je copie mon tableau de la bdd : ', orderListTemp)
  for (var i = 0; i < orderListTemp.length; i++) {
    if (req.body._id == orderListTemp[i]._id) {
      let index = orderListTemp.indexOf(orderListTemp[i]);
      orderListTemp.splice(index, 1);
      //console.log('je passe dans ma boucle et IF, j enleve mon produit de me tempList', orderListTemp);
    }
  }
  totalCart = updatePrice(orderListTemp);
  //supprimer si order vide  :
  // console.log('empty list', orderListTemp, orderListTemp.length)
  // if (orderListTemp.length <= 0) {
  //   await orderModel.deleteOne({ _id: req.body.orderID });
  //   res.json({ status: 'deleteorder', basket: [], totalCart: 0 });

  // } else {
  await orderModel.updateOne(
    { _id: req.body.orderID },
    { productList: orderListTemp, totalorder: totalCart });

  let neworder = await orderModel.findOne({ _id: req.body.orderID });
  res.json({ status: true, basket: neworder.productList, totalCart: neworder.totalorder });
  //}
});


//Je modifie la quantité d'un produit dans mon order : 
router.post('/update-qty-to-order', async function (req, res, next) {
  //console.log('je recupere l id order du front', req.body)
  let order = await orderModel.findOne({ _id: req.body.orderID });

  let prodListCopy = [...order.productList];
  if (req.body.qty == 'add') {

    for (var i = 0; i < prodListCopy.length; i++) {
      if (req.body._id == prodListCopy[i]._id && req.body.size == prodListCopy[i].size) {
        prodListCopy[i].price = auMillieme((prodListCopy[i].price / prodListCopy[i].quantity) * (prodListCopy[i].quantity + 1));
        prodListCopy[i].quantity = (prodListCopy[i].quantity + 1);
      }
    }
    //console.log('Je passe ici, jajoute un produit ', prodListCopy)
  } else if (req.body.qty == 'less') {
    for (var i = 0; i < prodListCopy.length; i++) {
      if (req.body._id == prodListCopy[i]._id && req.body.size == prodListCopy[i].size) {
        prodListCopy[i].price = auMillieme((prodListCopy[i].price / prodListCopy[i].quantity) * (prodListCopy[i].quantity - 1));
        prodListCopy[i].quantity = (prodListCopy[i].quantity - 1);
        //console.log('Je passe ici, jenleve un produit ', prodListCopy)
        if (prodListCopy[i].quantity === 0) {
          let index = prodListCopy.indexOf(prodListCopy[i]);
          prodListCopy.splice(index, 1);
          //console.log('Je passe ici, je supprime un produit ', prodListCopy)
          // console.log('new liste', prodListCopy);
        }
      }
    }
  } else {
    //console.log('Je passe ici, jai une erreur ')

    res.json({ status: false });
  }

  totalCart = updatePrice(prodListCopy);
  //console.log('Je passe ici, je recalcule mon panier ', totalCart)

  await orderModel.updateOne(
    { _id: req.body.orderID },
    { productList: prodListCopy, totalorder: totalCart });

  let neworder = await orderModel.findOne({ _id: req.body.orderID });
  //console.log('Je passe ici, jenvoie les infos au front : ', neworder.productList, neworder.totalorder)
  res.json({ status: true, basket: neworder.productList, totalCart: neworder.totalorder });

});

//Je récupère le mail associé a mon order : 
router.post('/get-user-from-order', async function (req, res, next) {
  console.log('retour front', req.body)
  let order = await orderModel.findOne({ _id: req.body.orderID })
  if (allOptions(order.userID)) {
    await orderModel.findOne({ _id: req.body.orderID }).populate('userID').exec(function (err, user) {
      console.log('verif populate', err, user)
      res.json({ status: true, userEmail: user.userID.email });
    })
  } else {
    //normalement impossible, mais si j'ai un userID je l'affiche : 
    if (allOptions(req.body.userID)) {
      let user = await userModel.findOne({ _id: req.body.userID });
      res.json({ status: true, userEmail: user.email });
    } else {
      console.log('pas d user associé')
      res.json({ status: true, userEmail: null });
    }
  }
});

// ===============================================
// CONCERNING USERS
// ===============================================

//connexion d'un utilisateur
router.post('/login', async function (req, res, next) {
  //je check si l'user existe deja
  let user = await userModel.findOne({ email: req.body.email, statut: 'user' });
  //si aucun user trouvé, retour erreur
  if (user == undefined) {
    res.json({ status: false, error: 'wrong email or password' });
  } else {
    //je verifie le mdp
    if (user.password == SHA256(req.body.password + user.salt).toString(encBase64)) {
      //je verifie si j'ai un ORDER en cours lors de la connection
      //si oui je lui attribut mon userID et inversement.
      if (allOptions(req.body.orderID)) {
        let order = await orderModel.findOne({ _id: req.body.orderID });
        let userOrderCopy = user.orders;
        let exist = false;
        for (var i = 0; i < userOrderCopy.length; i++) {
          if (userOrderCopy[i].orderID == req.body.orderID) {
            exist = true
          }
        }
        if (!exist) {
          userOrderCopy.push({ orderID: req.body.orderID, status: false });
          await userModel.updateOne({ _id: user._id },
            { orders: userOrderCopy });
          console.log('Cas 1 userordercopy', userOrderCopy);
          await orderModel.updateOne({ _id: req.body.orderID }, { userID: user._id })
        }
        console.log("ce que j'envoie au front", user._id, order._id)
        res.json({ status: true, id: user._id, order: order._id, basket: order.productList });
      } else {
        //si non je cherche si j'ai un panier en attente et je le renvoie au front.
        let orderID = '';
        for (var i = 0; i < user.orders.length; i++) {
          //console.log('jai quoi ', user.orders[i].status, user.orders[i].orderID)
          if (!user.orders[i].status) {
            let orderIDTemp = user.orders[i].orderID;
            //console.log(orderIDTemp)
            let orderTemp = await orderModel.findOne({ _id: orderIDTemp });
            console.log('ordertemp', orderTemp)
            if (allOptions(orderTemp.productList)) {
              orderID = user.orders[i].orderID
            }
          }
        }
        if (allOptions(orderID)) {
          let order = await orderModel.findOne({ _id: orderID });
          console.log('Cas 3 : je recupere mon dernier panier vide', order.productList)
          res.json({ status: true, id: user._id, order: order._id, basket: order.productList });

        } else {
          console.log('Cas 2 : je n ai aucun panier en cours ')
          res.json({ status: true, id: user._id, order: '', basket: [] });
        }
      }
    } else {
      res.json({ status: false, error: 'wrong email or password' });
    }
  }
});

// Créer un nouveau compte utilisateur
router.post('/newuser', async function (req, res, next) {
  console.log('lalalalalalallalaal', req.body)
  //je check si l'user existe deja
  let user = await userModel.findOne({ email: req.body.email, statut: 'user' });
  //si aucun user trouvé, je cree le compte
  if (user == undefined) {
    let salt = uid2(32);
    //if(allOptions(req.body.))
    if (allOptions(req.body.orderID)) {
      let newUser = new userModel({
        // firstname: req.body.firstname,
        // lastname: req.body.lastname,
        email: req.body.email,
        password: SHA256(req.body.password + salt).toString(encBase64),
        token: uid2(32),
        salt: salt,
        inscription: Date.now(),
        statut: req.body.statut,
        orders: [{ orderID: req.body.orderID, status: false }]
      });
      await newUser.save();
      console.log('j enregistre le nouvel user', newUser)
      //si j'ai un order en cours je l'associe a mon user et inversement
      //console.log('Cas 1 ', userOrderCopy);
      await orderModel.updateOne({ _id: req.body.orderID }, { userID: newUser._id })
      res.json({ status: true, id: newUser._id });
    } else {
      let newUser = new userModel({
        // firstname: req.body.firstname,
        // lastname: req.body.lastname,
        email: req.body.email,
        password: SHA256(req.body.password + salt).toString(encBase64),
        token: uid2(32),
        salt: salt,
        inscription: Date.now(),
        statut: req.body.statut,
      });
      await newUser.save();
      console.log('j enregistre le nouvel user cas 2 ', newUser)

      res.json({ status: true, id: newUser._id });
    }
    //console.log(newUser)

  } else {
    res.json({ status: false });
  }
});

// GET user - Je vais chercher les infos de mon USER connecté
router.post('/getuser', async function (req, res, next) {
  console.log('retour fu front ', req.body)
  console.log('alloptions id ', allOptions(req.body.id))
  if (allOptions(req.body.id)) {
    userModel.findOne({ _id: req.body.id }, function (err, result) {
      console.log('retour bdd', result, err)
      res.json({ status: true, user: result });
    });
  } else if (allOptions(req.body.guestID)) {
    userModel.findOne({ _id: req.body.guestID }, function (err, result) {
      console.log('retour bdd', result, err)
      res.json({ status: true, user: result });
    });
  } else {
    res.json({ status: false });
  }
});

// GET user - Je vais chercher les infos de mon USER avec les orders développées
router.post('/myaccount', async function (req, res, next) {
  let user = await userModel.findOne({ _id: req.body.id })
  let orderList = user.orders;
  let userToSend = {
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email
  }
  if (orderList.length <= 0) {
    res.json({ status: true, user: userToSend, order: null });

  } else {
    console.log('retour du front my account', req.body)
    await orderModel.find({ userID: req.body.id, paymentvalid: true }, function (err, raw) {
      console.log('result recherche', raw)
    }).sort({ validationdate: 'descending' }).populate('userID').exec(function (err, order) {
      let userToSend = {
        firstname: order[0].userID.firstname,
        lastname: order[0].userID.lastname,
        email: order[0].userID.email
      }
      console.log('verif populate', err, order, userToSend)
      res.json({ status: true, user: userToSend, orders: order });
    })
  }
});

// GET user AND CART - Je vais chercher les infos de mon USER et mon order
router.post('/getuserandcart', async function (req, res, next) {
  //CREER UNE OPTION ECHEC ?
  console.log('retour du front', req.body)
  //console.log('retour fu front ', req.body)
  //console.log('alloptions id ', allOptions(req.body.id))

  let order = await orderModel.findOne({ _id: req.body.orderID });
  let user = await userModel.findOne({ _id: req.body.userID }, function (err, raw) {
    console.log('retour bdd getuserandcart', raw, err)
  });
  let userToSend = {
    firstname: user.firstname,
    lastname: user.lastname,
    address: user.address,
    optional: user.optional,
    zipcode: user.zipcode,
    city: user.city,
    state: user.state,
    phone: user.phone,
    compagnyname: user.compagnyname,
    billingaddress: user.billingaddress,
    billingoptional: user.billingoptional,
    billingzipcode: user.billingzipcode,
    billingcity: user.billingcity,
    billingstate: user.billingstate,
    billingfirstname: user.billingfirstname,
    billinglastname: user.billinglastname,
  }
  console.log('j envoie au front l order suivant ', userToSend, order._id, order.productList, order.totalorder)
  res.json({ status: true, user: userToSend, orderID: order._id, basket: order.productList, totalCart: order.totalorder });
});

// j'update les Details infos de mon user
router.post('/updateuserdetails', async function (req, res, next) {
  console.log('je recois du front =====', req.body)
  // let copyOrder = [];
  // if (req.body.orders === '') {
  // } else {
  //   let neworders = await userModel.findOne({ _id: req.body.id });
  //   copyOrder = [...neworders.orders];
  //   copyOrder.push({ orderID: req.body.orderID })
  // }
  // if (req.body.gender === 'undefined' && req.body.phone === '') {
  //   console.log('je passe ici 111111')
  //   neworders = await userModel.updateOne(
  //     { _id: req.body.id },
  //     {
  //       firstname: req.body.firstname,
  //       lastname: req.body.lastname,
  //       email: req.body.email,
  //       birthday: req.body.birthday,
  //     });
  //   res.json({ status: true, id: neworders._id });
  // } else if (req.body.gender === 'undefined') {
  //   console.log('je passe ici 2222222')
  //   neworders = await userModel.updateOne(
  //     { _id: req.body.id },
  //     {
  //       firstname: req.body.firstname,
  //       lastname: req.body.lastname,
  //       email: req.body.email,
  //       birthday: req.body.birthday,
  //       phone: req.body.phone,
  //     });
  //   res.json({ status: true, id: neworders._id });
  // } else if (req.body.phone === '') {
  //   console.log('je passe ici 333333')
  //   neworders = await userModel.updateOne(
  //     { _id: req.body.id },
  //     {
  //       firstname: req.body.firstname,
  //       lastname: req.body.lastname,
  //       email: req.body.email,
  //       phone: req.body.phone,
  //       birthday: req.body.birthday,
  //     });
  //   res.json({ status: true, id: neworders._id });
  // } else {
  let neworders = await userModel.updateOne(
    { _id: req.body.id },
    {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      gender: req.body.gender,
      phone: req.body.phone,
      birthday: req.body.birthday,
    });

  res.json({ status: true, id: neworders._id });
  //}
});

// j'update les addresses de mon USER Shipping + Billing
router.post('/updateuseraddress', async function (req, res, next) {
  console.log('je recois du front =====', req.body)
  // let copyOrder = [];
  // if (req.body.orders === '') {
  // } else {
  //   let neworders = await userModel.findOne({ _id: req.body.id });
  //   copyOrder = [...neworders.orders];
  //   copyOrder.push({ orderID: req.body.orderID })
  // }
  let neworders = await userModel.updateOne(
    { _id: req.body.id },
    {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      address: req.body.address,
      optional: req.body.optional,
      zipcode: req.body.zipcode,
      city: req.body.city,
      state: req.body.state,
      compagnyname: req.body.compagnyname,
      billingname: req.body.billingname,
      billingaddress: req.body.billingaddress,
      billingoptional: req.body.billingoptional,
      billingzipcode: req.body.billingzipcode,
      billingcity: req.body.billingcity,
      billingstate: req.body.billingstate
    });

  res.json({ status: true, id: neworders._id });

});

// j'update l'addresse de Shipping de mon USER
router.post('/addshippingaddress', async function (req, res, next) {
  console.log('je recois du front =====', req.body)
  let neworders = await userModel.updateOne(
    { _id: req.body.id },
    {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      address: req.body.address,
      optional: req.body.optional,
      zipcode: req.body.zipcode,
      city: req.body.city,
      state: req.body.state
    }, function (err, results) {
      //MODIF NON VERIFIEE : 
      res.json({ status: true, id: results._id });
    });


});

// j'update la reception des newsletters de mon user
router.post('/usersubcription', async function (req, res, next) {
  let neworders = await userModel.updateOne(
    { _id: req.body.id },
    { newsletter: req.body.newsletter });
  res.json({ status: true, id: neworders._id });
});

// je change le mdp de mon user
router.post('/changepassword', async function (req, res, next) {
  //je recupere l'user
  let user = await userModel.findOne({ _id: req.body.id });
  //je verifie le mdp
  if (user.password == SHA256(req.body.current + user.salt).toString(encBase64)) {
    //le mdp est correct, je modifie le mdp 
    let salt = uid2(32);
    let newpass = await userModel.updateOne(
      { _id: req.body.id },
      {
        password: SHA256(req.body.new + salt).toString(encBase64),
        token: uid2(32),
        salt: salt,
      });
    res.json({ status: true, id: user._id });
  } else {
    res.json({ status: false, error: 'wrong email or password' });
  }
});


// ===============================================
// CONCERNING PAYMENT
// ===============================================


//PAYMENT FORM PROCESS
router.post('/charge', async function (req, res, next) {
  console.log('req.body  ====== ', req.body)
  // Set your secret key. Remember to switch to your live secret key in production!
  // See your keys here: https://dashboard.stripe.com/account/apikeys
  const stripe = require('stripe')('sk_test_dEQBsW6KEYieqd07SFsSISBi00C2LchTBF');
  let total = auMillieme(req.body.totalCart * 100);
  // Token is created using Stripe Checkout or Elements!
  // Get the payment token ID submitted by the form:
  const token = req.body.token;
  //; // Using Express
  //j'effectue le paiement
  console.log('total  ====== ', total)

  let charge = await stripe.charges.create({
    amount: total,
    currency: 'eur',
    description: 'Example charge',
    source: token,
  }
    // , function (err, raw) {
    //   //console.log('ai je des info derreur ??????', err, raw)
    //   //console.log('retour raw', raw.status)
    //   if (err) {
    //     res.json({ status: false });
    //   } else {
    //     res.json({ status: true });
    //   }
    // }
  );
  console.log('charge status  ====== ', total)

  if (charge.status == 'succeeded') {
    //si le paiement est reussi, je valide ma commande en BDD

    let user = await userModel.findOne({ _id: req.body.userID });
    let userOrderCopy = user.orders;
    console.log('old order copy = ', userOrderCopy);
    for (var i = 0; i < userOrderCopy.length; i++) {
      if (userOrderCopy[i].orderID == req.body.orderID) {
        userOrderCopy[i].status = true
      }
    }
    console.log('new order copy = ', userOrderCopy);

    await userModel.updateOne({ _id: user._id },
      {
        billingfirstname: req.body.firstname,
        billinglastname: req.body.lastname,
        orders: userOrderCopy
      });

    await orderModel.updateOne({ _id: req.body.orderID }, {
      userID: req.body.userID,
      validationdate: Date.now(),
      productList: req.body.basket,
      firstname: req.body.user.firstname,
      lastname: req.body.user.lastname,
      address: req.body.user.address,
      optional: req.body.user.optional,
      zipcode: req.body.user.zipcode,
      city: req.body.user.city,
      state: req.body.user.state,
      contactphone: req.body.user.phone,
      compagnyname: req.body.user.compagnyname,
      billingaddress: req.body.user.billingaddress,
      billingoptional: req.body.user.billingoptional,
      billingzipcode: req.body.user.billingzipcode,
      billingcity: req.body.user.billingcity,
      billingstate: req.body.user.billingstate,
      billingfirstname: req.body.firstname,
      billinglastname: req.body.lastname,
      paymentvalid: true,
      totalorder: req.body.totalCart
    })

    res.json({ status: true });
  } else {
    res.json({ status: false });
  }
  //console.log('retour de charge', charge)
});


// =============================================================================================
// CORRIGER CETTE ROUTE  
// Elle doit etre supprimée et passer par la route newuser. Il faut également corriger le component SHIPPING INFO 
// =============================================================================================
//je recupere les infos d'un user
router.post('/addguest', async function (req, res, next) {
  // je verifie si user ou guest
  let newGuest = new userModel({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    address: req.body.address,
    optional: req.body.optional,
    zipcode: req.body.zipcode,
    inscription: Date.now(),
    city: req.body.city,
    state: req.body.state,
    phone: req.body.phone,
    newsletter: req.body.newsletter,
    email: req.body.email,
    statut: 'guest',
    orders: [{
      orderID: req.body.orderID,
      status: false
    }]
  });
  await newGuest.save();
  let order = await orderModel.updateOne({ _id: req.body.orderID }, {
    userID: newGuest._id
  }, function (err, raw) {
    console.log('controle update', err, raw)
  })
  //let guest = guestModel.findOne({ email: req.body.email })
  console.log('j enregistre le nouvel user en guest', newGuest)
  res.json({ status: true, guestID: newGuest._id });
});
// =============================================================================================
// FIN DE ROUTE A CORRIGER 
// =============================================================================================
module.exports = router;

