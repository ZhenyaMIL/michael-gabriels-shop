/**
 * Include your custom JavaScript here.
 *
 * We also offer some hooks so you can plug your own logic. For instance, if you want to be notified when the variant
 * changes on product page, you can attach a listener to the document:
 *
 * document.addEventListener('variant:changed', function(event) {
 *   var variant = event.detail.variant; // Gives you access to the whole variant details
 * });
 *
 * You can also add a listener whenever a product is added to the cart:
 *
 * document.addEventListener('product:added', function(event) {
 *   var variant = event.detail.variant; // Get the variant that was added
 *   var quantity = event.detail.quantity; // Get the quantity that was added
 * });
 *
 * If you just want to force refresh the mini-cart without adding a specific product, you can trigger the event
 * "cart:refresh" in a similar way (in that case, passing the quantity is not necessary):
 *
 * document.documentElement.dispatchEvent(new CustomEvent('cart:refresh', {
 *   bubbles: true
 * }));
 */

(function () {
    var variant = JSON.parse(document.getElementById('current-variant-obj').dataset.variant);
    var btnInquire = document.getElementById('btn-inquire');
    var productId = document.getElementById('product-id').innerText;
    var productTitle = document.querySelector('.ProductMeta__Title').innerText;
    var userName = document.getElementById('user-name');
    var userEmail = document.getElementById('user-email');
    var url = 'https://calendly.com/michael-gabriels-shop/virtual-appointment';

    document.addEventListener('variant:changed', function (event) {
        variant = event.detail.variant;
        productId = variant.id;
        productTitle = variant.name;
    });


    function createCalendyLink(id, name) {
        var shape = document.querySelector('.product-shapes--link.active') ? document.querySelector('.product-shapes--link.active').getAttribute('data-tooltip') : '';
        var color = variant.options[0] //color option here
        var size = variant.options[1] //size option here
        var stoneSize = document.querySelector('[name="properties[Diamond Carat]"]').value;
        console.log({color, size, stoneSize})
        name = name.replace(/\s/g, '%20');
        var queryStr = 'a1=' + name + '&a3=' + 'Shape%20' + shape + '%2C%0A' +
            'Finger%20Size%20' + size + '%2C%0A' + 'Color%20' + color + '%2C%0A' +
            'Stone%20Size%20' + stoneSize +'%2C%0A' + 'Product%20ID%20' + id;
        if (userName) {
            var customer = userName.innerText.replace(/\s/g, '%20');
            var email = userEmail.innerText;
            url = url + '?name=' + customer + '&email=' + email + '&' + queryStr;
        } else {
            url = url + '?' + queryStr;
        }
    }

    function createTypeFormHiddenFields(id, name) {
        var shape = document.querySelector('.product-shapes--link.active') ? document.querySelector('.product-shapes--link.active').getAttribute('data-tooltip') : '';
        var color = variant.options[0] //color option here
        var size = variant.options[1] //size option here
        var stoneSize = document.querySelector('[name="properties[Diamond Carat]"]').value;
        var productData = 'product=' + name + ',' +
            'shape=' + shape + ',' +
            'size=' + size + ',' +
            'color=' + color + ',' +
            'stone=' + stoneSize;

        var form = document.getElementById('product-type-form')
        form.dataset.tfHidden = productData;
    }

    if (btnInquire) {
        btnInquire.addEventListener('click', function (event) {
            createTypeFormHiddenFields(productId, productTitle);
            var script = document.createElement('script');
            script.src = "//embed.typeform.com/next/embed.js";
            document.body.appendChild(script);

            event.preventDefault();
            createCalendyLink(productId, productTitle);
            setTimeout(function () {
                Calendly.showPopupWidget(url);
            }, 500);
        });
    }

    var selectButtons = document.querySelectorAll('.change-select');

    if (selectButtons) {
        selectButtons.forEach(function (btn) {
            btn.addEventListener('click', function () {
                console.log(this.dataset.value);
                document.getElementById('size-select').value = this.dataset.value;
            });
        });
    }

    var shapesBlock = document.querySelector('.product-shapes');

    if (shapesBlock) {
        var shapes = new Promise(function(resolve, reject){
            var links = document.querySelectorAll('.product-shapes--link');
            var path = window.location.pathname;
            links.forEach(function (link) {
                if (link.getAttribute('href') == path) {
                    link.classList.add('active');
                }
            })
            resolve();
        });
        shapes.then(function(){
            var gemShape = document.querySelector('.product-shapes--link.active').getAttribute('data-tooltip');
            var shapeInput = document.getElementById('shape-input');
            shapeInput.value = gemShape;
        })
    }
})();

