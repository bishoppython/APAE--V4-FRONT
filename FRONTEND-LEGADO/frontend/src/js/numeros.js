document.addEventListener("DOMContentLoaded", () => {
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

        img.addEventListener("click", () => {
            handleClick(audio);
        });
    };

    // Map audio IDs para as Image classes
    const audioImageMap = [
        { audioId: "um_player", imgClass: ".um" },
        { audioId: "dois_player", imgClass: ".dois" },
        { audioId: "tres_player", imgClass: ".tres" },
        { audioId: "quatro_player", imgClass: ".quatro" },
        { audioId: "cinco_player", imgClass: ".cinco" },
        { audioId: "seis_player", imgClass: ".seis" },
        { audioId: "sete_player", imgClass: ".sete" },
        { audioId: "oito_player", imgClass: ".oito" },
        { audioId: "nove_player", imgClass: ".nove" },
        { audioId: "dez_player", imgClass: ".dez" }
    ];

    // Add click event listeners para todos os audio players
    audioImageMap.forEach(pair => {
        addClickListener(pair.audioId, pair.imgClass);
    });
});
