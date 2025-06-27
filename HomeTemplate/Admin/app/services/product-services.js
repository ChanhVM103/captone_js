class ProductService {
    getListProductApi(){
        const promise = axios({
            url: "https://683fd1e35b39a8039a55bd89.mockapi.io/api/Products",
            method: "GET",
        });
        return promise;
    }

    deleteProductApi(id){
        const promise = axios({
            url:`https://683fd1e35b39a8039a55bd89.mockapi.io/api/Products/${id}`,
            method:"DELETE",
        });
        return promise;
    }

    addProductApi(product){
        const promise = axios({
            url:"https://683fd1e35b39a8039a55bd89.mockapi.io/api/Products",
            method:"POST",
            data: product,
        })
        return promise;
    }

    getProductById(id){
        const promise = axios({
            url:`https://683fd1e35b39a8039a55bd89.mockapi.io/api/Products/${id}`,
            method:"GET",
        });
        return promise
    }

    updateProductId(product){
        const promise = axios({
            url:`https://683fd1e35b39a8039a55bd89.mockapi.io/api/Products/${product.id}`,
            method:"PUT",
            data: product,
        })
        return promise;
    }

    searchProduct(keyword, productList) {
        const lowerKeyword = keyword.toLowerCase().trim();
        return productList.filter(p => p.name.toLowerCase().includes(lowerKeyword));
      }
     
    sortProductsByPrice(productList, order = "asc") {
        const sorted = [...productList]; // clone để tránh thay đổi mảng gốc
        sorted.sort((a, b) => {
          return order === "asc"
            ? Number(a.price) - Number(b.price)
            : Number(b.price) - Number(a.price);
        });
        return sorted;
      } 
}
export default ProductService;