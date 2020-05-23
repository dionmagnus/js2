  const API_URL = 'http://localhost:3000';

  import basketModule from './basket.js';
  import goodsModule from './goods.js'

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
      basket: new basketModule.Basket(),  
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
