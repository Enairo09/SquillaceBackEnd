import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';

const Change = (props) => {

    const [product, setproduct] = useState({
        id: '',
        name: '',
        price: 0,
        type: ''
    });
    const [updateProduct, setupdateProduct] = useState([]);
    const [redirect, setredirect] = useState(true);

    // je recupere le produit a modifier
    useEffect(() => {
        const fetchData = async () => {
            await fetch(`/api/get-one-product?id=${props.location.idProduct}`)
                .then(response => response.json())
                .then(response => {
                    setproduct({ id: response.products._id, name: response.products.name, price: response.products.price, type: response.products.type })
                    setupdateProduct({ ...updateProduct, id: response.products._id })
                })
                .catch(error => console.log("erreur fetch", error))
        }
        fetchData()
    }, []);

    //je change mon produit
    var changeProduct = () => {
        fetch(`/api/changeproduct`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `id=${updateProduct.id}&name=${updateProduct.name}&price=${updateProduct.price}&type=${updateProduct.type}`
        }).then(response => { setredirect(false) })
            .catch(error => console.log("erreur fetch", error))
    }
    if (redirect) {
        return (
            <div id="blocHome content">
                <div>
                    <div className='products'>
                        <div>
                            <h3>{product.name}</h3>
                            <h5>Prix : {product.price}€</h5>
                            <h5>Type de produit : {product.type}</h5>
                        </div>
                        <div>
                            <h5>Remplacer le nom du produit par :</h5>
                            <input
                                type="text"
                                className="Product-input"
                                name="name"
                                placeholder={product.name}
                                onChange={(e) => setupdateProduct({ ...updateProduct, name: e.target.value })}
                                value={updateProduct.name}
                            />
                            <h5>Remplacer le prix du produit par :</h5>
                            <input
                                type="number"
                                className="Product-input"
                                name="price"
                                placeholder={product.price}
                                onChange={(e) => setupdateProduct({ ...updateProduct, price: e.target.value })}
                                value={updateProduct.price}
                            />
                            <h5>Remplacer le type du produit par :</h5>
                            <input
                                type="text"
                                className="Product-input"
                                name="type"
                                placeholder={product.type}
                                onChange={(e) => setupdateProduct({ ...updateProduct, type: e.target.value })}
                                value={updateProduct.type}
                            />
                            <div >
                                <button className='change-btn'
                                    onClick={(e) => { changeProduct(e.target.value) }}
                                    value={product.id}>Modifier Produit</button>
                            </div>
                        </div>
                    </div>
                </div >

            </div>
        );
    } else {
        return <Redirect to="/" />
    }
};

export default Change;
