
export function calculateScroll() {
    //altura del scroll original en pantalla
    let inicialScroll = window.innerHeight; //659

    //altura del scroll total
    let scrollMax = document.documentElement.scrollHeight; //1977

    let totalForScroll = scrollMax - inicialScroll; //1318

    return totalForScroll;
}

export let MAX_FRAMES = 150;