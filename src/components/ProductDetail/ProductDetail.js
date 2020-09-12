import React from 'react';
import fakeData from '../../fakeData';
import './ProductDetail.css';
import { useParams } from 'react-router-dom';
import Product from '../Product/Product';

const ProductDetail = () => {

    const {productKey}=useParams();    
    const product=fakeData.find(product=>product.key===product.Key);
    //console.log(product);
    return (
        <div>
            <h4>Your Product details. </h4>
            <Product showAddToCart={false} product={product}></Product>
        </div>
    );
};

export default ProductDetail;