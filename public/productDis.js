let cartsProducts = document.querySelector(".carts-products");
let productsNumber = document.querySelector(".products-number");
let products;
let cate;
//
function filter(catname){
    let product = (products.products).map((item)=>{
        if(item.name===catname){
            return`
            <article class="card ">
            <a href="./pages/product-details.html"><img width=266px src="${item.image}" alt=""></a>
    
            <div style="width: 266px;" class="content">
    
                <h1 class="title">${item.name}</h1>
                <p class="desc">
                    ${item.description}
                </p>
    
                <div class="flex" style="justify-content: space-between; padding-bottom: 0.7rem">
    
                    <div class="price">${item.price}</div>
                    <button class="add-to-cart"  onclick="cartoo('${item.id.replace(/'/g, "\\'")}')" ><i class="fa-solid fa-cart-plus"></i>Add to cart</button>
    
                </div>
            </div>
    
        </article>
    
            `
        }
    })
    document.querySelector("#productss").innerHTML = product;
    


}
// function to fetch the products data from Api.
let get_data_from_api = async()=>{
    let res = await fetch("/api/v1/products/s",{
        method:"GET",
    }).then((res)=>res.json());
    products = res;
    return res;
};

// function to fetch the categories data from Api.
let get_cate_from_api = async()=>{
    let res = await fetch("/api/v1/products/m",{
        method:"GET",
    }).then((res)=>res.json());
    cate = res;
    return res;
};




let addeditems = [];
async function cartoo(id) {
    let choosenItem = products.products.find((item) => item.id === id);
    
    if (!choosenItem) {
        console.error("Item not found");
        return;
    }

    // Add item to cart display
    cartsProducts.innerHTML += `<p>${choosenItem.name}</p>`;
    
    // Update cart count
    let productsLength = document.querySelectorAll(".carts-products p").length;
    productsNumber.innerHTML = productsLength;

    // Add item to added items array
    // addeditems = [...addeditems, choosenItem];
    // Prepare data to send to API
    

    let addedItems = {}

    let itemsData = await fetch("/api/v1/order",{
        method:"GET",
    }).then((res)=>res.json());

    let data = {};
    let result = itemsData.find(userOrder => userOrder.email === localStorage.getItem("email"))
    if (!result) {
        addedItems = {}
        addedItems[choosenItem.id.replace(/'/g, "\\'")] = {};
        addedItems[choosenItem.id.replace(/'/g, "\\'")]['quantity'] = 1;
        addedItems[choosenItem.id.replace(/'/g, "\\'")]['price'] = choosenItem.price;

        data = {
            orderItems: addedItems,
            email: localStorage.getItem("email")
        };

            
        // Function to send the products to the API
        const post_data_to_api = async () => {
            try {
                let res = await fetch("/api/v1/order/orderItem", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                
                if (!res.ok) {
                    throw new Error('Network response was not ok ' + res.statusText);
                }

                const result = await res.json();
                console.log('Success:', result);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        // Call the function to post data
        post_data_to_api();
    } else {
        addedItems = result.orderItems;
        if (choosenItem.id.replace(/'/g, "\\'") in addedItems) {
            addedItems[choosenItem.id.replace(/'/g, "\\'")]['quantity'] += 1;
        } else {
            addedItems[choosenItem.id.replace(/'/g, "\\'")] = {}
            addedItems[choosenItem.id.replace(/'/g, "\\'")]['quantity'] = 1
            addedItems[choosenItem.id.replace(/'/g, "\\'")]['price'] = choosenItem.price
        }
        let data = {"orderItems": addedItems}
        
        // Function to send the products to the API
        const updateOrderData = async () => {
            try { 
                let res = await fetch(`/api/v1/order/orderitem/${result._id.replace(/'/g, "\\'")}`, {
                    method: "PUT",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                
                if (!res.ok) {
                    throw new Error('Network response was not ok ' + res.statusText);
                }

                const myres = await res.json();
                console.log('Success:', myres);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        // Call the function to post data
        updateOrderData();
    }

    
}

//console.log(cate.CategoryList)



get_data_from_api().then(get_cate_from_api()).then((products) => {
    function drawcate(){
        console.log(cate)
        
        let category = (cate.CategoryList).map((item)=>{
            return`
            <article class="card ">
                <button onclick="filter(${item.name.replace(/'/g, "\\'")})">${item.name}</button>
            </article>
    
            `
        })
        document.querySelector("#cat").innerHTML = category;
    }
    drawcate();
    function draw(){
        console.log(cate)

        let product = (products.products).map((item)=>{
            return`
            <article class="card ">
            <a href="./pages/product-details.html"><img width=266px src="${item.image}" alt=""></a>

            <div style="width: 266px;" class="content">

                <h1 class="title">${item.name}</h1>
                <p class="desc">
                    ${item.description}
                </p>

                <div class="flex" style="justify-content: space-between; padding-bottom: 0.7rem">

                    <div class="price">${item.price}</div>
                    <button class="add-to-cart"  onclick="cartoo('${item.id.replace(/'/g, "\\'")}')" ><i class="fa-solid fa-cart-plus"></i>Add to cart</button>

                </div>
            </div>

        </article>
    
            `
        })
        document.querySelector("#productss").innerHTML = product;
    }
    draw();
}).then(()=>{
    filter(man)


})




