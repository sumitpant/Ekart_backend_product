const axios = require('axios');
const asyncWrapper = require('../middlewares/async');
const { findProduct, geneateRandom } = require('../helpers/helper')
const  Product = require('../models/CartModel');

const allProducts = async () => {
    return await axios.get('https://fakestoreapi.com/products');
}




const getAllProducts = asyncWrapper(async (req, res, next) => {
    let result = await allProducts();
    res.send(result.data);
});

const searchProduct = async (req, res, next) => {
    let product = req.params.product;
    console.log(req.params)
    console.log(product);
    let products = await allProducts();
    let result = findProduct(product, products.data);
    res.json(result);
}


const deals = async (req, res, next) => {
    console.log("/deals")
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];


    if (token == null) {
        return res.status(401).json({ msg: 'No Token' });
    }
    else {

        try {

            console.log("asdafadf");
            const response = await axios.post('http://localhost:3030/verify', { token });
            console.log(response.data);
            if (response.data.msg === "Verified") {
           
                let products = await allProducts();
                const deals = geneateRandom(products.data);

                return res.status(200).json({ deals });

            }

        }
        catch (err) {
            res.status(401).json({ msg: 'Auth expired' });
        }


    }

}
const addToCart = async (req, res) => {
    
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
   
    if (token == null) {
        return res.status(401).json({ msg: 'No Token' });
    }
    else {
        try{
            const response = await axios.post('http://localhost:3030/verify', { token });
             
            if (response.data.msg === "Verified") {
                 
                let update = await Product.findOneAndUpdate({ userid: response.data.user },
                    { "$push": { "product": req.body.product } },
                    { new: true, runValidators: true }
    
                ).exec();
    
                return res.status(200).json({ msg: `Cart updated with ${update}` });
            }
    
            else {
              return    res.status(401).json({ msg: 'Auth expired' });
            }

        }
        catch(err){
            return res.status(500).json({ msg: err.message });
        }
   

    }

}
const getCartItems = async(req, res) =>{
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        return res.status(401).json({ msg: 'No Token' });
    }
    else {
        try{
            const response = await axios.post('http://localhost:3030/verify', { token });
            if (response.data.msg === "Verified") {
                let cart = await Product.findOne({ userid: response.data.user }).exec()
                return res.status(200).json({ msg: `Cart  ${cart}`  ,cart : cart.product});
            }
    
            else {
              return    res.status(401).json({ msg: 'Auth expired' });
            }

        }
        catch(err){
            return res.status(500).json({ msg: err.message });
        }
   

    }

}

const removeFromCart = async(req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        return res.status(401).json({ msg: 'No Token' });
    }
    else {
        try{
            const response = await axios.post('http://localhost:3030/verify', { token });
             console.log("res",response.data.id)
            if (response.data.msg === "Verified") {
                  
                let cart = await Product.findOne({ userid: response.data.user }).exec()
                  
                let index = cart.product.findIndex(data=>data.id === req.body.id);
                let products =[...cart.product];
                products.splice(index, 1);
                console.log(products.length)
                let updatedcart = await Product.findOneAndUpdate({userid: response.data.user},products).exec();
                console.log(updatedcart.length);

                return res.status(200).json({ msg: `Cart  ${cart}`  ,cart : updatedcart});
            }
    
            else {
              return    res.status(401).json({ msg: 'Auth expired' });
            }

        }
        catch(err){
            return res.status(500).json({ msg: err.message });
        }
   

    }
    
}

module.exports = {
    getAllProducts,
    searchProduct,
    deals,
    addToCart,
    getCartItems,
    removeFromCart
}