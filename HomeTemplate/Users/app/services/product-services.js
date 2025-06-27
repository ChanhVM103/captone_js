const BASE_URL = "https://683fd1e35b39a8039a55bd89.mockapi.io/api/Products";

class ProductService {
  getProductList = () => {
    return axios({
      url: BASE_URL,
      method: "GET",
    });
  };

  getProductById = (id) => {
    return axios({
      url: `${BASE_URL}/${id}`,
      method: "GET",
    });
  };

  searchProduct = (keyword, productList) => {
    const lowerKeyword = keyword.toLowerCase().trim();
    return productList.filter(p => 
      p.name.toLowerCase().includes(lowerKeyword) ||
      p.desc.toLowerCase().includes(lowerKeyword) ||
      p.type.toLowerCase().includes(lowerKeyword)
    );
  };

  sortProductsByPrice = (productList, order = "asc") => {
    const sorted = [...productList]; // clone để tránh thay đổi mảng gốc
    sorted.sort((a, b) => {
      return order === "asc"
        ? Number(a.price) - Number(b.price)
        : Number(b.price) - Number(a.price);
    });
    return sorted;
  };

  filterProductsByType = (productList, type) => {
    if (type === "all") {
      return productList;
    }
    return productList.filter(product => 
      product.type.toLowerCase() === type.toLowerCase()
    );
  };
}

const productService = new ProductService();
export default productService; 