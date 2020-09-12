import React, { useState, useEffect } from 'react';
import fakeData from '../../fakeData';
import './Shop.css';
import Product from '../Product/Product';
import Cart from '../Cart/Cart';
import { addToDatabaseCart, getDatabaseCart } from '../../utilities/databaseManager';
import { Link } from 'react-router-dom';

const Shop = () => {

    const first10 = fakeData.slice(0,10);
    
   const [products,setProducts]=useState(first10);
   const [cart,setCart] = useState([]);

   useEffect(() =>{
       const saveCart =getDatabaseCart();
      // console.log(saveCart);
      const productKeys=Object.keys(saveCart);
      //console.log(productKeys);
      const previousCart=productKeys.map(existingKey =>{
          const product=fakeData.find(product=>product.key===existingKey);
          //console.log(existingKey,saveCart[existingKey]);
          product.quantity=saveCart[existingKey];
          return product;

      })
      console.log(previousCart);
      setCart(previousCart);
   },[])

   const handleAddProduct=(product)=>{
            const toBeAddedKey=product.key;
            const sameProduct=cart.find(product=>product.key==toBeAddedKey);
           let count=1;
           let newCart;
           if(sameProduct){
               count = sameProduct.quantity+1;
               const others=cart.filter(product=>product.key==toBeAddedKey)
               newCart=[...others,sameProduct];
           }
           else{
               product.quantity=1;
               newCart=[...cart,product];
           }           
            setCart(newCart);         
            addToDatabaseCart(product.key,count);         
   }
   
    return (
        <div className="twin-container">
          
            <div className="product-container">  
            {
                products.map(product=><Product 
                    showAddToCart={true}
                    key={product.key}
                    handleAddProduct={handleAddProduct}
                    product={product}
                    ></Product>)
            }                                  
           
            </div>
            <div className="cart-container">
                {/* <h3> This is cart</h3>
                 <h5>Order Summary : {cart.length} </h5> */}
                 <Cart cart={cart}>
                <Link to="/review">
                    <button className="main-button">Review Order</button>
                </Link>
                 </Cart>
            </div>
            
        </div>
    );
};



export default Shop;