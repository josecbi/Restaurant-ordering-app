import { menuArray } from "./data.js"

let orders = []
let noDuplicateOrders = []
let price = 0
let name = ''

const $foodContainer = document.getElementById('food-container')
const $orders = document.getElementById('orders')
const $form = document.getElementById('form')
const $nameModal = document.getElementById('name-modal')

document.addEventListener('click', function(event) {
    if(event.target.dataset.addBtn){
        addOrder(event.target.dataset.addBtn)        
    }
    else if(event.target.dataset.removeOrder) {
        removeOrder(event.target.dataset.removeOrder)
    } 
    else if(event.target.id === 'order-complete-btn'){        
        if(orders.length > 0){
            document.querySelector('.payment-modal').classList.remove('hidden')
        }
    }    
})

function addOrder(orderId) {
    const selectedOrder = menuArray.filter(menu => menu.id === Number(orderId))    
    orders = [...orders, ...selectedOrder]
    noDuplicateOrders = noDuplicates(orders)
    price = 0    
    noDuplicateOrders.forEach(order => price += (order.price * order.count))
    renderOrder(noDuplicateOrders)
}

function noDuplicates(arr) {
    const uniqueOrder = Array.from(new Set(arr))
    const result = uniqueOrder.map(order => {
        const count = arr.filter(element => order.id === element.id).length
        return { ...order, count }
    })
    return result
}

function renderOrder(arr) {
    $orders.innerHTML = ''    
    arr.forEach(order => {        
        $orders.innerHTML += `
            <div class="order" data-order="${order.id}">
                <div class="name-order" data-name-order="${order.id}">${order.name}</div>
                <div class="count-order" data-count-order="${order.id}">x ${order.count}</div>
                <div class="remove-order" data-remove-order="${order.id}">remove</div>
                <div class="price-order" data-price-order="${order.id}">$${order.price * order.count}</div>
            </div>            
        `        
    })  
    document.getElementById('price').textContent = price === 0 ? '' : `$${price}`  
}

function removeOrder(orderId){    
    orders.splice(orders.findIndex(order => order.id === Number(orderId)), 1)    
    noDuplicateOrders = noDuplicates(orders)
    price = 0
    noDuplicateOrders.forEach(order => price += (order.price * order.count))
    renderOrder(noDuplicateOrders)
}

$form.addEventListener('submit', function(event) {
    event.preventDefault() 

    if(!$nameModal.value){        
        document.querySelectorAll('.error')[0].classList.remove('hidden')
        document.getElementById('card-number').style.marginTop = '20px'        
        setTimeout(() => {
            document.querySelectorAll('.error')[0].classList.add('hidden')            
            document.getElementById('card-number').style.marginTop = '14px'
        }, 2500)
        return
    }  

    name = $nameModal.value 
    document.getElementById("payment-modal").classList.add('hidden')
    document.getElementById("order-container").classList.add('hidden')
    document.getElementById('end-purchase').classList.remove('hidden')
    $nameModal.value = ''  
    document.getElementById('end-purchase').textContent = `Thanks, ${name}! Your order is on its way!` 

    setTimeout(() => {
        document.getElementById("order-container").classList.remove('hidden')
        orders = []
        price = 0
        renderOrder(orders)
        document.getElementById('end-purchase').classList.add('hidden')
    }, 4000)  
})

function renderStock(arr) {
    arr.forEach(menu => {
        $foodContainer.innerHTML += `
            <div class="menu" data-menu="${menu.id}">
                <div class="emoji-menu" data-emoji-menu="${menu.id}">
                    ${menu.emoji}
                </div>
                <div class="description-menu" data-description-menu="${menu.id}">
                    <p class="name-menu" data-name-menu="${menu.id}">${menu.name}</p>
                    <p class="ingredients-menu" data-ingredients-menu="${menu.id}">${menu.ingredients.join(', ')}</p>
                    <p class="price-menu" data-price-menu="${menu.id}">$${menu.price}</p>
                </div>
                <div class="add-btn" data-add-btn="${menu.id}" id="${menu.id}">+</div>
            </div>
        `
    })    
}

renderStock(menuArray)