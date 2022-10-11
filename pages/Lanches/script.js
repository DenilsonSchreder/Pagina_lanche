
let cart = [];
let modalQt = 1;
let modalKey = 0

const c = (el)=>document.querySelector(el);
const cs = (el)=>document.querySelectorAll(el);

// Listagem dos lanches
lanchesJson.map((item, index)=>{
    //clonando a div lanches-item com tudo que tem dentro dela
    let lanchesItem = c('.models .lanches-item').cloneNode(true);

    lanchesItem.setAttribute('data-key', index);
    //Valores
    lanchesItem.querySelector('.lanches-item--img img').src = item.img;
    lanchesItem.querySelector('.lanches-item--name').innerHTML = item.name;
    lanchesItem.querySelector('.lanches-item--desc').innerHTML = item.description;
    lanchesItem.querySelector('.lanches-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    
    //Colocando as informações do item clicado na área de zoom...
    lanchesItem.querySelector('a').addEventListener('click', (e)=>{
        e.preventDefault();  // Faz com que a página não atualize ( ação padrão de click em html)
        let key = e.target.closest('.lanches-item').getAttribute('data-key');
        modalQt = 1;
        modalKey = key;

        c('.lanchesBig img').src = lanchesJson[key].img
        c('.lanchesInfo h1').innerHTML = lanchesJson[key].name;
        c('.lanchesInfo--desc').innerHTML = lanchesJson[key].description;
        c('.lanchesInfo--actualPrice').innerHTML = `R$ ${lanchesJson[key].price.toFixed(2)}`;
        c('.lanchesInfo--size.selected').classList.remove('selected'); //reseta a seleção do tamanho
        cs('.lanchesInfo--size').forEach((size, sizeIndex)=>{
            if(sizeIndex == 2){
                size.classList.add('selected'); //tamanho padrão como grande
            }
            size.querySelector('span').innerHTML = lanchesJson[key].sizes[sizeIndex]; //inserindo o valor de cada tamanho
        });

        c('.lanchesInfo--qt').innerHTML = modalQt;


        c('.lanchesWindowArea').style.opacity = 0;
        c('.lanchesWindowArea').style.display = 'flex';
        setTimeout(()=>{ //cria um timer que muda o valor gradativamente, nesse caso o da opacidade
            c('.lanchesWindowArea').style.opacity = 1;
        }, 200); //tempo de transição do 0 para o 1;
    });

    // pegando as informações clonadas e preenchidas com os valores e adicionando na à tela
    c('.lanches-area').append(lanchesItem);
});
// EVENTOS DO MODAL
function closeModal(){  //fechando a tela de zoom
    c('.lanchesWindowArea').style.opacity = 0;
    setTimeout(()=>{
        c('.lanchesWindowArea').style.display = 'none';
    }, 500)
}
cs('.lanchesInfo--cancelButton, .lanchesInfo--cancelMobileButton').forEach((item)=>{ //aplicando a função que fecha o zoom
    item.addEventListener('click', closeModal);
})
c('.lanchesInfo--qtmenos').addEventListener('click', ()=>{ //contador - e preenchendo na tela
    if(modalQt > 1){
        modalQt--;
    c('.lanchesInfo--qt').innerHTML = modalQt;
    }
    
});
c('.lanchesInfo--qtmais').addEventListener('click', ()=>{ //contador + e preenchendo na tela
    modalQt++;
    c('.lanchesInfo--qt').innerHTML = modalQt;
});

cs('.lanchesInfo--size').forEach((size, sizeIndex)=>{
   size.addEventListener('click', (e)=>{ // evento de click para selecionar o tamanho
    c('.lanchesInfo--size.selected').classList.remove('selected');
    size.classList.add('selected');
   });
});

c('.lanchesInfo--addButton').addEventListener('click', ()=>{ //função para adicionar itens ao carrinho e verificar para não replicar o mesmo item
    let size =parseInt(c('.lanchesInfo--size.selected').getAttribute('data-key'));

    let identifier = lanchesJson[modalKey].id+'@'+size; //criando um id para verificar se um item com mesmo tamanho está duplicado
    
    let key = cart.findIndex((item)=>item.identifier == identifier); //caso estiver duplicado...

    if(key > -1){
        cart[key].qt += modalQt; //vai apenas aumentar a quantidade
    }else{ // caso contrário irá adicionar o item normalmente no carrinho
        cart.push({
        identifier,
        id: lanchesJson[modalKey].id, 
        size,
        qt: modalQt,
    });
    }
    updateCart();
    closeModal();
});

c('.menu-openner').addEventListener('click', ()=>{ // parte mobile para abrir o carrinho
    if(cart.length > 0){
        c('aside').style.left = '0';
    }
});
c('.menu-closer').addEventListener('click', ()=>{ // parte mobile para fechar o carrinho
    c('aside').style.left = '100vw';
});


function updateCart(){
    c('.menu-openner span').innerHTML = cart.length; // parte mobile atualizando a quantidade de itens no carrinho
    
    if(cart.length>0){ // caso tenha 1 ou mais itens no carrinho a função permitirá que ele seja aberto
        c('aside').classList.add('show');
        c('.cart').innerHTML = '';

        let subtotal = 0; //definindo os variáveis dos total no carrinho
        let desconto = 0;
        let total = 0;

        for(let i in cart){
            let lanchesItem = lanchesJson.find((item)=>item.id == cart[i].id);
            subtotal += lanchesItem.price * cart[i].qt;


            let cartItem = c('.models .cart--item').cloneNode(true); //clonando a área do carrinho dentro do modelo

            let lanchesSizeName; // variável para alocação do retorno dos tamanhos
            switch(cart[i].size){ //retorno dos valores de index sendo transformados nos tamanhos
                case 0:
                    lanchesSizeName = 'P';
                    break;
                case 1:
                    lanchesSizeName = 'M';
                    break;
                case 2:
                    lanchesSizeName = 'G';
                    break;
            }

            // ITENS DO CARRINHO
            let lanchesName = `${lanchesItem.name} (${lanchesSizeName})`;

            cartItem.querySelector('img').src = lanchesItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = lanchesName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click',()=>{
                if(cart[i].qt > 1){
                    cart[i].qt--;
                }else{ // caso o valor do item no carrinho seja modificada para 0 ele automaticamente remove o item do carrinho
                    cart.splice(i, 1);
                }
                updateCart();
            });

            cartItem.querySelector('.cart--item-qtmais').addEventListener('click',()=>{ // só adiciona mesmo
                cart[i].qt++;
                updateCart();
            });
            
            c('.cart').append(cartItem); // joga essa bagunça na tela

        }

        // calculo dos valores
        desconto = subtotal * 0.1;
        total = subtotal - desconto;
            //trocando os valores no SPAN para os que foram recebidos pelas variáveis
        c('.subtotal span:last-child').innerHTML = `${subtotal.toFixed(2)}`; 
        c('.desconto span:last-child').innerHTML = `${desconto.toFixed(2)}`;
        c('.total span:last-child').innerHTML = `${total.toFixed(2)}`;



    }else{ // Caso n tenha itens no carrinho ele fecha automaticamente
        c('aside').classList.remove('show');
        c('aside').style.left = '100vw'; // parte mobile
    }
    
}

function troco(){
    document.getElementById("troco").style.display = 'flex';
}

function finalizar(){
    window.alert('O Pedido Foi Confirmado!');
    c('aside').classList.remove('show');
}