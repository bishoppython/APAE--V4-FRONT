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
        { audioId: "estou_com_fome_player", imgClass: ".estou_com_fome" },
        { audioId: "estou_com_sede_player", imgClass: ".estou_com_sede" },
        { audioId: "estou_cansado_player", imgClass: ".estou_cansado" },
        { audioId: "sim_player", imgClass: ".sim" },
        { audioId: "preciso_ir_ao_banheiro_player", imgClass: ".preciso_ir_ao_banheiro" },
        { audioId: "quero_brincar_player", imgClass: ".quero_brincar" },
        { audioId: "nao_me_sinto_bem_player", imgClass: ".nao_me_sinto_bem" },
        { audioId: "nao_player", imgClass: ".nao" }, 
        { audioId: "estou_com_frio_player", imgClass: ".estou_com_frio" },
        { audioId: "estou_com_calor_player", imgClass: ".estou_com_calor" },
        { audioId: "estou_com_medo_player", imgClass: ".estou_com_medo" },
        { audioId: "por_favor_player", imgClass: ".por_favor" },
        { audioId: "obrigado_player", imgClass: ".obrigado" },
        { audioId: "tchau_player", imgClass: ".tchau" },
        { audioId: "eu_nao_quero_player", imgClass: ".eu_nao_quero" },
        { audioId: "preciso_de_ajuda_player", imgClass: ".preciso_de_ajuda" }
    ];

    // Add click event listeners para todos os audio players
    audioImageMap.forEach(pair => {
        addClickListener(pair.audioId, pair.imgClass);
    });
});
