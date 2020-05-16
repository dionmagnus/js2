  const API_URL = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';


  class GoodsItem {
    constructor(id, title, price) {
      this.id = id;
      this.title = title;
      this.price = price;
    }
  }

  class GoodsList {
    constructor() {
      this.goods = [];
    }
    
    fetchGoods() {
      makeGETRequest(`${API_URL}/catalogData.json`)
      .then((goodsJson) => {
          return new Promise((resolve, reject) => {
            this.goods = JSON.parse(goodsJson);
            resolve();
          });
      })
      .then(() => this.render());
    } 
    
    render() {
      let listHtml = '';
      this.goods.forEach(good => {
        const goodItem = new GoodsItem(good.id_product, good.product_name, good.price);
        listHtml += goodItem.render();
      });
      document.querySelector('.goods-list').innerHTML = listHtml;
    }

    /**
     * Возвращает стоимость всех товаров на витрине
     * @return number - стоимоть
     */
    getGoodsCost() {
      return this.goods.map((item) => item.price).reduce((acc, item) => acc + item);
    }
  }

  /**
   * Класс товара в корзине
   */
  class BasketItem {
    /**
      * @productId - id товара в корзине
      * @productQty - кол-во единиц данного товара в корзине
      * @productName - название товара
      * @productPrize - цена товара
      */
    constructor(productId, productQty, productName, productPrize) {
      this.productId = productId;
      this.productQty = productQty;
      this.productName = productName;
      this.productPrize = productPrize;  
    }
  }

  /**
   * Класс корзины
   */
  class Basket {
    constructor() {
      this.basketItems = [];
    }

    /**
     * Добавляет товар в корзину
     *
     * @productId integer - id товара, который добавляется
     * @productQty integer - кол-во единиц добавляемого товара
     * 
     */
    add(productId, productQty, productName, productPrize) {
      let basketItemArr = this.basketItems.filter((item) => item.productId == productId);
      if (basketItemArr.length > 0)
        basketItemArr[0].productQty += productQty;
      else
        this.basketItems.push(new BasketItem(productId, productQty, productName, productPrize));
    }

    /**
     * Удаляет товар в корзину
     *
     * @productId integer - id товара, который удаляется
     * 
     */
    remove(productId) {
      this.basketItems = this.basketItems.filter(item => item.productId != productId);
    }

    /**
     * Возвращает стоимость товаров в корзине
     * @returns number - стоимоть всех товаров в корзине
     */
    getProductsCost() {
      return this.basketItems.map(item => item.price).reduce((acc, item) => acc + item);
    }

    /**
     * Возвращает количество товаров в корзине
     * @returns integer - количество товаров в корзине
     */
    getProductsCount() {
      return this.basketItems.length;
    }

    /**
     * Возвращает товары в корзине
     * @returns array - список товаров в корзине
     */
    getProducts() {
      return this.basketItems;
    }
  }

  const mainApp = new Vue({
    el: '#app',
    data: {
      filteredGoods: [],
      goods: [],
      searchText: '',
      showBasket: false,
      basket: new Basket(),  
    },
    methods: {
      makeGETRequest(url) {
        return new Promise((resolve, reject) => {
          let xhr;
    
          if (window.XMLHttpRequest) {
            xhr = new XMLHttpRequest();
          } else if (window.ActiveXObject) {
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
          }
      
          xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
              //Для простоты считаем, что только HTTP 1.1 200 соответствует успеху
              if (xhr.status == 200) {
                resolve(xhr.responseText);
              } else {
                reject(xhr.status, xhr.statusText);
              }
            }
          }
      
          xhr.open('GET', url, true);
          xhr.send();
        });
      },
      fetchGETResponse(goodsJson) {
        this.goods = JSON.parse(goodsJson); 
        this.filteredGoods = this.goods;
      },
      onSearch() {
        if (this.searchText != '') {
          this.filteredGoods = this.goods.filter((item) => item.product_name.toLowerCase().includes(this.searchText.toLowerCase()));
        } else
          this.filteredGoods = this.goods;
      },
      onCart() {
        this.showBasket = !this.showBasket;
      },
      onAddProduct(event) {
        let id = parseInt(event.target.getAttribute("data-id"));
        let good = this.goods.filter((item) => item.id_product == id)[0];
        this.basket.add(id, 1, good.product_name, good.prize);

        console.log(this.basket);
      }
    },
    mounted() {      
      this.makeGETRequest(`${API_URL}/catalogData.json`)
      .then(this.fetchGETResponse);
    }




  });
