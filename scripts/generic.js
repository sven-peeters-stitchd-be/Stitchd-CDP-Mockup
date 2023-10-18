function refreshAccountInfoLabel() {
    
    var accountNavigation = document.getElementById("nav-account");

    if (!accountNavigation)
        return;

    if (localStorage.userLoggedIn == "true") {
        if (typeof logoutTabClicked === "function")
            logoutTabClicked();
        accountNavigation.text = "Account (" + localStorage.userName + ")";
        
        exponea.identify(
            {
              'registered':localStorage.userName.toLowerCase().trim()
            },
            {
              'email':localStorage.userName.toLowerCase().trim(),
            },
            function(){
              //successCallback
            },
            function(){
              //errorrCallback
            },
            true
          );

    }
    else {
        if (typeof loginTabClicked === "function")
            loginTabClicked();
        accountNavigation.text = "Account";
    }
   
}

function refreshCartCountLabel() {    
   
    var cartItemCountLabel = document.getElementById("cart-item-count");

    if (!cartItemCountLabel)
        return;

    var itemCount = 0;

    var cartContent = {};
    cartContent.products = [];    

    if (localStorage.cartContent != null) {
        cartContent = JSON.parse(localStorage.cartContent);
    }

    for (var cartProductIndex in cartContent.products) { 
        itemCount = itemCount + cartContent.products[cartProductIndex].quantity;
    }   

    cartItemCountLabel.innerText = itemCount;
}

function showProducts(parentElement,jobtitles) {

    fetch("./data/products.json")
        .then(function (response) {                    
            return response.json();
        })
        .then(function (data) {
            
            var itemsPerRow = 4;
            var itemCount = 0;

            var rowToAdd = null;

            for (var productIndex in data) {
                                
                var product = data[productIndex];

                if (jobtitles && jobtitles.length > 0)
                {
                    if (!jobtitles.includes(product.category))
                        continue;
                }

                itemCount = itemCount + 1;

                if (itemCount % itemsPerRow == 1) {
                    
                    if (rowToAdd != null) {
                        productlist.appendChild(rowToAdd);
                    }

                    rowToAdd = document.createElement("div");
                    rowToAdd.className = "row";
                }

                const productToAdd = document.createElement("div");
                const productLine1 = document.createElement("a");
                const productLine1Image = document.createElement("img");
                const productLine2 = document.createElement("h4");
                const productLine3 = document.createElement("h5");
                const productLine4 = document.createElement("p");

                productToAdd.className = "col-4";

                productLine1.href = "product_details.html?productId=" + product.productId;
                productLine1Image.src = product.imageUrl;
                productLine1.appendChild(productLine1Image);

                productLine2.innerText = product.title;
                productLine3.innerText = product.category;
                productLine4.innerText = product.price + " €";

                productToAdd.appendChild(productLine1);
                productToAdd.appendChild(productLine2);
                productToAdd.appendChild(productLine3);
                productToAdd.appendChild(productLine4);
                rowToAdd.appendChild(productToAdd);

            }

            if (rowToAdd != null) {
                parentElement.appendChild(rowToAdd);
            }


        })

}

function generate_uuidv4() {
    var dt = new Date().getTime();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
    function( c ) {
       var rnd = Math.random() * 16;//random number in range 0 to 16
       rnd = (dt + rnd)%16 | 0;
       dt = Math.floor(dt/16);
       return (c === 'x' ? rnd : (rnd & 0x3 | 0x8)).toString(16);
    });
 }
