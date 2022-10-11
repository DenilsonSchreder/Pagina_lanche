
let cart = [];
let modalQt = 1;
let modalKey = 0

const c = (el)=>document.querySelector(el);
const cs = (el)=>document.querySelectorAll(el);

// Listagem das sanduiches
sanduicheJson.map((item, index)=>{
    //clonando a div sanduiche-item
    let sanduicheItem = c('.models .sanduiche-item').cloneNode(true);

    sanduicheItem.setAttribute('data-key', index);

    sanduicheItem.querySelector('.sanduiche-item--img img').src = item.img;
    sanduicheItem.querySelector('.sanduiche-item--name').innerHTML = item.name;
    sanduicheItem.querySelector('.sanduiche-item--desc').innerHTML = item.description;
    sanduicheItem.querySelector('.sanduiche-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    
    sanduicheItem.querySelector('a').addEventListener('click', (e)=>{
        e.preventDefault();  // Faz com que a página não atualize ( ação padrão de click em html)
        let key = e.target.closest('.sanduiche-item').getAttribute('data-key');
        modalQt = 1;
        modalKey = key;

        c('.sanduicheBig img').src = sanduicheJson[key].img
        c('.sanduicheInfo h1').innerHTML = sanduicheJson[key].name;
        c('.sanduicheInfo--desc').innerHTML = sanduicheJson[key].description;
        c('.sanduicheInfo--actualPrice').innerHTML = `R$ ${sanduicheJson[key].price.toFixed(2)}`;
        c('.sanduicheInfo--size.selected').classList.remove('selected');
        cs('.sanduicheInfo--size').forEach((size, sizeIndex)=>{
            if(sizeIndex == 2){
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = sanduicheJson[key].sizes[sizeIndex];
        });

        c('.sanduicheInfo--qt').innerHTML = modalQt;


        c('.sanduicheWindowArea').style.opacity = 0;
        c('.sanduicheWindowArea').style.display = 'flex';
        setTimeout(()=>{ //cria um timer que muda o valor gradativamente, nesse caso o da opacidade
            c('.sanduicheWindowArea').style.opacity = 1;
        }, 200); //tempo de transição do 0 para o 1;
    });

    // preencher as informações em sanduicheitem
    c('.sanduiche-area').append(sanduicheItem);
});
// EVENTOS DO MODAL
function closeModal(){
    c('.sanduicheWindowArea').style.opacity = 0;
    setTimeout(()=>{
        c('.sanduicheWindowArea').style.display = 'none';
    }, 500)
}
cs('.sanduicheInfo--cancelButton, .sanduicheInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click', closeModal);
})
c('.sanduicheInfo--qtmenos').addEventListener('click', ()=>{
    if(modalQt > 1){
        modalQt--;
    c('.sanduicheInfo--qt').innerHTML = modalQt;
    }
    
});
c('.sanduicheInfo--qtmais').addEventListener('click', ()=>{
    modalQt++;
    c('.sanduicheInfo--qt').innerHTML = modalQt;
});

cs('.sanduicheInfo--size').forEach((size, sizeIndex)=>{
   size.addEventListener('click', (e)=>{
    c('.sanduicheInfo--size.selected').classList.remove('selected');
    size.classList.add('selected');
   });
});

c('.sanduicheInfo--addButton').addEventListener('click', ()=>{
    let size =parseInt(c('.sanduicheInfo--size.selected').getAttribute('data-key'));

    let identifier = sanduicheJson[modalKey].id+'@'+size;
    
    let key = cart.findIndex((item)=>item.identifier == identifier);

    if(key > -1){
        cart[key].qt += modalQt;
    }else{
        cart.push({
        identifier,
        id: sanduicheJson[modalKey].id, 
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
            let sanduicheItem = sanduicheJson.find((item)=>item.id == cart[i].id);
            subtotal += sanduicheItem.price * cart[i].qt;


            let cartItem = c('.models .cart--item').cloneNode(true);

            let sanduicheSizeName;
            switch(cart[i].size){
                case 0:
                    sanduicheSizeName = 'P';
                    break;
                case 1:
                    sanduicheSizeName = 'M';
                    break;
                case 2:
                    sanduicheSizeName = 'G';
                    break;
            }


            let sanduicheName = `${sanduicheItem.name} (${sanduicheSizeName})`;

            cartItem.querySelector('img').src = sanduicheItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = sanduicheName;
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