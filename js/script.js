  const API_URL = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

  
  function makeGETRequest(url) {
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
  }






  class GoodsItem {
    constructor(id, title, price) {
      this.id = id;
      this.title = title;
      this.price = price;
    }
    render() {
      return `<div class="goods-item clearfix">
                <img class="goods-img" src="img/stub.png" alt="${this.title}_img" width="300" height="200">
                <button class="goods-buy">Купить</button>
                <h3 class="goods-title">${this.title}</h3>
                <p class="goods-price">${this.price}</p>
              </div>`;
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
      
      /*
      this.goods = [
        { id: 1, title: 'Shirt', price: 150 },
        { id: 2, title: 'Socks', price: 50 },
        { id: 3, title: 'Jacket', price: 350 },
        { id: 4, title: 'Shoes', price: 250 },
      ];
      */
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

  const goodList = new GoodsList();
  goodList.fetchGoods();
  //goodList.render();
  //console.log(goodList.getGoodsCost(), " - стоимость всех товаров на витрине");


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
    add(productId, productQty) {
      this.basketItems.push(new BastetItem(productId, productQty));
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

  /**
   * Класс товара в корзине
   */
  class BasketItem {
    /**
      * @productId - id товара в корзине
      * @productQty - кол-во единиц данного товара в корзине
      */
    constructor(productId, productQty) {
      this.productId = productId;
      this.productQty = productQty;  
    }
  }