
let cart = [];
let modalQt = 1;
let modalKey = 0

const c = (el)=>document.querySelector(el);
const cs = (el)=>document.querySelectorAll(el);

// Listagem das bebidass
bebidasJson.map((item, index)=>{
    //clonando a div bebidas-item
    let bebidasItem = c('.models .bebidas-item').cloneNode(true);

    bebidasItem.setAttribute('data-key', index);

    bebidasItem.querySelector('.bebidas-item--img img').src = item.img;
    bebidasItem.querySelector('.bebidas-item--name').innerHTML = item.name;
    bebidasItem.querySelector('.bebidas-item--desc').innerHTML = item.description;
    bebidasItem.querySelector('.bebidas-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    
    bebidasItem.querySelector('a').addEventListener('click', (e)=>{
        e.preventDefault();  // Faz com que a página não atualize ( ação padrão de click em html)
        let key = e.target.closest('.bebidas-item').getAttribute('data-key');
        modalQt = 1;
        modalKey = key;

        c('.bebidasBig img').src = bebidasJson[key].img
        c('.bebidasInfo h1').innerHTML = bebidasJson[key].name;
        c('.bebidasInfo--desc').innerHTML = bebidasJson[key].description;
        c('.bebidasInfo--actualPrice').innerHTML = `R$ ${bebidasJson[key].price.toFixed(2)}`;
        c('.bebidasInfo--size.selected').classList.remove('selected');
        cs('.bebidasInfo--size').forEach((size, sizeIndex)=>{
            if(sizeIndex == 2){
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = bebidasJson[key].sizes[sizeIndex];
        });

        c('.bebidasInfo--qt').innerHTML = modalQt;


        c('.bebidasWindowArea').style.opacity = 0;
        c('.bebidasWindowArea').style.display = 'flex';
        setTimeout(()=>{ //cria um timer que muda o valor gradativamente, nesse caso o da opacidade
            c('.bebidasWindowArea').style.opacity = 1;
        }, 200); //tempo de transição do 0 para o 1;
    });

    // preencher as informações em bebidasitem
    c('.bebidas-area').append(bebidasItem);
});
// EVENTOS DO MODAL
function closeModal(){
    c('.bebidasWindowArea').style.opacity = 0;
    setTimeout(()=>{
        c('.bebidasWindowArea').style.display = 'none';
    }, 500)
}
cs('.bebidasInfo--cancelButton, .bebidasInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click', closeModal);
})
c('.bebidasInfo--qtmenos').addEventListener('click', ()=>{
    if(modalQt > 1){
        modalQt--;
    c('.bebidasInfo--qt').innerHTML = modalQt;
    }
    
});
c('.bebidasInfo--qtmais').addEventListener('click', ()=>{
    modalQt++;
    c('.bebidasInfo--qt').innerHTML = modalQt;
});

cs('.bebidasInfo--size').forEach((size, sizeIndex)=>{
   size.addEventListener('click', (e)=>{
    c('.bebidasInfo--size.selected').classList.remove('selected');
    size.classList.add('selected');
   });
});

c('.bebidasInfo--addButton').addEventListener('click', ()=>{
    let size =parseInt(c('.bebidasInfo--size.selected').getAttribute('data-key'));

    let identifier = bebidasJson[modalKey].id+'@'+size;
    
    let key = cart.findIndex((item)=>item.identifier == identifier);

    if(key > -1){
        cart[key].qt += modalQt;
    }else{
        cart.push({
        identifier,
        id: bebidasJson[modalKey].id, 
        size,
        qt: modalQt,
    });
    }
    updateCart();
    closeModal();
});

c('.menu-openner').addEventListener('click', ()=>{
    if(cart.length > 0){
        c('aside').style.left = '0';
    }
});
c('.menu-closer').addEventListener('click', ()=>{
    c('aside').style.left = '100vw';
});


function updateCart(){
    c('.menu-openner span').innerHTML = cart.length;
    
    if(cart.length>0){
        c('aside').classList.add('show');
        c('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for(let i in cart){
            let bebidasItem = bebidasJson.find((item)=>item.id == cart[i].id);
            subtotal += bebidasItem.price * cart[i].qt;


            let cartItem = c('.models .cart--item').cloneNode(true);

            let bebidasSizeName;
            switch(cart[i].size){
                case 0:
                    bebidasSizeName = 'P';
                    break;
                case 1:
                    bebidasSizeName = 'M';
                    break;
                case 2:
                    bebidasSizeName = 'G';
                    break;
            }


            let bebidasName = `${bebidasItem.name} (${bebidasSizeName})`;

            cartItem.querySelector('img').src = bebidasItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = bebidasName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click',()=>{
                if(cart[i].qt > 1){
                    cart[i].qt--;
                }else{
                    cart.splice(i, 1);
                }

                updateCart();
            });

            cartItem.querySelector('.cart--item-qtmais').addEventListener('click',()=>{
                cart[i].qt++;
                updateCart();
            });
            
           


            c('.cart').append(cartItem);

        }

        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        c('.subtotal span:last-child').innerHTML = `${subtotal.toFixed(2)}`;
        c('.desconto span:last-child').innerHTML = `${desconto.toFixed(2)}`;
        c('.total span:last-child').innerHTML = `${total.toFixed(2)}`;



    }else{
        c('aside').classList.remove('show');
        c('aside').style.left = '100vw';
    }
    
}

function troco(){
    document.getElementById("troco").style.display = 'flex';
}

function finalizar(){
    window.alert('O Pedido Foi Confirmado!');
    c('aside').classList.remove('show');
}