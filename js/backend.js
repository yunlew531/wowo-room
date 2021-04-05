function getOrders() {
  const api = `${API}/api/livejs/v1/admin/${api_path}/orders`;
  axios.get(api, {
    headers: {
      'Authorization': KEY
    }
  }).then(res => {
    ordersData = res.data.orders;
    renderOrders();
    const orderPieChartArr = c3jsHandler();
    renderOrderPieChart(orderPieChartArr);
  }).catch(err => {
    console.log(err);
  });
}

function removeAllOrder() {
  const api = `${API}/api/livejs/v1/admin/${api_path}/orders`;
  axios.delete(api, { headers: { 'Authorization': KEY } }).then(res => {
    ordersData = res.data.orders;
    renderOrders();
  }).catch(err => {
    console.log(err);
  });
}

function removeOrder(e) {
  if (e.target.parentNode.className !== 'removeOrder-btn') return;
  const ID = e.target.parentNode.parentNode.querySelector('.orderId').textContent;
  const api = `${API}/api/livejs/v1/admin/${api_path}/orders/${ID}`;
  axios.delete(api, { headers: { 'Authorization': KEY } }).then(res => {
    ordersData = res.data.orders;
    renderOrders();
  }).catch(err => {
    console.log(err);
  });
}

function renderOrders() {
  let orderStr = '';
  ordersData.forEach(order => {
    let productStr = '';
    const paid = (order.paid ? '已付款' : '未處理');
    const checked = (order.paid ? 'checked' : '');
    const active = (checked ? 'active' : '');
    const date = new Date(order.createdAt * 1000);
    const yyyy = date.getFullYear();
    const mm = date.getMonth() + 1;
    const dd = date.getDate();
    const hour = date.getHours();
    const min = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
    const sec = (date.getSeconds() < 10 ? '0' : '') + date.getSeconds();
    const time = `${yyyy}/${mm}/${dd} ${hour}:${min}:${sec}`;
    order.products.forEach(product => {
      productStr += `
        <p>${product.title}</p>
      `;
    });
    orderStr += `
      <tr>
        <td class="orderId">${order.id}</td>
        <td>${order.user.name} ${order.user.tel}</td>
        <td>${order.user.address}</td>
        <td>${order.user.email}</td>
        <td>${productStr}</td>
        <td>${time}</td>
        <td class="paid-status ${active}">${paid}<input type="checkbox" ${checked}></td>
        <td class="removeOrder-btn">
          <i class="fas fa-trash"></i>
        </td>
      </tr>
    `;
  });
  orderList.innerHTML = orderStr;
}

function orderEdit(e) {
  if (e.target.nodeName !== 'INPUT') return;
  const api = `${API}/api/livejs/v1/admin/${api_path}/orders`;
  const ID = e.target.parentNode.parentNode.querySelector('.orderId');
  const paid = (e.target.checked ? true : false);
  const obj = {
    id: ID.textContent,
    paid
  };
  axios.put(api, { data: obj }, { headers: { 'Authorization': KEY } }).then(res => {
    ordersData = res.data.orders;
    renderOrders();
  }).catch(err => {
    console.log(err);
  })
}

function c3jsHandler() {
  let obj = {};
  ordersData.forEach(order => {
    order.products.forEach(product => {
      obj[product.title] = (obj[product.title] ? obj[product.title] += product.quantity : product.quantity);
    })
  });
  let keyArr = Object.keys(obj);
  let orderPieChartArr = [];
  keyArr.forEach(key => {
    const arr = [key, obj[key]];
    orderPieChartArr.push(arr);
  });
  return orderPieChartArr;
}

function renderOrderPieChart(arr) {
  const chart = c3.generate({
    bindto: '#pieChart',
    data: {
      columns: arr,
      type: 'pie',
    },
    padding: {
      top: 30,
      bottom: 30
    },
    color: {
      pattern: ['#B174FF', '#D5B4FF', '#892DFF', '#5900CB', '#3D008B', '#22004D', '#240B43', '#211530']
    },
    pie: {
      // label: {
      //   padAngle: .1
      // }
    }
  });
}

function init() {
  getOrders();
}

let ordersData = [];
// const KEY = ''; // 管理員金鑰
const KEY = ''; // 管理員金鑰
const api_path = 'yunlew531';
const API = 'https://hexschoollivejs.herokuapp.com';
const orderList = document.querySelector('#orderList');
const removeAllOrderBtn = document.querySelector('.removeAllOrder-btn');
const paidStatus = document.querySelector('#orderList .paid-status');
const removeOrderBtn = document.querySelector('.removeOrder-btn > i');

init();

orderList.addEventListener('change', orderEdit);
removeAllOrderBtn.addEventListener('click', removeAllOrder);
orderList.addEventListener('click', removeOrder);

if (!KEY) alert('你無此權限! 資料無法正常顯示!')