

var script = document.createElement('script');
script.onload = function () {
    console.log('loaded')
};
script.src = 'https://ajax.googleapis.com/ajax/libs/jqueryui/1.9.2/jquery-ui.min.js';

document.head.appendChild(script); 





  var baseEl = document.querySelector('.baseEl');
  var base2El = document.querySelector('.base2El');
  var base3El = document.querySelector('.base3El');
  var base4El = document.querySelector('.base4El');
  var timeline = document.querySelector('.timeline')
  var slideoutContainer = document.querySelector('.delivery-slideout')
  var moreinfoPopup = document.querySelector('.moreinfo-popup')
  var moreinfoProdCardContainer = document.querySelector('#moreinfo-products')
  var moreinfoOverlay = document.querySelector('.moreinfo-overlay')
  
  let delivery_date;
  var whitelistArr
  var blacklistArr
  
  console.log('execute')
  
  const stepBar = number => {
    if (timeline) {
      var timelineSnippet =
      `<div class="stepline">
        <div style="z-index: 3;" class="step-num highlight-step first" data-number="1"><div class="arrow-left"></div><span>1</span><div class="arrow-right" ></div></div>
        <div style="z-index: 2;" class="step-num middle" data-number="2"><div class="arrow-left"></div><span>2</span><div class="arrow-right"></div></div>
        <div style="z-index: 1;" class="step-num last"  data-number="3"><div class="arrow-left"></div><span>3</span><div class="arrow-right"></div></div>
      </div>`
  
      timeline.innerHTML = timelineSnippet
    }
  }
  
  
  const multiStepCart = data => {
    if (baseEl) {
      console.log(data)
  
      var containerStep1 = 
        `<div class="step1-multi">
          <h2 class="title-multi">Add optional extras to your order or skip</h2>
          
        </div>
        <div class="inner-products" style="display:flex;flex-wrap:wrap;">
          ${data.data.map(item => {
           
            var variantId = item.productId.variants.edges[0].node.id.split('/')[4]
            
            return `
                <div class="item" data-id="${variantId}" data-desc="${item.productId.desc}" style="width:50%;display: flex; align-items: end; padding: 11px 10px;">
                  <div class='inner-item-left'>
                    <a href="/products/${item.productId.handle}"><img src=${item.productId.images.edges[0].node.originalSrc} style="width: 75px;" /></a>
                    <div class="inner-item-content" style="display: flex; justify-content: space-between; flex-direction: column;align-items: start; width: 100%;">
                        <p style="padding: 10px;margin: 0;font-weight:400;">${item.productId.title}</p>
                        <div style="width:100%;display:flex;justify-content:space-between;padding: 0px 10px 0 10px;margin: 0;"><div style="font-size:13px;font-weight:400;color:#707070;">£ ${item.productId.variants.edges[0].node.price}</div>
                        <div onclick="showProdPopup(${variantId})" style="cursor:pointer;font-weight:400;font-size:13px;color:#707070;text-decoration:underline;">(more info)</div></div>
                    </div>
                  </div>
                  <div class='inner-item-right' style="padding-bottom:10px;">
                    <button onclick="smallChooseBtnClick(event, this)" data-handle="${item.productId.handle}" data-id="${variantId}" class='choose-upsell upsell-button'>Choose</button>
                  </div>
  
                </div>
                `
          }).join('')}
        </div>
        <div class="button-row" style="margin-top:30px;display:flex;">
          <button onclick="two_click_prev()" class="row-btn-prev row-btn">Back</button>
          <button id="next-two" onclick="two_click_next()" style="margin: 0 10px;" class="row-btn-next row-btn">Next</button>
          <button id="addtocart-two" onclick="two_click_addCart()" style="margin: 0 0 0 auto;" class="row-btn-add row-btn">Add to cart</button>
        </div>` 
          
        base2El.innerHTML = containerStep1
  
        document.getElementById('addtocart-two').disabled = true
    }
  }
  
  const secondPartCart = data => {
    if (baseEl) {
  
      data.data.forEach(postcodeGroup => {
        if (postcodeGroup.status == 'whitelisted') {
          whitelistArr = postcodeGroup.postcode;
        }
        if (postcodeGroup.status == 'blacklisted') {
          blacklistArr = postcodeGroup.postcode;
        }
      })
    
      var containerStep2 = 
      `<div class="step2-multi">
        <h2 class="title-multi">STEP 1 - choose delivery date</h2>
        <div class="inner-step-container" style="margin-bottom:20px;">
          <div>
            <button onclick="click_delivery_input()" class="delivery-button"><span class="button-title">Select Delivery Date</span><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 122.88 122.88" style="enable-background:new 0 0 122.88 122.88" xml:space="preserve"><g><path d="M81.61,4.73c0-2.61,2.58-4.73,5.77-4.73c3.19,0,5.77,2.12,5.77,4.73v20.72c0,2.61-2.58,4.73-5.77,4.73 c-3.19,0-5.77-2.12-5.77-4.73V4.73L81.61,4.73z M66.11,103.81c-0.34,0-0.61-1.43-0.61-3.2c0-1.77,0.27-3.2,0.61-3.2H81.9 c0.34,0,0.61,1.43,0.61,3.2c0,1.77-0.27,3.2-0.61,3.2H66.11L66.11,103.81z M15.85,67.09c-0.34,0-0.61-1.43-0.61-3.2 c0-1.77,0.27-3.2,0.61-3.2h15.79c0.34,0,0.61,1.43,0.61,3.2c0,1.77-0.27,3.2-0.61,3.2H15.85L15.85,67.09z M40.98,67.09 c-0.34,0-0.61-1.43-0.61-3.2c0-1.77,0.27-3.2,0.61-3.2h15.79c0.34,0,0.61,1.43,0.61,3.2c0,1.77-0.27,3.2-0.61,3.2H40.98 L40.98,67.09z M66.11,67.09c-0.34,0-0.61-1.43-0.61-3.2c0-1.77,0.27-3.2,0.61-3.2H81.9c0.34,0,0.61,1.43,0.61,3.2 c0,1.77-0.27,3.2-0.61,3.2H66.11L66.11,67.09z M91.25,67.09c-0.34,0-0.61-1.43-0.61-3.2c0-1.77,0.27-3.2,0.61-3.2h15.79 c0.34,0,0.61,1.43,0.61,3.2c0,1.77-0.27,3.2-0.61,3.2H91.25L91.25,67.09z M15.85,85.45c-0.34,0-0.61-1.43-0.61-3.2 c0-1.77,0.27-3.2,0.61-3.2h15.79c0.34,0,0.61,1.43,0.61,3.2c0,1.77-0.27,3.2-0.61,3.2H15.85L15.85,85.45z M40.98,85.45 c-0.34,0-0.61-1.43-0.61-3.2c0-1.77,0.27-3.2,0.61-3.2h15.79c0.34,0,0.61,1.43,0.61,3.2c0,1.77-0.27,3.2-0.61,3.2H40.98 L40.98,85.45z M66.11,85.45c-0.34,0-0.61-1.43-0.61-3.2c0-1.77,0.27-3.2,0.61-3.2H81.9c0.34,0,0.61,1.43,0.61,3.2 c0,1.77-0.27,3.2-0.61,3.2H66.11L66.11,85.45z M91.25,85.45c-0.34,0-0.61-1.43-0.61-3.2c0-1.77,0.27-3.2,0.61-3.2h15.79 c0.34,0,0.61,1.43,0.61,3.2c0,1.77-0.27,3.2-0.61,3.2H91.25L91.25,85.45z M15.85,103.81c-0.34,0-0.61-1.43-0.61-3.2 c0-1.77,0.27-3.2,0.61-3.2h15.79c0.34,0,0.61,1.43,0.61,3.2c0,1.77-0.27,3.2-0.61,3.2H15.85L15.85,103.81z M40.98,103.81 c-0.34,0-0.61-1.43-0.61-3.2c0-1.77,0.27-3.2,0.61-3.2h15.79c0.34,0,0.61,1.43,0.61,3.2c0,1.77-0.27,3.2-0.61,3.2H40.98 L40.98,103.81z M29.61,4.73c0-2.61,2.58-4.73,5.77-4.73s5.77,2.12,5.77,4.73v20.72c0,2.61-2.58,4.73-5.77,4.73 s-5.77-2.12-5.77-4.73V4.73L29.61,4.73z M6.4,45.32h110.07V21.47c0-0.8-0.33-1.53-0.86-2.07c-0.53-0.53-1.26-0.86-2.07-0.86H103 c-1.77,0-3.2-1.43-3.2-3.2c0-1.77,1.43-3.2,3.2-3.2h10.55c2.57,0,4.9,1.05,6.59,2.74c1.69,1.69,2.74,4.02,2.74,6.59v27.06v65.03 c0,2.57-1.05,4.9-2.74,6.59c-1.69,1.69-4.02,2.74-6.59,2.74H9.33c-2.57,0-4.9-1.05-6.59-2.74C1.05,118.45,0,116.12,0,113.55V48.52 V21.47c0-2.57,1.05-4.9,2.74-6.59c1.69-1.69,4.02-2.74,6.59-2.74H20.6c1.77,0,3.2,1.43,3.2,3.2c0,1.77-1.43,3.2-3.2,3.2H9.33 c-0.8,0-1.53,0.33-2.07,0.86c-0.53,0.53-0.86,1.26-0.86,2.07V45.32L6.4,45.32z M116.48,51.73H6.4v61.82c0,0.8,0.33,1.53,0.86,2.07 c0.53,0.53,1.26,0.86,2.07,0.86h104.22c0.8,0,1.53-0.33,2.07-0.86c0.53-0.53,0.86-1.26,0.86-2.07V51.73L116.48,51.73z M50.43,18.54 c-1.77,0-3.2-1.43-3.2-3.2c0-1.77,1.43-3.2,3.2-3.2h21.49c1.77,0,3.2,1.43,3.2,3.2c0,1.77-1.43,3.2-3.2,3.2H50.43L50.43,18.54z"/></g></svg></button>
          </div>
        </div>
        <div class="button-row">
          <button id="next-one" onclick="one_click_next()" class="row-btn-next row-btn">Next</button>
        </div>
      </div>`
  
      baseEl.innerHTML = containerStep2
      
      if (localStorage.getItem('postcode') === null ) {
        document.getElementById('next-one').disabled = true;
      } else {
        document.getElementById('next-one').disabled = false;
      }
    }
  }
  
  const thirdPartCart = (data) => {
  console.log(data)
  
    var containerStep3 = 
      `<div class="step3-multi">
        <h2 class="title-multi">STEP 3 - add a card (optional)</h2>
        <div class="third-firstrow">
          <div style="margin-bottom:5px;"></div>
          <div style="margin-bottom:5px;">
            <input onclick="toggle_card(this)" type="checkbox" id="nocardreq" name="nocardreq" value="nocardreq">
            <label for="nocardreq">No card required</label>
          </div>
        </div>
        <div id="cardToggle" class="fourth-row">
        ${data.data.map(item => {
           
          var variantId = item.productId.variants.edges[0].node.id.split('/')[4]
          
          return `
              <div class="item" data-id="${variantId}" data-desc="${item.productId.desc}" style="width:50%;display: flex; align-items: end; padding: 11px 10px;">
                <div class='inner-item-left'>
                  <a href="/products/${item.productId.handle}"><img src=${item.productId.images.edges[0].node.originalSrc} style="width: 75px;" /></a>
                  <div class="inner-item-content" style="display: flex; justify-content: space-between; flex-direction: column;align-items: start; width: 100%;">
                      <p style="padding: 10px;margin: 0;font-weight:400;">${item.productId.title}</p>
                      <div style="width:100%;display:flex;justify-content:space-between;padding: 0px 10px 0 10px;margin: 0;"><div style="font-size:13px;font-weight:400;color:#707070;">£ ${item.productId.variants.edges[0].node.price}</div>
                      <div onclick="showProdPopup(${variantId})" style="cursor:pointer;font-weight:400;font-size:13px;color:#707070;text-decoration:underline;">(more info)</div></div>
                  </div>
                </div>
                <div class='inner-item-right' style="padding-bottom:10px;">
                  <button onclick="smallChooseBtnClick(event, this)" data-handle="${item.productId.handle}" data-id="${variantId}" class='choose-upsell giftcard-button'>Add</button>
                </div>
              </div>
              `
        }).join('')}
        </div>
        <div class="third-firstrow giftrow">
          <div id='titleToggle'>Enter a gift note</div>
          <div style="margin: 0 0 0 auto;">
            <input onclick="toggle_gift_message(this)" type="checkbox" id="nonotereq" name="nonotereq" value="nonotereq">
            <label for="nonotereq">No note required</label>
          </div>
        </div>
      </div>
      <div id="noteToggle" class="fourth-row">
        <textarea placeholder="Message" class="giftnote"></textarea>
      </div>
      <div class="delivery-last-row">
        <div>Delivery Instructions</div>
        <div id="deliverySelectContainer" style="margin-top:5px;">
  
          </div>
      </div>
      <div class="button-row" style="margin-top:30px;">
        <button onclick="three_click_prev()" class="row-btn-prev row-btn">Back</button>
        <button id="next-three" onclick="three_click_next()" class="row-btn-next row-btn">Next</button>
      </div>`
      base3El.innerHTML = containerStep3
  }
  
  function toggle_gift_message(checkbox) {
    console.log(checkbox.checked)
    if (checkbox.checked) {
      document.getElementById('noteToggle').style.display = 'none'
      document.getElementById('titleToggle').style.display = 'none'
    } else {
      document.getElementById('noteToggle').style.display = 'flex'
      document.getElementById('titleToggle').style.display = 'block'
    }
  }
  
  function toggle_card(checkbox) {
    console.log(checkbox.checked)
    if (checkbox.checked) {
      document.getElementById('cardToggle').style.display = 'none'
    } else {
      document.getElementById('cardToggle').style.display = 'flex'
    }
  }
  
  var deliveryOptionsSelect = (data) => {
    console.log(data)
    var deliveryOptionsContainer = 
     `<select id="deliverySelect">
        ${data.data.map(item => {
          if (item.deliveryOptionsId.field) {
            return `<option value="${item.deliveryOptionsId.index}">${item.deliveryOptionsId.field}</option>`
          }
            
        }).join('')}
      </select>`
  
      document.getElementById('deliverySelectContainer').innerHTML = deliveryOptionsContainer
  }
  
  
  
  const fourthPartCart = (data, itemCount) => {
      console.log(data)
      
      var rowBar = 
        `<div id="edit-info-container">
          
          ${itemCount > 1 ? 
            `<div>Attention: Your cart contains items with multiple delivery dates. The delivery date is set for <strong>Wednesday, August 31, 2021</strong>, which is the furthest date. Click edit information to select a different date or remove some items in your cart.</div>` 
            :
            `<div>Your selected delivery date is: <strong>${data}</strong></div>`
            
          }
          
          <div onclick="editClick()" class="edit-info">Edit Information</div>
        </div>`
  
      base4El.innerHTML = rowBar
  }
  
  const sideBar = data => {
    if (baseEl) {
      var sidebarInsides = 
      `<div onclick="closeOverlay()" class="sidebar-overlay"></div>
      <div id="sidebarContainer">
        <div class="sidebar-inside">
          <h4 style="margin-bottom:0;">Choose a delivery date</h4>
          <p class="first-para">Please pop in the delivery postcode below to see if we can deliver to your area, and if so on what days!</p>
          <hr>
          <form id="form">
            <p style="margin-bottom: 5px;margin-top:0;font-weight:bold;font-size:12px;">Delivery Postcode - Check what's available in your area</p>
            <div style="font-size:0">
              <input name="postcode" placeholder="Postcode" id="input-validate-date" type="text" />
              <input id="input-validate-date-submit" type="submit" value="CHECK" autocomplete="false" />
            </div>
            <p id="postcode-msg"></p>
          </form>
          <hr>
          <div id="lower-rung-sidebar">
            <p class="second-para">Choose a delivery day</p>
            <input autocomplete="off" class="date-present" id="twodate" type="text" placeholder="Delivery date"  />
            <p style="font-weight:bold;">Delivery date selected, please confirm & close. You will be able to choose a time slot at the checkout.</p>
            <button onclick="click_confirmBtn()" id="confirmBtn">CONFIRM & CLOSE</button>
          </div>
        </div>
      </div>`
      
    }
    slideoutContainer.innerHTML = sidebarInsides;
  
    // Prepopulate postcode form with localstorage item postcode
    if (localStorage.getItem('postcode') !== null) {
      document.getElementById('input-validate-date').value = localStorage.getItem('postcode')
    }
  
    var form = document.getElementById('form')
  
    form.addEventListener("submit", function(e) {
      e.preventDefault();
      var formData = new FormData(form);
      var postcodeValue = formData.get('postcode')
      checkPostcode(postcodeValue);
      
    })
  }
  
  var svgX = `<svg style="margin-left:5px;" width='24' height='24' fill='none' xmlns='http://www.w3.org/2000/svg'><path fill-rule='evenodd' clip-rule='evenodd' d='M23.414 2L2 23.414.586 22 22 .586 23.414 2z' fill='#214338'/><path fill-rule='evenodd' clip-rule='evenodd' d='M2 .586L23.414 22 22 23.414.586 2 2 .586z' fill='#214338'/></svg>`
  
  var timelineSteps; 
  
  function removeCurrentHighlightTimeline() {
    timelineSteps = Array.from(document.querySelectorAll('.step-num'));
  
    if (timelineSteps) {  
      timelineSteps.forEach(step => {
        step.classList.remove('highlight-step')
      })
    }
  }
  
  function addCurrentHighlightTimeline(num) {
    timelineSteps = Array.from(document.querySelectorAll('.step-num'));
  
    if (timelineSteps) {
      timelineSteps[num].classList.add('highlight-step')
    }
  }
  
  function one_click_next() {
    if (localStorage.getItem('postcode')) {
      console.log('clicked')
      baseEl.style.display = "none";
      base2El.style.display = "block"
      removeCurrentHighlightTimeline();
      addCurrentHighlightTimeline(1);
    }
  }
  
  function two_click_prev() {
    baseEl.style.display = 'block';
    base2El.style.display = 'none';
    removeCurrentHighlightTimeline();
    addCurrentHighlightTimeline(0);
  
    // document.querySelector('.timeline').scrollIntoView({ behavior: 'smooth', block: 'start'})
    window.scrollTo({top: jQuery('.timeline').offset().top, behavior: 'smooth'});
  }
  
  function two_click_addCart() {
    console.log('add products to cart')
    let arrOfProds = []
    let objsOfProds = Array.from(document.querySelectorAll('.chosen'))
  
    objsOfProds.forEach(item => {
      if (item) {
        let product = {quantity: 1, id: parseInt(item.dataset.id)}
        arrOfProds.push(product);
      }
    })
  
    jQuery.post('/cart/add.js', {
      items: arrOfProds
    }, function() {
      console.log('success, window reload')
      window.location.reload()
    });
  }
  
  function two_click_next() {
    baseEl.style.display = 'none'
    base2El.style.display = 'none'
    base3El.style.display = 'block'
    removeCurrentHighlightTimeline();
    addCurrentHighlightTimeline(2);
  
    document.querySelector('#cart-form').scrollIntoView({ behavior: 'smooth', block: 'start'})
  }
  
  function editClick() {
    baseEl.style.display = 'block'
    base2El.style.display = 'none'
    base3El.style.display = 'none'
    base4El.style.display = 'none'
  
    document.querySelector('.timeline').style.display = 'block';
    document.querySelector('.cart-checkout').style.display = 'none';
    document.querySelector('.cart-total').style.display = 'none';
    document.querySelector('.cart-shipping').style.display = 'none';
  
    removeCurrentHighlightTimeline();
    addCurrentHighlightTimeline(0);
  }
  
  function three_click_next() {
    baseEl.style.display = 'none'
    base2El.style.display = 'none'
    base3El.style.display = 'none'
    base4El.style.display = 'block'
  
    document.querySelector('.timeline').style.display = 'none';
    document.querySelector('.cart-checkout').style.display = 'block';
    document.querySelector('.cart-total').style.display = 'block';
    document.querySelector('.cart-shipping').style.display = 'block';
  
    document.querySelector('#cart-form').scrollIntoView({ behavior: 'smooth', block: 'start'})
  }
  
  function three_click_prev() {
    baseEl.style.display = 'none'
    base2El.style.display = 'block'
    base3El.style.display = 'none'
    removeCurrentHighlightTimeline();
    addCurrentHighlightTimeline(1);
  
    document.querySelector('#cart-form').scrollIntoView({ behavior: 'smooth', block: 'start'})
  }
  
  
  function smallChooseBtnClick(e, el) {
  
    if (el.classList.contains('giftcard-button')) {
      // check add product buttons for giftcard section
      if (el.classList.contains('chosen')) {
        el.classList.remove('chosen')
      } else {
        let arrayOfGiftButtons = Array.from(base3El.querySelectorAll('.giftcard-button'))
        arrayOfGiftButtons.forEach(btn => { btn.classList.remove('chosen') })
        el.classList.add('chosen')
      }
    } else {
      // check add product buttons for upsell section
      if (el.classList.contains('chosen')) {
        el.classList.remove('chosen')
      } else {
        el.classList.add('chosen')
      }
    }
  
  
  
    var arrayOfUpsellBtns = Array.from(base2El.querySelectorAll('.chosen'));
  
    // if btns have class of chosen then disable next button
      arrayOfUpsellBtns.length ? document.getElementById('next-two').disabled = true : document.getElementById('next-two').disabled = false 
      arrayOfUpsellBtns.length ? document.getElementById('addtocart-two').disabled = false : document.getElementById('addtocart-two').disabled = true 
  }
  
  
  function closeModalUpsell() {
    moreinfoPopup.classList.remove('open')
  
    setTimeout(function() {
      var cards = Array.from(document.querySelectorAll('.prodCard'));
      cards.forEach(card => {
        card.classList.remove('show')
      })
    }, 35)
  }
  
  if (moreinfoOverlay) {
    moreinfoOverlay.addEventListener('click', function() {
      closeModalUpsell()
    })
  }
  
  
  function showProdPopup(id) {
    moreinfoPopup.classList.add('open')
  
    var cards = Array.from(document.querySelectorAll('.prodCard'));
    cards.every(card => {
      if (card.id == id) {
        card.classList.add('show')
        return false;
      } else {
        return true
      }
    })
  }
  
  function getProductsInfoForUpsell() {
      // Grab product descriptions for upsell. And create each popupmpodal
      var upsellBtns = Array.from(document.getElementsByClassName('choose-upsell'))
      var handleArray = [];
      upsellBtns.forEach(btn => {
        handleArray.push(btn.dataset.handle)
      })
  
      function forEachPromise(items, fn) {
        return items.reduce(function (promise, item) {
            return promise.then(function () {
                return fn(item);
            });
        }, Promise.resolve());
      }
  
      function logItem(handle) {
        return new Promise((resolve, reject) => {
  
            fetch('/products/' + handle + '.js')
            .then(response => response.json())
            .then(data => { 
  
              var prodCard = document.createElement('div');
              prodCard.id = data.variants[0].id
              prodCard.className = 'prodCard'
  
  
              var leftCard = document.createElement('div');
              leftCard.className = 'leftCard'
              var image = document.createElement('img');
              image.className = 'image-featured-cart';
              image.src = data.featured_image;
  
              leftCard.appendChild(image);
  
              var rightCard = document.createElement('div');
              rightCard.className = 'rightCard'
              var title = document.createElement('h2');
              title.innerHTML = data.title
              var description = document.createElement('div');
              description.className = 'description-cart-upsell'
              description.innerHTML = data.description;
              var price = document.createElement('h3')
              price.innerHTML = '£' + data.price;
              var chooseBtn = document.createElement('button')
              chooseBtn.classList = 'modal-choose-btn'
              chooseBtn.dataset.id = data.variants[0].id
              chooseBtn.innerHTML = 'Choose'
              chooseBtn.addEventListener('click', function (e) {
                var els = Array.from(document.querySelectorAll('.choose-upsell'))
  
                els.every(chooseBtn => {
                  if (chooseBtn.dataset.id == this.dataset.id) {
                    chooseBtn.classList.add('chosen')
                    closeModalUpsell()
                    return false;
                  } else {
                    console.log('nothing')
                    return true
                  }
                })
              })
  
              rightCard.appendChild(title);
              rightCard.appendChild(price)
              rightCard.appendChild(description);
  
              var footer = document.createElement('div')
              footer.classList = 'footer-upsell-modal'
              footer.appendChild(chooseBtn)
  
              var header = document.createElement('div')
              header.classList = 'header-upsell-modal';
              var close = document.createElement('div');
              close.innerHTML = 'Close' + svgX;
              close.className='closeXModal'
              close.addEventListener('click', closeModalUpsell)
              header.appendChild(close)
              
              prodCard.appendChild(header)
              prodCard.appendChild(leftCard);
              prodCard.appendChild(rightCard)
              prodCard.appendChild(footer)
            
              moreinfoProdCardContainer.appendChild(prodCard)
              resolve();
            });
  
        });
      }
      
      forEachPromise(handleArray, logItem).then(() => {
          console.log('done');
      });
  }
  
  function click_delivery_input() {
    slideoutContainer.classList.add('open');
  }
  
  function closeOverlay() {
    slideoutContainer.classList.remove('open')
  }
  
  function checkPostcode(value) {
  
    let postcodeMsg = document.getElementById('postcode-msg')
    let lowerRung = document.getElementById('lower-rung-sidebar')
  
    if (whitelistArr.find(checkpostcodeList)) {
      console.log('matches whitelist')
      postcodeMsg.innerHTML = "valid"
      postcodeMsg.classList.add('white')
      postcodeMsg.classList.remove('black')
      lowerRung.classList.add('show')
  
      // localStorage.setItem("postcode", JSON.stringify(value));
      localStorage.setItem("postcode", value)
  
    } else if (blacklistArr.find(checkpostcodeList)) {
      console.log('matches blacklist')
      postcodeMsg.classList.add('black')
      postcodeMsg.classList.remove('white')
      postcodeMsg.innerHTML = "invalid"
      lowerRung.classList.remove('show')
    } else {
      console.log('no match')
      postcodeMsg.innerHTML = "invalid"
      postcodeMsg.classList.add('black')
      postcodeMsg.classList.remove('white')
      lowerRung.classList.remove('show')
    }
  
    function checkpostcodeList(postcode) {
      return postcode == value;
    }
  }
  
  var confirmDeliverySidebarInput;
  var confirmDeliveryInput;
  
  function click_confirmBtn() {
    slideoutContainer.classList.remove('open')
    confirmDeliverySidebarValue = document.querySelector('#twodate').value;
    confirmDeliveryInput = document.querySelector('.button-title');
  
    if (confirmDeliverySidebarValue) {
      confirmDeliveryInput.innerHTML = confirmDeliverySidebarValue;
      delivery_date = confirmDeliverySidebarValue
      document.getElementById('next-one').disabled = false;
  
     fetch('/cart.js')
      .then(response => response.json())
      .then(data => { 
        fourthPartCart(delivery_date, data.item_count);
      });
    }
  }
  
  function submitCustomCheckoutButton() {
    console.log('clicked')
  
    var cardOptionalCheckbox = document.getElementById('nocardreq');
    var messageOptionalCheckbox = document.getElementById('nonotereq');
    var deliveryInstructionsSelect = document.getElementById('deliverySelect')
    var cardMessage = document.querySelector('.giftnote')
    var deliveryInstructionsValue = deliveryInstructionsSelect.options[deliveryInstructionsSelect.selectedIndex].text
    var itemsArr = []
    var notesArr = []
  
    // check if no card is clicked
    if (!cardOptionalCheckbox.checked) {
      var addedCardId = base3El.querySelector('.chosen')
  
      if (addedCardId) {
        itemsArr.push({quantity:1, id: addedCardId.dataset.id})
      }
    }
  
    // check is no message is clicked
    if (!messageOptionalCheckbox.checked) {
      if (cardMessage.value.length > 1) {
        notesArr.push({"CardMessage": cardMessage.value})
      }
    }
  
    // take selected delivery instruction and add to note obj
    notesArr.push({"DeliveryInstructions": deliveryInstructionsValue})
  
  
    // if card is selected and has message
    if (addedCardId && cardMessage.value.length > 1) {
      // card and message is written
      jQuery.post('/cart/add.js', {
        items: itemsArr,
        attributes: {...notesArr}
      }, function(results) {
        console.log('success, window reload', results)
        console.log('send to checkout')
  
        window.location.href = '/checkout'
  
          // jQuery.get('/cart.js', function(res) {
          //   var data = $.parseJSON( res );
          //   console.log(data)
          // })
  
      });
    }
  
  }
  
  function cloneCartCheckoutButton() {
      // change out checkout button
      var cartButton = document.querySelector('.button-primary[form="cart-form"]');
      var clonedCartButton = cartButton.cloneNode(true)
      clonedCartButton.removeAttribute('form');
      clonedCartButton.className += ' custom-checkout'
      clonedCartButton.addEventListener('click', submitCustomCheckoutButton)
      document.querySelector('.cart-checkout').prepend(clonedCartButton)
  }
  
  if (baseEl) {
    fetch('https://calm-fjord-82942.herokuapp.com/api/postcode?shop=extestdevstore.myshopify.com')
    .then(res => res.json())
    .then(data2 => {
  
    secondPartCart(data2)
    sideBar();    

    // $("#twodate").datepicker({ minDate: -20, maxDate: "+1M +10D" });
    // Grab second step (naming is backward)
    fetch('https://calm-fjord-82942.herokuapp.com/api/products?shop=extestdevstore.myshopify.com')
    .then(res => res.json())
    .then(async data => {
      multiStepCart(data)
      stepBar()


      $("#twodate").datepicker({ minDate: 0, maxDate: "+1M +10D" });
      $("#twodate").datepicker("option", "dateFormat", "DD, d MM, yy")
      
      // grab card products and render them to third step
      fetch('https://calm-fjord-82942.herokuapp.com/api/cardProducts?shop=extestdevstore.myshopify.com')
        .then(res => res.json())
        .then(async data => {
            // Render 3rd UI
            thirdPartCart(data)
            getProductsInfoForUpsell()
  
            fetch('https://calm-fjord-82942.herokuapp.com/api/deliveryInstructions?shop=extestdevstore.myshopify.com')
              .then(res => res.json())
              .then(async data => {
                deliveryOptionsSelect(data)
                cloneCartCheckoutButton()
  
              })
              
        })
    })
  })  
  .catch(err => {console.log(err)})
  }
