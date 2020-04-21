import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';


const Form = (props) => {

	const [product, setproduct] = useState({
		name: '',
		price: 0,
		type: '',
		enabled: true
	});
	const [redirect, setredirect] = useState(true);

	//j'ajoute un nouveau produit dans ma bdd : 
	const newProduct = async (e) => {

		e.preventDefault();
		let url = '/addproduct';

		await fetch(url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: `name=${product.name}&price=${product.price}&type=${product.type}&enabled=${product.enabled}`
		}).then(response => response.json())
			.then(response => {
				return <Redirect to={`/`} />;
			})
		setredirect(false);
		console.log("j'ajoute ce produit : ", product);
	};


	if (redirect) {
		return (
			<div id="form">
				<form className="new-product">
					<h2 style={{ margin: 30 }}>Ajouter un produit</h2>
					<div className='form'>

						<h5 className='inputname'>Nom :</h5>
						<input
							className="Product-input"
							name="name"
							placeholder="Nom du produit"
							onChange={(e) => setproduct({ ...product, name: e.target.value })}
							value={product.name}
							required
						/>

						<h5 className='inputname' >Prix :</h5>
						<input
							type='number'
							className="Product-input"
							name="price"
							placeholder="Prix du produit"
							onChange={(e) => setproduct({ ...product, price: e.target.value })}
							value={product.price}
							required
						/>

						<h5 className='inputname' >Type :</h5>
						<input
							className="Product-input"
							name="type"
							placeholder="Type de produit"
							onChange={(e) => setproduct({ ...product, type: e.target.value })}
							value={product.type}
							required
						/>

						<input className='button' type="submit" method="post" value="Ajouter Produit" onClick={(e) => newProduct(e)} />
					</div>
				</form>
			</div >
		);
	} else {
		//si mon produit est bien ajouté je retourne sur le listing :
		return <Redirect to="/" />
	}
};

export default Form;

