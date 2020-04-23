import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
// import Change from '../Change';
import { connect } from 'react-redux';

// function mapStateToProps(state) {
//   console.log('home page get user', state)
//   return { userName: state.user }
// }
const Product = (props) => {

  const [productList, setproductList] = useState([]);

  // const [basketList, setbasketList] = useState([]);

  const [storeId, setstoreId] = useState('');

  //je recupere ma liste de produits
  useEffect(() => {
    const fetchData = async () => {
      await fetch('/api/product')
        .then(response => response.json())
        .then(response => setproductList(response.products))
        .catch(error => console.log("erreur fetch", error))
    }
    fetchData()
  }, []);

  //j'ajoute un produit dans mon panier
  // var addProduct = async (arg) => {
  //   let basket = [...basketList];
  //   basket.push(arg);
  //   setbasketList(basket);
  //   console.log(basketList);
  //   await props.newProduct(basketList);
  // };
  let goToProdCard = async (arg) => {
    setstoreId(arg);
  };


  var prodList = productList.map((product, i) => {

    return (
      <span style={{ float: "left" }} className='products' key={i}  >
        <img onClick={(e) => { console.log(e.target.id); goToProdCard((e.target.id)) }} id={product._id} className="productPic" src={product.img} />
        <h4>{product.name}</h4>
        <span>
          <h5>{product.price}€</h5>
          {/* <h5>Type de produit : {product.type}</h5> */}
        </span>
        {/* <div>
          <button className='change-btn' onClick={(e) => { addProduct(e.target.value) }} value={product._id}>Ajouter au panier</button>
        </div> */}
      </span >
    )
  });

  if (storeId === '') {
    return (
      <div className="blocProduct content">
        {/* <div>
          <h3 className="user">Bienvenue {props.userName}</h3>
        </div> */}
        {prodList}
      </div >
    );
  } else {
    return (
      <Redirect to={`/prodcard/${storeId}`} />
    )
  }

};


// function mapDispatchToProps(dispatch) {
//   return {
//     newProduct: function (productsToSend) {
//       console.log('jes suis dans le mapdispatch', productsToSend)
//       dispatch({ type: 'setBasket', product: productsToSend })
//     }
//   }
// }

//export default connect(mapStateToProps, mapDispatchToProps)(Product);
export default Product;

