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
        selector: ".card.necessidades a",
        audioId: "necessidades_player",
      },
      {
        selector: ".card.numeros a",
        audioId: "numeros_player",
      },
      {
        selector: ".card.cores a",
        audioId: "cores_player",
      },
      {
        selector: ".card.calculadora a", 
        audioId: "calculadora_player"},
      {
        selector: ".card.animais a",
        audioId: "animais_player",
      },
      {
        selector: ".card.jogos a",
        audioId: "jogos_player",
      },
      {
        selector: ".card.misturandoCores a",
        audioId: "misturandoCores_player",
      },
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
        audioId: "necessidades_player",
        imgClass: ".card.necessidades .audio-verde-img",
      },
      {
        audioId: "numeros_player",
        imgClass: ".card.numeros .audio-verde-img",
      },
      {
        audioId: "calculadora_player",
        imgClass: ".card.calculadora .audio-verde-img",
      },
      {
        audioId: "cores_player",
        imgClass: ".card.cores .audio-verde-img",
      },
      {
        audioId: "animais_player",
        imgClass: ".card.animais .audio-verde-img",
      },
      {
        audioId: "misturandoCores_player",
        imgClass: ".card.misturandoCores .audio-verde-img",
      },
      { audioId: "jogos_player", imgClass: ".card.jogos .audio-verde-img" },
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
