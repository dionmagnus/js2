  const API_URL = 'http://localhost:3000';


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
      makeGETRequest(`${API_URL}/catalog`)
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

  Vue.component('search', {
    props: ['value'],
    template: `
    <div class="search-wrp">
      <input class="search-field" type="search"
        placeholder="Введите название товара..."
        v-bind:value="value"
        v-on:input="$emit('input', $event.target.value)"
      /><button class="btn search-btn" v-on:click="$emit('do-search')">Искать</button>  
    </div>
   `
  });

  Vue.component('basket', {
    props: ['basket'],
    template: `
    <div class="cart-wrp">
      <h3>Корзина</h3>
      <div v-if="basket.getProducts().length">
          <div class="cart-item" v-for="basketItem in basket.getProducts()">
            <div class="cart-item-content">{{ basketItem.productName }} - {{ basketItem.productQty }} шт.</div>
            <button class="btn product-delete-btn" v-on:click="$emit('do-remove-item', basketItem.productId)">Удалить</button>
          </div>
          <hr>
          <div class="cart-total-cost">
            Итого: {{ basket.getProductsCost() }}$
          </div>
          <button class="btn clear-basket-btn" v-on:click="$emit('do-clear-basket')">Очистить корзину</button>
      </div>
      <div v-else>
        Корзина пустая
      </div>
    </div>
    `
  });

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
      makeHTTPRequest(method, url, data = null) {
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
      
          xhr.open(method, url, true);
          if (method == "POST")
              xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
          xhr.send(data);
        });
      },
      fetchGETResponse(goodsJson) {
        this.goods = JSON.parse(goodsJson); 
        this.filteredGoods = this.goods;
      },
      fetchGETBasket(basketJson) {
        this.basket.unSerializeFromJson(basketJson);
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
      onClearBasket() {
        this.basket.clear();
        this.saveBasket();
      },
      onRemoveBasketItem(productId) {
        this.basket.remove(productId);
        this.saveBasket();
      },
      onAddProduct(event) {
        let id = parseInt(event.target.getAttribute("data-id"));
        let good = this.goods.filter((item) => item.id_product == id)[0];
        this.basket.add(id, 1, good.product_name, good.price);
        this.saveBasket();
      },
      saveBasket() {
        this.makeHTTPRequest("POST", `${API_URL}/basket`, this.basket.serializeToJson())
        .then(console.log);
      }
    },
    
    mounted() {      
      this.makeHTTPRequest('GET', `${API_URL}/catalog`)
      .then(this.fetchGETResponse);

      this.makeHTTPRequest('GET', `${API_URL}/basket`)
      .then(this.fetchGETBasket);
    }  
  });
