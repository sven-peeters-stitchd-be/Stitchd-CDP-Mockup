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
              'user_id':localStorage.userName.toLowerCase().trim(),
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