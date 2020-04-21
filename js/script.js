  /*
 const goods = [
    { title: 'Shirt', price: 150 },
    { title: 'Socks', price: 50 },
    { title: 'Jacket', price: 350 },
    { title: 'Shoes', price: 250 },
  ];
  
  
  const renderGoodsList = (list = goods) => {
    let goodsList = list.map(item => renderGoodsItem(item.title, item.price));
    document.querySelector('.goods-list').innerHTML = goodsList.join(' ');
  }
  */
 
  class GoodsItem {
    constructor(title, price) {
      this.title = title;
      this.price = price;
    }
    render() {
      return `<div class="goods-item"><img class="goods-img" src="img/stub.png" alt="${this.title} img" width="300" height="200"><h3 class="goods-title">${this.title}</h3><p class="goods-price">${this.price}</p></div>`;
    }
  }

  class GoodsList {
    constructor() {
      this.goods = [];
    }
    
    fetchGoods() {
      this.goods = [
        { id: 1, title: 'Shirt', price: 150 },
        { id: 2, title: 'Socks', price: 50 },
        { id: 3, title: 'Jacket', price: 350 },
        { id: 4, title: 'Shoes', price: 250 },
      ];
    }
    
    render() {
      let listHtml = '';
      this.goods.forEach(good => {
        const goodItem = new GoodsItem(good.title, good.price);
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
  goodList.render();
  console.log(goodList.getGoodsCost(), " - стоимость всех товаров на витрине");


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
      throw "NotImplemented";
    }

    /**
     * Удаляет товар в корзину
     *
     * @productId integer - id товара, который удаляется
     * 
     */
    remove(productId) {
      throw "NotImplemented";
    }

    /**
     * Возвращает стоимость товаров в корзине
     * @returns number - стоимоть всех товаров в корзине
     */
    getProductsCost() {
      throw "NotImplemented";
    }

    /**
     * Возвращает количество товаров в корзине
     * @returns integer - количество товаров в корзине
     */
    getProductsCount() {
      throw "NotImplemented";
    }

    /**
     * Возвращает товары в корзине
     * @returns array - список товаров в корзине
     */
    getProducts() {
      throw "NotImplemented";
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