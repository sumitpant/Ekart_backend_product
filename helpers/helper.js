const findProduct =(product ,products)=>{
  return products.filter(data => data.title.toLowerCase().includes(product.toLowerCase()));

}
const geneateRandom =( products)=>{
    let min =Math.random() *(products.length -0) +0;
    return products.slice(0,min);
}
module.exports = {
    findProduct,
    geneateRandom
}