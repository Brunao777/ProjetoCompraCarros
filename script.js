let carrinhoCount = 0
let totalValor = 0

let botoesProdutos = document.querySelectorAll('.productButton')
for(let i = 0; i <botoesProdutos.length; i++){
  let botao = botoesProdutos[i]
  
  botao.addEventListener('click', function(event){
    let elemento = event.target.id
    let id = parseInt(elemento.substring(4))
   
    let carro = procuraCarros(id)

    if(!carro){
      alert('Carro não existe na lista!')
    }else if(!verificaCarro(carro.id)){
      insereCarrosCarrinho(carro)
    }else{
      alert('Carro ja consta no carrinho!')
    }
  })
}
function verificaCarro(id){
  let elemento = document.getElementById(`fav_${id}`)
  if(elemento == null){
    return false
  }else{
    return true
  }
}
function procuraCarros(id){
  for(let j = 0; j <carros.length; j++){
    let carro = carros[j]
    if(carro.id === id){
     return carro
    }
  }
  return false
}
function calcularTotalCarrinho() {
  totalValor = 0
  let itensCarrinho = document.querySelectorAll('#listaCarrinho li')
  itensCarrinho.forEach(item => {
    let valorText = item.querySelector('p.valor').textContent
    let valorNumerico = parseInt(valorText.replace("Valor: ", "").replace(".", "").replace(",", "."))
    if (!isNaN(valorNumerico)) {
      totalValor += valorNumerico
    }
  })
  document.getElementById('totalValor').textContent = `R$: ${totalValor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2})}`
}
function insereCarrosCarrinho(carro){
  carrinhoCount++
  document.getElementById('favQuantidade').textContent = `(${carrinhoCount})`

  let carrinhoHTML = document.getElementById('listaCarrinho')
  
  let li = document.createElement('li')
  let img = document.createElement('img')
  let p = document.createElement('p')
  let pValor = document.createElement('p')
  let button = document.createElement('button')

  li.id = `item_${carro.id}`
  img.src = carro.imagem
  p.innerHTML = `${carro.marca} ${carro.modelo} ${carro.ano}`
  pValor.innerHTML = `Valor: ${parseFloat(carro.valor.replace("valor: ", "").replace(/\./g, "").replace(",", ".")).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  button.innerHTML = 'Remover'
  button.id = `fav_${carro.id}`
  button.classList.add('productButton')

  button.addEventListener('click', function(event){
    li = document.getElementById(`item_${carro.id}`)
    li.remove()
    removerDoCarrinho(event)
    carrinhoCount--
    document.getElementById('favQuantidade').innerHTML = `(${carrinhoCount})`
  
  })
  li.append(img, p, pValor, button)
  carrinhoHTML.append(li)

  totalValor += parseFloat(carro.valor.replace("valor: ", "").replace(".", "").replace(",", "."))
  document.getElementById('totalValor').textContent = `R$: ${totalValor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}
document.addEventListener('DOMContentLoaded', function () {
  let campoPesquisa = document.querySelector('.inputPesquisa input');
  let listaProdutos = document.querySelector('.listaProdutos');

  let campoPesquisaVazio = true;

  campoPesquisa.addEventListener('input', function () {
      if (campoPesquisa.value === "") {
          window.location.reload();
      } else {
          let termoPesquisa = campoPesquisa.value.toLowerCase()
          let carrosFiltrados = carros.filter(function (carro) {
              return (
                  carro.marca.toLowerCase().includes(termoPesquisa) ||
                  carro.modelo.toLowerCase().includes(termoPesquisa) ||
                  carro.ano.toLowerCase().includes(termoPesquisa) ||
                  carro.valor.toLowerCase().includes(termoPesquisa)
              )
          })
          listaProdutos.innerHTML = ''
          let botoesProdutos = document.querySelectorAll('.productButton')
          botoesProdutos.forEach(function (botao) {
              botao.removeEventListener('click', adicionarAoCarrinho)
          })
          carrosFiltrados.forEach(function (carro) {
              listaProdutos.innerHTML += `
                  <li>
                      <img src="${carro.imagem}" alt="${carro.marca} ${carro.modelo}">
                      <p>${carro.marca} ${carro.modelo} ${carro.ano}</p>
                      <p class="valor">Valor: ${carro.valor}</p>
                      <button id="car_${carro.id}" class="productButton">Comprar</button>
                  </li>
              `
          })
          let novosBotoesProdutos = document.querySelectorAll('.productButton')
          novosBotoesProdutos.forEach(function (botao) {
              botao.addEventListener('click', adicionarAoCarrinho)
          })
          campoPesquisaVazio = termoPesquisa === ''
      }
  })
  function adicionarAoCarrinho(event) {
      let idCarro = parseInt(event.target.id.split('_')[1])
      let carroSelecionado = carros.find(function (carro) {
          return carro.id === idCarro;
      });
      if (carroSelecionado) {
          if (!campoPesquisaVazio)
              insereCarrosCarrinho(carroSelecionado)
      }
  }
})
function removerDoCarrinho(event) {
  let idCarroRemovido = parseInt(event.target.id.split('_')[1])
  let carroRemovido = carros.find(function (carro) {
    return carro.id === idCarroRemovido
  })
  if (carroRemovido) {
    event.target.parentNode.remove()
    calcularTotalCarrinho()
  }
}
document.getElementById('btnFinalizarCompra').addEventListener('click', limparCarrinho)
function limparCarrinho() {
  let listaCarrinho = document.getElementById('listaCarrinho')
  listaCarrinho.innerHTML = ''
  carrinhoCount = ''
  document.getElementById('favQuantidade').textContent = `(0)`
  totalValor = ''
  document.getElementById('totalValor').textContent = `R$:`
}
