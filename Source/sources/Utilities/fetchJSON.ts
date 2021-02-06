type fetchJSON = {
    (input: RequestInfo, init?: RequestInit): Promise<unknown>;
    <T>(input: RequestInfo, isT: (obj: unknown) => obj is T): Promise<T>;
    <T>(input: RequestInfo, init: RequestInit, isT: (obj: unknown) => obj is T): Promise<T>;
};

export const fetchJSON: fetchJSON = async <T>(input: RequestInfo, initOrIsT?: RequestInit | ((obj: unknown) => obj is T), isT?: ((obj: unknown) => obj is T)): Promise<T | unknown> => {
    let response: Response;
    let data: unknown;
    try {
        response = await fetch(input, typeof initOrIsT === 'object' ? initOrIsT : undefined);
        data = await response.json();
    } catch {
        if (response.status !== 200) throw `Request failed with ${response.statusText}`;
        if (response.headers.get('Content-Type') !== 'application/json') throw 'Response was not JSON';
        throw 'Response was not valid JSON';
    }
    if (typeof isT === 'function') {
        if (isT(data)) return data;
        throw 'Response was not of correct type';
    }
    if (typeof initOrIsT === 'function') {
        if (initOrIsT(data)) return data;
        throw 'Response was not of correct type';
    }
    return data;
};
