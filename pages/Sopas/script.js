
let cart = [];
let modalQt = 1;
let modalKey = 0

const c = (el)=>document.querySelector(el);
const cs = (el)=>document.querySelectorAll(el);

// Listagem das sopas
sopaJson.map((item, index)=>{
    //clonando a div sopa-item
    let sopaItem = c('.models .sopa-item').cloneNode(true);

    sopaItem.setAttribute('data-key', index);

    sopaItem.querySelector('.sopa-item--img img').src = item.img;
    sopaItem.querySelector('.sopa-item--name').innerHTML = item.name;
    sopaItem.querySelector('.sopa-item--desc').innerHTML = item.description;
    sopaItem.querySelector('.sopa-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    
    sopaItem.querySelector('a').addEventListener('click', (e)=>{
        e.preventDefault();  // Faz com que a página não atualize ( ação padrão de click em html)
        let key = e.target.closest('.sopa-item').getAttribute('data-key');
        modalQt = 1;
        modalKey = key;

        c('.sopaBig img').src = sopaJson[key].img
        c('.sopaInfo h1').innerHTML = sopaJson[key].name;
        c('.sopaInfo--desc').innerHTML = sopaJson[key].description;
        c('.sopaInfo--actualPrice').innerHTML = `R$ ${sopaJson[key].price.toFixed(2)}`;
        c('.sopaInfo--size.selected').classList.remove('selected');
        cs('.sopaInfo--size').forEach((size, sizeIndex)=>{
            if(sizeIndex == 2){
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = sopaJson[key].sizes[sizeIndex];
        });

        c('.sopaInfo--qt').innerHTML = modalQt;


        c('.sopaWindowArea').style.opacity = 0;
        c('.sopaWindowArea').style.display = 'flex';
        setTimeout(()=>{ //cria um timer que muda o valor gradativamente, nesse caso o da opacidade
            c('.sopaWindowArea').style.opacity = 1;
        }, 200); //tempo de transição do 0 para o 1;
    });

    // preencher as informações em sopaitem
    c('.sopa-area').append(sopaItem);
});
// EVENTOS DO MODAL
function closeModal(){
    c('.sopaWindowArea').style.opacity = 0;
    setTimeout(()=>{
        c('.sopaWindowArea').style.display = 'none';
    }, 500)
}
cs('.sopaInfo--cancelButton, .sopaInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click', closeModal);
})
c('.sopaInfo--qtmenos').addEventListener('click', ()=>{
    if(modalQt > 1){
        modalQt--;
    c('.sopaInfo--qt').innerHTML = modalQt;
    }
    
});
c('.sopaInfo--qtmais').addEventListener('click', ()=>{
    modalQt++;
    c('.sopaInfo--qt').innerHTML = modalQt;
});

cs('.sopaInfo--size').forEach((size, sizeIndex)=>{
   size.addEventListener('click', (e)=>{
    c('.sopaInfo--size.selected').classList.remove('selected');
    size.classList.add('selected');
   });
});

c('.sopaInfo--addButton').addEventListener('click', ()=>{
    let size =parseInt(c('.sopaInfo--size.selected').getAttribute('data-key'));

    let identifier = sopaJson[modalKey].id+'@'+size;
    
    let key = cart.findIndex((item)=>item.identifier == identifier);

    if(key > -1){
        cart[key].qt += modalQt;
    }else{
        cart.push({
        identifier,
        id: sopaJson[modalKey].id, 
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
            let sopaItem = sopaJson.find((item)=>item.id == cart[i].id);
            subtotal += sopaItem.price * cart[i].qt;


            let cartItem = c('.models .cart--item').cloneNode(true);

            let sopaSizeName;
            switch(cart[i].size){
                case 0:
                    sopaSizeName = 'P';
                    break;
                case 1:
                    sopaSizeName = 'M';
                    break;
                case 2:
                    sopaSizeName = 'G';
                    break;
            }


            let sopaName = `${sopaItem.name} (${sopaSizeName})`;

            cartItem.querySelector('img').src = sopaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = sopaName;
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