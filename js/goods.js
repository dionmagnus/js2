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

  export default {
    GoodsItem: GoodsItem,
    GoodsList: GoodsList
  }