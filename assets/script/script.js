function menuToggle(){
    let menuArea = document.getElementById("menu-area");

    if(menuArea.style.width == '200px'){
        menuArea.style.width = '0px';
        document.querySelector('.menu').style.marginRight = "0px";
    } else{
        menuArea.style.width = '200px';
        document.querySelector('.menu').style.marginRight = "160px";
    }
}
function subirTela(){
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
    });
}

function decidirBotaoScroll(){
    if(window.scrollY < 200){
        document.querySelector('.scrollbutton').style.display = 'none';
    }else{
        document.querySelector('.scrollbutton').style.display = 'block';
    }
}
window.addEventListener('scroll', decidirBotaoScroll);


usuario = 'user';
senha = '123';

function entrar(){
    if(login.usuario.value == usuario && login.senha.value == senha){
        alert('Usuário Autenticado com Sucesso!');
        document.querySelector('.loginWindowArea').style.display = 'none';
        document.querySelector('.scrollbutton').style.display = 'flex';
    }
}