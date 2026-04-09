document.addEventListener("DOMContentLoaded", () => {
  // Função para lidar com o clique no card
  const handleCardClick = (audio, redirectUrl, event) => {
    // Previne o comportamento padrão do link
    event.preventDefault();

    // Se o áudio estiver tocando, para e reinicia
    if (!audio.paused) {
      audio.pause();
    }
    audio.currentTime = 0;

    // Toca o áudio
    const playPromise = audio.play();

    // Se houver erro na reprodução, redireciona imediatamente
    if (playPromise !== undefined) {
      playPromise
        .catch(() => {
          window.location.href = redirectUrl;
        })
        .then(() => {
          // Quando o áudio terminar, redireciona
          audio.onended = function () {
            window.location.href = redirectUrl;
          };
        });
    } else {
      // Fallback para navegadores mais antigos
      audio.onended = function () {
        window.location.href = redirectUrl;
      };
    }
  };

  // Configura os listeners para os cards
  const setupCardListeners = () => {
    const cardsMap = [
      {
        selector: ".card.calculadora a",
        audioId: "calculadora_player",
      },
      {
        selector: ".card.soletrando a",
        audioId: "soletrando_player",
      },
      {
        selector: ".card.adivinhacao a",
        audioId: "adivinhacao_player",
      },
      {
        selector: ".card.memoria a",
        audioId: "memoria_player",
      },
      {
        selector: ".card.cobrirTracejado a",
        audioId: "cobrirTracejado_player",
      },
      {
        selector: ".card.labirinto a",
        audioId: "labirinto_player",
      },
      {
        selector: ".card.quebraCabeca a",
        audioId: "quebraCabeca_player",
      },
      {
        selector: ".card.encaixeFormas a",
        audioId: "encaixeFormas_player",
      }
      
    ];

    cardsMap.forEach((item) => {
      const link = document.querySelector(item.selector);
      const audio = document.getElementById(item.audioId);

      if (link && audio) {
        link.addEventListener("click", (e) => {
          handleCardClick(audio, link.getAttribute("href"), e);
        });
      }
    });
  };

  const handleAudioIconClick = (audio) => {
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
      audio.currentTime = 0;
    }
  };

  const setupAudioIconListeners = () => {
    const audioImageMap = [
      {
        audioId: "calculadora_player",
        imgClass: ".card.calculadora .audio-verde-img",
      },
      {
        audioId: "soletrando_player",
        imgClass: ".card.soletrando .audio-verde-img",
      },
      {
        audioId: "adivinhacao_player",
        imgClass: ".card.adivinhacao .audio-verde-img",
      },
      {
        audioId: "adivinhacao_player",
        imgClass: ".card.adivinhacao .audio-verde-img",
      },
      {
        audioId: "labirinto_player",
        imgClass: ".card.labirinto .audio-verde-img",
      },
      {
        audioId: "quebraCabeca_player",
        imgClass: ".card.quebraCabeca .audio-verde-img",
      },
      {
        audioId: "encaixeFormas_player",
        imgClass: ".card.encaixeFormas .audio-verde-img",
      },

      { audioId: "memoria_player", imgClass: ".card.memoria .audio-verde-img" },
    ];

    audioImageMap.forEach((pair) => {
      const audio = document.getElementById(pair.audioId);
      const img = document.querySelector(pair.imgClass);

      if (img && audio) {
        img.addEventListener("click", (e) => {
          e.stopPropagation(); // Impede que o evento do card seja acionado
          handleAudioIconClick(audio);
        });
      }
    });
  };

  // Inicializa ambos os listeners
  setupCardListeners();
  setupAudioIconListeners();
});
