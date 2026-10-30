const nivel = document.getElementById("nivel");
const tabuleiro = document.getElementById("tabuleiro");
const tentativasElemento = document.getElementById("tentativas");
const paresElemento = document.getElementById("pares");
const precisaoElemento = document.getElementById("precisao");
const mensagem = document.getElementById("mensagem");
const botaoReiniciar = document.getElementById("reiniciar");

const todosOsPares = [
  // LOGÍSTICA
  { id: 1, nome: "Armazenagem", curso: "Logística", imagem: "caixa.svg" },
  { id: 2, nome: "Transporte", curso: "Logística", imagem: "caminhao.svg" },
  // ELETROMECÂNICA
  { id: 3, nome: "Robótica", curso: "Eletromecânica", imagem: "robo.svg" },
  { id: 4, nome: "Montagem", curso: "Eletromecânica", imagem: "engrenagem.svg" },
  // MECÂNICA
  { id: 5, nome: "Ferramentas", curso: "Mecânica", imagem: "chave.svg" },
  { id: 6, nome: "Motor", curso: "Mecânica", imagem: "motor.svg" },
  // ELETROELETRÔNICA
  { id: 7, nome: "Circuitos", curso: "Eletroeletrônica", imagem: "circuito.svg" },
  { id: 8, nome: "Conexões", curso: "Eletroeletrônica", imagem: "placa.svg" },
  // DESENVOLVIMENTO DE SISTEMAS
{ id: 9, nome: "Programação", curso: "Desenv. de Sistemas", imagem: "codigo.svg" },
  { id: 10, nome: "Computadores", curso: "Desenv. de Sistemas", imagem: "computador.svg" }
];

const quantidadePorNivel = { facil: 6, medio: 8, dificil: 10 };
let primeiraCarta = null;
let segundaCarta = null;
let bloqueado = false;
let tentativas = 0;
let paresEncontrados = 0;
let totalDePares = 6;

function embaralhar(lista) {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

function iniciarJogo() {
  totalDePares = quantidadePorNivel[nivel.value];
  primeiraCarta = null;
  segundaCarta = null;
  bloqueado = false;
  tentativas = 0;
  paresEncontrados = 0;

  const paresDoNivel = todosOsPares.slice(0, totalDePares);
  const cartas = embaralhar([...paresDoNivel, ...paresDoNivel]);

  tabuleiro.innerHTML = "";
  cartas.forEach((item, indice) => {
    const carta = document.createElement("button");
    carta.type = "button";
    carta.className = "carta";
    carta.dataset.id = item.id;
    carta.setAttribute("aria-label", `Carta ${indice + 1}, fechada`);
    carta.innerHTML = `
      <span class="verso">?</span>
      <span class="frente">
        <img class="imagem-carta" src="img/${item.imagem}" alt="" />
        <span class="nome">${item.nome}</span>
        <span class="curso">${item.curso}</span>
      </span>
    `;
    carta.addEventListener("click", () => revelarCarta(carta));
    tabuleiro.appendChild(carta);
  });

  atualizarIndicadores();
  mensagem.textContent = "Encontre os pares das cinco áreas de formação do SENAI!";
}

function revelarCarta(carta) {
  if (bloqueado || carta === primeiraCarta || carta.classList.contains("encontrada") || carta.classList.contains("revelada")) return;

  carta.classList.add("revelada");
  carta.setAttribute("aria-label", `Carta revelada: ${carta.querySelector(".nome").textContent}`);

  if (!primeiraCarta) {
    primeiraCarta = carta;
    return;
  }

  segundaCarta = carta;
  tentativas++;
  atualizarIndicadores();

  if (primeiraCarta.dataset.id === segundaCarta.dataset.id) {
    primeiraCarta.classList.add("encontrada");
    segundaCarta.classList.add("encontrada");
    primeiraCarta.disabled = true;
    segundaCarta.disabled = true;
    paresEncontrados++;
    mensagem.textContent = "Muito bem! Você encontrou um par. Continue assim!";
    limparSelecao();
    atualizarIndicadores();

    if (paresEncontrados === totalDePares) finalizarJogo();
  } else {
    bloqueado = true;
    mensagem.textContent = "Não foi dessa vez! Memorize as imagens e tente novamente.";
    setTimeout(() => {
      primeiraCarta.classList.remove("revelada");
      segundaCarta.classList.remove("revelada");
      primeiraCarta.setAttribute("aria-label", "Carta fechada");
      segundaCarta.setAttribute("aria-label", "Carta fechada");
      limparSelecao();
    }, 850);
  }
}

function limparSelecao() {
  primeiraCarta = null;
  segundaCarta = null;
  bloqueado = false;
}

function atualizarIndicadores() {
  tentativasElemento.textContent = tentativas;
  paresElemento.textContent = `${paresEncontrados}/${totalDePares}`;
  precisaoElemento.textContent = tentativas === 0 ? "—" : `${Math.round((paresEncontrados / tentativas) * 100)}%`;
}

function finalizarJogo() {
  const precisao = Math.round((paresEncontrados / tentativas) * 100);
  let avaliacao = "Bom trabalho! Você concluiu o desafio.";
  if (precisao >= 80) avaliacao = "Excelente memória! Você mandou muito bem!";
  else if (precisao < 50) avaliacao = "Desafio concluído! Continue praticando para melhorar sua memória.";

  mensagem.textContent = `🎉 ${avaliacao} Tentativas: ${tentativas} · Precisão: ${precisao}%.`;
  tabuleiro.querySelectorAll(".carta").forEach(carta => carta.disabled = true);
}

nivel.addEventListener("change", iniciarJogo);
botaoReiniciar.addEventListener("click", iniciarJogo);
iniciarJogo();
imagem: "img/codigo.svg"
