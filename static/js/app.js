function AppController($scope, $http, $mdDialog) {
  var self = this;

  self.askList = []
  self.bidList = []
  self.dealList = []
  self.latest = 0
  self.dealListNumber = 1
  self.orderList = []
  self.current = {}

  $scope.showDetailNum = 0

  // 交易单对象
  var dealObj = {
    number: 0,
    date: null,
    ask: {},
    bid: {},
    quantity: 0,
    price: 0
  }

  // 分离叫单数据
  function sepOrders(res) {
    var data = res.data
    for (var i = 0; i < data.length; i++) {
      if (self.orderList.indexOf(data[i].number) !== -1) {
        continue
      }
      if (data[i].side === 'ask') {
        self.askList.push(data[i])
      } else {
        self.bidList.push(data[i])
      }
      self.orderList.push(data[i].number)
    }

    // 价格后单号排序
    self.askList = self.askList.sort(function(a, b) {
      if (a.price === b.price) {
        return a.number - b.number
      }

      return a.price - b.price
    })
    self.bidList = self.bidList.sort(function(a, b) {

      if (a.price === b.price) {
        return a.number - b.number
      }

      return b.price - a.price
    })

    console.log('ask:' + self.askList.length + ' bid:' + self.bidList.length)
    dealOrders()
  }

  // 订单交易
  function dealOrders() {

    var aL = self.askList
    var bL = self.bidList

    while (aL.length && bL.length && aL[0].price <= bL[0].price) {
      var newDeal = objCopy(dealObj)

      newDeal.date = new Date();
      newDeal.number = self.dealListNumber++;
      newDeal.quantity = Math.min(aL[0].quantity, bL[0].quantity)
      newDeal.price = (aL[0].price + bL[0].price) / 2
      newDeal.ask = objCopy(aL[0])
      newDeal.bid = objCopy(bL[0])

      // 交易完成
      self.dealList.unshift(newDeal);

      // 更新报价列表
      if (newDeal.quantity === aL[0].quantity) {
        self.latest = aL[0].number > self.latest ? aL[0].number : self.latest
        aL.shift()
        bL[0].quantity = bL[0].quantity - newDeal.quantity
      } else {
        self.latest = bL[0].number > self.latest ? bL[0].number : self.latest
        bL.shift()
        aL[0].quantity = aL[0].quantity - newDeal.quantity
      }
    }

    $scope.ask = self.askList
    $scope.bid = self.bidList
    $scope.deal = self.dealList
  }
  
  // 请求订单
  function GetOrder() {
    return $http({
      method: 'GET',
      url: '/listOrders',
      params: {
        start: self.latest,
        size: 100
      }
    }).then(sepOrders)
  }

  // 定时5秒
  setInterval(GetOrder, 5000)


  var dialog = document.querySelector('dialog');
  $scope.showDetail = function(num) {
    
    $scope.current = self.dealList[num]
    dialog.showModal()
  }

  $scope.closeDialog = function() {
     dialog.close()
  }
}

// 简单对象复制
function objCopy(obj) {
  return JSON.parse(JSON.stringify(obj))
}

angular.module('myApp', ['ngMaterial'])
    .controller('AppController', ['$scope', '$http', '$mdDialog', AppController])
  
