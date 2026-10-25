const CACHE_DURATION = 60 * 60 * 1000;

export function setCache(key, data){
    const cache = {
        data: data,
        timestamp: Date.now()
    };

    localStorage.setItem(key, JSON.stringify(cache));

}

export function getCache(key) {

    try {
        const texto = localStorage.getItem(key);


        if (texto !== null) {

            const objeto = (JSON).parse(texto);
            const tiempoTranscurrido = Date.now() - objeto.timestamp;
            if (tiempoTranscurrido < CACHE_DURATION) {
                return objeto.data;
            }
        }
        return null;
    } catch (error) {
        localStorage.removeItem(key);
        return null;
    }
}
