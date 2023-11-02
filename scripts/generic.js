var idtypeList = [];

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
        
        updateIdentity(localStorage.userName.toLowerCase().trim());

    }
    else {
        if (typeof loginTabClicked === "function")
            loginTabClicked();
        accountNavigation.text = "Account";
        updateIdentity();
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

                productToAdd.addEventListener("click", function() {
                    atrack.trackEvent({"event": "button-click", "info" : {"name" : "btnProfile" + + product.productId, "targeturl" : "product_details.html?productId=" + product.productId , "type" : "image" , "profile" : + product.productId}})
                });
                
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

async function updateIdentity(email) {

    if (idtypeList.length == 0)
        await refreshIdList();

    var returnObject = await sendIdentityUpdate(email);

    if (returnObject && returnObject.Success) {

        setCookie("__StitchdId__",returnObject.HardId);

    }


}

async function sendIdentityUpdate(email) {

    var hardid = getCookieByName("__StitchdId__");

    var updateBody = {};
    updateBody.Operation = "Update";
    if (hardid)
        updateBody.HardId = hardid;
    if (email)
        updateBody.Email = email;

    updateBody.IdList = [];

    for (let index = 0; index < idtypeList.length; index++) {
        const idtype = idtypeList[index];

        var cookieValue = getCookieByName(idtype.id_type_cookie_name);
        
        if (cookieValue) {
            updateBody.IdList.push({
                IdType: idtype.id_type_id,
                Value: cookieValue
            });
        }
        
    }

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify(updateBody);

    var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };

    idtypeList = [];

   var response = await fetch("https://id_resolution_worker.sven-peeters.workers.dev/", requestOptions)
   return await response.json();

}

async function refreshIdList() {

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
    "Operation": "getidlist"
    });

    var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };

    idtypeList = [];

   var response = await fetch("https://id_resolution_worker.sven-peeters.workers.dev/", requestOptions)
   var responseJSON =await response.json();

    if (responseJSON && responseJSON.QueryResult && responseJSON.QueryResult.length > 0)
    {
        responseJSON.QueryResult.forEach(typeId => {
            idtypeList.push(typeId);
        });
    }
}

function getCookieByName(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function setCookie(name,value) {
    document.cookie = name + "=" + value; 
}
