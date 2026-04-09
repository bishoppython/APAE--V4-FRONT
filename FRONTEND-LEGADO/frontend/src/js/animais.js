let audioAtual = null; 

function mostrarGrupo(grupo) {
  const grupos = document.querySelectorAll('.grupo');
  
  // Esconde todos os grupos
  grupos.forEach(g => g.style.display = 'none'); 
  
  // Mostra apenas o grupo selecionado
  document.getElementById(grupo).style.display = 'flex'; 
}

function tocarSom(caminhoSom) {
  if (!caminhoSom || caminhoSom === '#') {
    alert("Som não disponível ainda.");
    return;
  }

  if (audioAtual) {
    audioAtual.pause();
    audioAtual.currentTime = 0;
  }

  audioAtual = new Audio(caminhoSom);
  audioAtual.play();
}
