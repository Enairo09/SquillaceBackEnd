import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
//import Change from './Change';
import { connect } from 'react-redux';

function mapStateToProps(state) {
  console.log('home page get user', state)
  return { userName: state.user }
}
const HomePage = (props) => {

  const [productList, setproductList] = useState([]);

  const [updateProduct, setupdateProduct] = useState(true);

  const [storeId, setstoreId] = useState('');

  //je recupere ma liste de produits
  useEffect(() => {
    const fetchData = async () => {
      await fetch('/product')
        .then(response => response.json())
        .then(response => setproductList(response.products))
        .catch(error => console.log("erreur fetch", error))
    }
    fetchData()
  }, []);

  //je supprime un produit
  var deleteProduct = (arg) => {
    console.log('click', arg)
    fetch(`/api/deleteproduct`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `id=${arg}`
    })
      .then(response => response.json())
      .then(response => { setproductList(response.products); console.log(response) })
      .catch(error => console.log("erreur fetch", error))
  };

  //je modifie un produit
  var changeProduct = (arg) => {
    setstoreId(arg);
    setupdateProduct(false);
  };

  var prodList = productList.map((product, i) => {

    return (
      <div className='products' key={i}>
        <img className="collecPic" src={`${i}.jpg`} />
        <h3>{product.name}</h3>
        <div>
          <h5>Prix : {product.price}€</h5>
          <h5>Type de produit : {product.type}</h5>
        </div>
        <div>
          <button className='change-btn' onClick={(e) => { console.log('je click', e.target); deleteProduct(e.target.value) }} value={product._id}>Supprimer</button>
          <button className='change-btn' onClick={(e) => { changeProduct(e.target.value) }} value={product._id}>Modifier</button>
        </div>
      </div>
    )
  });

  if (updateProduct) {
    return (
      <div id="blocHome content">
        <div>
          <h3 className="user">Bienvenue {props.userName}</h3>
        </div>
        {prodList}

      </div >
    );
  } else {
    return <Redirect to={{ pathname: '/change', idProduct: storeId }} />
  }
};

export default connect(mapStateToProps, null)(HomePage);

