import React, { useState, useEffect } from 'react';
import './Review.css';
import { getDatabaseCart, removeFromDatabaseCart, processOrder } from '../../utilities/databaseManager';
import fakeData from '../../fakeData';
import ReviewItem from '../ReviewItem/ReviewItem';
import Cart from '../Cart/Cart';
import happyImage from '../../images/giphy.gif'
import { useHistory } from 'react-router-dom';

const Review = () => {
  
    const [cart,setCart]=useState([]);
     const [orderPlaced,setOrderPlaced]=useState(false);

     const history=useHistory();

    const handleProceedCheckout=() =>{
        history.push('/shipment');
    }
    let thankyou;
    if(orderPlaced){
        thankyou=<img src={happyImage} alt=""/>
    }
    const removeProduct=(productKey)=>{
        console.log('Remove Clicked',productKey);
        const newCart=cart.filter(product=>product.key!==productKey);
        setCart(newCart);
        removeFromDatabaseCart(productKey);
    };
    //cart data is loaded here 
    useEffect(()=>{
        const savedCart=getDatabaseCart();
        const productKeys= Object.keys(savedCart);
        const cartProducts=productKeys.map(key=>{
           const product=fakeData.find(product=>product.key===key);
           product.quantity=savedCart[key];
           return product;
        });
       // console.log(cartProducts);
       setCart(cartProducts);     
    },[]);
    return (
        <div className="twin-container">
            {/* <h3>Cart Items :{cart.length}</h3> */}
            <div className="product-container">
                {
                    cart.map(product=><ReviewItem 
                        key={product.key}
                        removeProduct={removeProduct}
                        product={product}
                        ></ReviewItem>)
                }
                {
                    thankyou
                }
               
            </div>
            <div className="cart-container">
                <Cart cart={cart} >
                    <button onClick={handleProceedCheckout} className="main-button">
                       Proceed Checkout</button>
                    
                </Cart>              
            </div>

           
        </div>
    );
};

export default Review;