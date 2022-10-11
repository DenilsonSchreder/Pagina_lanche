
let cart = [];
let modalQt = 1;
let modalKey = 0

const c = (el)=>document.querySelector(el);
const cs = (el)=>document.querySelectorAll(el);

// Listagem das massass
massasJson.map((item, index)=>{
    //clonando a div massas-item
    let massasItem = c('.models .massas-item').cloneNode(true);

    massasItem.setAttribute('data-key', index);

    massasItem.querySelector('.massas-item--img img').src = item.img;
    massasItem.querySelector('.massas-item--name').innerHTML = item.name;
    massasItem.querySelector('.massas-item--desc').innerHTML = item.description;
    massasItem.querySelector('.massas-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    
    massasItem.querySelector('a').addEventListener('click', (e)=>{
        e.preventDefault();  // Faz com que a página não atualize ( ação padrão de click em html)
        let key = e.target.closest('.massas-item').getAttribute('data-key');
        modalQt = 1;
        modalKey = key;

        c('.massasBig img').src = massasJson[key].img
        c('.massasInfo h1').innerHTML = massasJson[key].name;
        c('.massasInfo--desc').innerHTML = massasJson[key].description;
        c('.massasInfo--actualPrice').innerHTML = `R$ ${massasJson[key].price.toFixed(2)}`;
        c('.massasInfo--size.selected').classList.remove('selected');
        cs('.massasInfo--size').forEach((size, sizeIndex)=>{
            if(sizeIndex == 2){
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = massasJson[key].sizes[sizeIndex];
        });

        c('.massasInfo--qt').innerHTML = modalQt;


        c('.massasWindowArea').style.opacity = 0;
        c('.massasWindowArea').style.display = 'flex';
        setTimeout(()=>{ //cria um timer que muda o valor gradativamente, nesse caso o da opacidade
            c('.massasWindowArea').style.opacity = 1;
        }, 200); //tempo de transição do 0 para o 1;
    });

    // preencher as informações em massasitem
    c('.massas-area').append(massasItem);
});
// EVENTOS DO MODAL
function closeModal(){
    c('.massasWindowArea').style.opacity = 0;
    setTimeout(()=>{
        c('.massasWindowArea').style.display = 'none';
    }, 500)
}
cs('.massasInfo--cancelButton, .massasInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click', closeModal);
})
c('.massasInfo--qtmenos').addEventListener('click', ()=>{
    if(modalQt > 1){
        modalQt--;
    c('.massasInfo--qt').innerHTML = modalQt;
    }
    
});
c('.massasInfo--qtmais').addEventListener('click', ()=>{
    modalQt++;
    c('.massasInfo--qt').innerHTML = modalQt;
});

cs('.massasInfo--size').forEach((size, sizeIndex)=>{
   size.addEventListener('click', (e)=>{
    c('.massasInfo--size.selected').classList.remove('selected');
    size.classList.add('selected');
   });
});

c('.massasInfo--addButton').addEventListener('click', ()=>{
    let size =parseInt(c('.massasInfo--size.selected').getAttribute('data-key'));

    let identifier = massasJson[modalKey].id+'@'+size;
    
    let key = cart.findIndex((item)=>item.identifier == identifier);

    if(key > -1){
        cart[key].qt += modalQt;
    }else{
        cart.push({
        identifier,
        id: massasJson[modalKey].id, 
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
            let massasItem = massasJson.find((item)=>item.id == cart[i].id);
            subtotal += massasItem.price * cart[i].qt;


            let cartItem = c('.models .cart--item').cloneNode(true);

            let massasSizeName;
            switch(cart[i].size){
                case 0:
                    massasSizeName = 'P';
                    break;
                case 1:
                    massasSizeName = 'M';
                    break;
                case 2:
                    massasSizeName = 'G';
                    break;
            }


            let massasName = `${massasItem.name} (${massasSizeName})`;

            cartItem.querySelector('img').src = massasItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = massasName;
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