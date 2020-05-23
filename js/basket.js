
  /**
   * Класс товара в корзине
   */
  class BasketItem {
    /**
      * @productId - id товара в корзине
      * @productQty - кол-во единиц данного товара в корзине
      * @productName - название товара
      * @productPrice - цена товара
      */
    constructor(productId, productQty, productName, productPrice) {
      this.productId = productId;
      this.productQty = productQty;
      this.productName = productName;
      this.productPrice = productPrice;  
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
     * Сохранят корзину в json формат
     * @returns string - json представление корзины
     */
    serializeToJson() {
      return JSON.stringify(this.basketItems);
    }
    
    /**
     * Восстанавливает корзину из строки json
     * 
     * @json string - json представление корзины
     */
    unSerializeFromJson(json) {
      this.basketItems = JSON.parse(json);
    }
    /**
     * Добавляет товар в корзину
     *
     * @productId integer - id товара, который добавляется
     * @productQty integer - кол-во единиц добавляемого товара
     * 
     */
    add(productId, productQty, productName, productPrice) {
      let basketItemArr = this.basketItems.filter((item) => item.productId == productId);
      if (basketItemArr.length > 0)
        basketItemArr[0].productQty += productQty;
      else
        this.basketItems.push(new BasketItem(productId, productQty, productName, productPrice));
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
     * Удаляет все покупки из корзины
     */
    clear() {
      this.basketItems = [];
    }
    
    /**
     * Возвращает стоимость товаров в корзине
     * @returns number - стоимоть всех товаров в корзине
     */
    getProductsCost() {
      return this.basketItems.map(item => item.productQty * item.productPrice).reduce((acc, item) => acc + item);
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

  export default {
    BasketItem: BasketItem,
    Basket: Basket,
  }