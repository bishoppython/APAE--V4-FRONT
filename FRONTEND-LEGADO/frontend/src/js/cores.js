document.addEventListener("DOMContentLoaded", function () {
  // ========== AUDIO ==========
  const handleClick = (audio) => {
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
      audio.currentTime = 0;
    }
  };

  const addClickListener = (audioId, imgClass) => {
    const audio = document.getElementById(audioId);
    const img = document.querySelector(imgClass);

    if (audio && img) {
      img.addEventListener("click", () => {
        handleClick(audio);
      });
    }
  };

  const audioImageMap = [
    { audioId: "amarelo_player", imgClass: ".amarelo" },
    { audioId: "azul_player", imgClass: ".azul" },
    { audioId: "vermelho_player", imgClass: ".vermelho" },
    { audioId: "verde_player", imgClass: ".verde" },
    { audioId: "rosa_player", imgClass: ".rosa" },
    { audioId: "roxo_player", imgClass: ".roxo" },
    { audioId: "laranja_player", imgClass: ".laranja" },
    { audioId: "lilas_player", imgClass: ".lilas" },
    { audioId: "azul_claro_player", imgClass: ".azul-claro" },
    { audioId: "lavanda_player", imgClass: ".lavanda" },
    { audioId: "turquesa_player", imgClass: ".turquesa" },
    { audioId: "vermelho_alaranjado_player", imgClass: ".vermelho-alaranjado" },
    { audioId: "amarelo_esverdeado_player", imgClass: ".amarelo-esverdeado" },
    { audioId: "azul_arroxeado_player", imgClass: ".azul-arroxeado" },
    { audioId: "laranja_rosado_player", imgClass: ".laranja-rosado" },
    { audioId: "amarelo_alaranjado_player", imgClass: ".amarelo-alaranjado" },
  ];

  audioImageMap.forEach((pair) => {
    addClickListener(pair.audioId, pair.imgClass);
  });

  // ========== BUTTONS ==========
  const botoes = {
    primarias: document.getElementById("btn-primarias"),
    secundarias: document.getElementById("btn-secundarias"),
    terciarias: document.getElementById("btn-terciarias"),
  };

  const cards = document.querySelectorAll(".card");

  // Function to show the selected color group
  const mostrarGrupo = (grupo) => {
    // Remove the "ativo" class from all cards
    cards.forEach((card) => {
      card.classList.remove("ativo");
    });

    // Add the "ativo" class to the cards of the selected group
    cards.forEach((card) => {
      if (card.classList.contains(grupo)) {
        card.classList.add("ativo");
      }
    });
  };

  // Add click event listeners to the buttons
  botoes.primarias.addEventListener("click", () => {
    mostrarGrupo("primarias");
    tocarSom("src/audio/cores/cores-primarias.mp3");
  });
  botoes.secundarias.addEventListener("click", () => {
    mostrarGrupo("secundarias");
    tocarSom("src/audio/cores/cores-secundarias.mp3");
  });
  botoes.terciarias.addEventListener("click", () => {
    mostrarGrupo("terciarias");
    tocarSom("src/audio/cores/cores-terciarias.mp3");
  }); // Ensure the button is properly connected

  function tocarSom(caminhoSom) {
    try {
      const audio = new Audio(caminhoSom);
      audio.play().catch((error) => {
        console.error("Erro ao reproduzir o áudio:", error);
      });
    } catch (error) {
      console.error("Erro ao carregar o áudio:", error);
    }
  }
});
