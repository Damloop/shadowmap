let currentAudio = null;

export const playSound = (src, volume = 0.6) => {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }

    currentAudio = new Audio(src);
    currentAudio.volume = volume;
    currentAudio.play().catch(() => {});
};

export const stopSound = () => {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio = null;
    }
};
