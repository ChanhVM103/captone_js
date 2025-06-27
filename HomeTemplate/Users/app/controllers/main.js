import productService from "../services/product-services.js";

const getEle = (id) => document.getElementById(id);

let allProducts = [];
let filteredProducts = [];

const showLoading = () => {
  getEle("productListContainer").innerHTML = `
    <div class="col-span-full flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  `;
};

const showEmptyState = () => {
  getEle("productListContainer").innerHTML = `
    <div class="col-span-full text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">Không tìm thấy sản phẩm</h3>
      <p class="mt-1 text-sm text-gray-500">Thử thay đổi bộ lọc hoặc sắp xếp.</p>
    </div>
  `;
};

const renderProductList = (productList) => {
  if (!productList || productList.length === 0) {
    showEmptyState();
    return;
  }

  let content = "";
  productList.forEach((product) => {
    content += `
      <div class="product-card bg-white rounded-2xl shadow-lg flex flex-col h-full overflow-hidden border border-gray-100">
        <div class="relative bg-gradient-to-tr from-blue-100 to-blue-50 flex items-center justify-center" style="height: 260px;">
          <img class="object-contain h-48 w-auto mx-auto drop-shadow-lg" src="${product.img}" alt="${product.name}" />
          <span class="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold ${product.type.toLowerCase() === 'iphone' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'} shadow">${product.type}</span>
        </div>
        <div class="flex-1 flex flex-col p-5">
          <h3 class="text-xl font-bold text-gray-900 mb-2 line-clamp-2">${product.name}</h3>
          <div class="flex items-center mb-2">
            <span class="text-lg font-bold text-blue-700 mr-2">$${product.price}</span>
          </div>
          <div class="text-gray-600 text-sm mb-2">${product.screen}</div>
          <div class="text-gray-600 text-sm mb-2">${product.backCamera}</div>
          <p class="text-gray-500 text-sm mb-4 line-clamp-2">${product.desc}</p>
          <div class="mt-auto pt-2">
            <button type="button" class="btn-add-cart w-full text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 shadow hover:scale-105 transition" data-id="${product.id}">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"></path>
              </svg>
              <span>Thêm vào giỏ</span>
            </button>
          </div>
        </div>
      </div>
    `;
  });
  getEle("productListContainer").innerHTML = content;
};

const fetchProductList = () => {
  showLoading();
  productService
    .getProductList()
    .then((res) => {
      allProducts = res.data;
      filteredProducts = [...allProducts];
      window.allProducts = allProducts;
      renderProductList(filteredProducts);
    })
    .catch((err) => {
      console.error(err);
      getEle("productListContainer").innerHTML = `
        <div class="col-span-full text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Không thể tải sản phẩm</h3>
          <p class="mt-1 text-sm text-gray-500">Vui lòng thử lại sau.</p>
          <div class="mt-6">
            <button onclick="location.reload()" class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
              Thử lại
            </button>
          </div>
        </div>
      `;
    });
};

// Lọc theo loại
const filterByType = (type) => {
  filteredProducts = productService.filterProductsByType(allProducts, type);
  renderProductList(filteredProducts);
};

// Sắp xếp theo giá
const sortByPrice = (order) => {
  if (order === "none") {
    filteredProducts = [...allProducts];
  } else {
    filteredProducts = productService.sortProductsByPrice(filteredProducts, order);
  }
  renderProductList(filteredProducts);
};

const initializeEventListeners = () => {
  // Lọc theo loại
  getEle("productFilter").addEventListener("change", (e) => {
    filterByType(e.target.value);
  });
  // Sắp xếp theo giá
  getEle("sortSelect").addEventListener("change", (e) => {
    sortByPrice(e.target.value);
  });
};

const initApp = () => {
  fetchProductList();
  initializeEventListeners();
};

document.addEventListener('DOMContentLoaded', initApp);
