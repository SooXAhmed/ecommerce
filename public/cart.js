let products;   // Contain all the products that is in the database.
let ordersItems;    
let users;
let data;
let pre;
let total=0;
let result;
let productsNumber = document.querySelector(".products-number");


// Function to getting all the products in the database ans save it in the products.
let get_data_from_api = async () => {
    try {
        let res = await fetch("/api/v1/products/s", {
            method: "GET",
        });
        let data0 = await res.json();
        products = data0;
        return data0;
    } catch (error) {
        console.error("Error fetching products data:", error);
    }
};



// Function to getting orderItems from the database and save it in orderItems.
let get_ordersItems_from_api = async () => {
    try {
        let res = await fetch("/api/v1/order", {
            method: "GET",
        });
        let data1 = await res.json();
        ordersItems = data1;
        return data1;
    } catch (error) {
        console.error("Error fetching orders items data:", error);
    }
};



// fuction to getting users data from the backend and save it in the users.
let get_users_from_api = async () => {
    try {
        let res = await fetch("/api/v1/user", {
            method: "GET",
        });
        let data2 = await res.json();
        users = data2;
        return data2;
    } catch (error) {
        console.error("Error fetching orders items data:", error);
    }
};


    // fuction to delete orderItems.
    let del = async (idd) => {
        try {
            let res = await fetch(`/api/v1/order/${idd}`, {
                method: "DELETE",
            });
        } catch (error) {
            console.error("Error fetching orders items data:", error);
        }
    };
    


// Function to post data to api
let post_data_to_api = async (data) => {
    try {
        let res = await fetch("/api/v1/order", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
    
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
    
        let responseData = await res.json();
        console.log(responseData);
        del(result._id)
        productsNumber=0
        //console.log(result._id)
    } catch (error) {
        console.error('There was an error!', error);
    }
};

// Fetch orders items data first, then products data.
get_ordersItems_from_api()  //Getting orderItems data from the database.
    .then(() => get_data_from_api())  //Getting products data from the database.
    .then(()=>get_users_from_api())   // Getting All users data from the database.
    .then(() => {
        result = ordersItems.find(userOrder => userOrder.email === localStorage.getItem("email")) //TO get the order of the user.
        if(result){
            function displayOrderItems(){
                let orderupdate = Object.keys(result.orderItems).forEach(item => {
                    //console.log(item)
                    let pName;
                    let pImg;
                    (products.products).map((product)=>{
                        //console.log(product)
                        if (product.id === item) {
                            pName = product.name;
                            pImg = product.image;
                            return 0
                        }
                        //console.log(pName)

                    })
                    //console.log(pName)
                    let img =pImg;
                    pre= `
                    <article class="product flex">
                        <button>
                            <i class="fa-solid fa-trash-can"> </i>
                        </button>
                        <p class="price">${result.orderItems[item]['price']*result.orderItems[item]['quantity']}</p>
                        <div class="flex" style="margin-right: 1rem">
                        <div class="quantity flex">${result.orderItems[item]['quantity']}</div>
                        </div>
                        <p class="title">${pName}</p>
                        <img
                        style="border-radius: 0.22rem"
                        width="70"
                        height="70"
                        alt="..."
                        src="${img}"
                        />
                        </article>
                        `
                //let pre=`<p>${result.orderItems[item]['quantity']}</p>`
                document.querySelector("#cart").innerHTML += pre;
                    

                })
                
            }
            displayOrderItems();
        
        }
        else{
            pre=`<p>You Dont Have Any Orders In the cart</p>`
            document.querySelector("#cart").innerHTML = pre;
        }
    })
    .then(()=>{
        let usersresult = users.find(user => user.email === localStorage.getItem("email"))
        let result = ordersItems.find(userOrder => userOrder.email === localStorage.getItem("email"))
        //console.log(usersresult)
        //console.log(result)
        let ls = [];
        let ls2 = [];
        let ls3 = [];
        //result.orderItems[item]['quantity']
        console.log(result)
        Object.keys(result.orderItems).forEach(item => {
            ls=[...ls,item]
        })
        Object.keys(result.orderItems).forEach(item => {
            ls2=[...ls2,result.orderItems[item]['quantity']]
        })
        Object.keys(result.orderItems).forEach(item => {
            ls3=[...ls3,result.orderItems[item]['price']]
        })
        Object.keys(result.orderItems).forEach(item => {
            total+=(result.orderItems[item]['quantity'])*(result.orderItems[item]['price'])
            //total+=(result.ordersItems[item]['price']*result.ordersItems[item]['quantity'])
        })
        console.log(total)

        data = {
            "orderItems":ls,
            "orderItemsQ":ls2,
            "orderItemsP":ls3,
            "shippingAddress1":usersresult.city,
            "shippingAddress2": usersresult.street,
            "city": usersresult.city,
            "zip": usersresult.zip,
            "country": usersresult.country,
            "phone": usersresult.phone,
            "totalPrice": total,
            "user":usersresult._id
        };  
        

        return data;
    })
    .then(()=>{let cash= `
    <h1>Cart Summary</h1>

    <div class="flex">
        <p class="Subtotal">Subtotal</p>
        <p>${total}</p>
    </div>
    <button onclick="post_data_to_api(data)" class="checkout">CHECKOUT</button>
        `
//let pre=`<p>${result.orderItems[item]['quantity']}</p>`
document.querySelector("#summ").innerHTML = cash;
    })//data =>{return post_data_to_api(data)})
    .catch(error => {console.error("Error in the data fetching process:", error);
})