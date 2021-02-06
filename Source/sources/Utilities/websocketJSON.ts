type websocketJSON = {
    (url: string, onData: (data: unknown) => void, onError: (error: string) => void): void;
    <T>(url: string, isT: (obj: unknown) => obj is T, onData: (data: T) => void, onError: (error: string) => void): void;
};

export const websocketJSON: websocketJSON = <T>(url: string, onDataOrIsT: ((data: unknown) => void) | ((obj: unknown) => obj is T), onErrorOrOnData: ((error: string) => void) | ((data: T) => void), onError?: (error: string) => void) => {
    const actualOnData = typeof onError === 'function' ? onErrorOrOnData as (data: T) => void : onDataOrIsT as (data: unknown) => void;
    const actualOnError = typeof onError === 'function' ? onError : onErrorOrOnData as (error: string) => void;
    const actualIsT = typeof onError === 'function' ? onDataOrIsT as (obj: unknown) => obj is T : undefined;

    try {
        const socket = new WebSocket(url);

        socket.addEventListener('message', (message) => {
            let data: unknown;
            try {
                data = JSON.parse(message.data);
            } catch {
                actualOnError('Message was not valid JSON');
                return;
            }
            if (actualIsT) {
                if (actualIsT(data)) actualOnData(data);
                else actualOnError('Response was not of correct type');
                return;
            }
            actualOnData(data as T);
        });

        socket.addEventListener('error', (error) => {
            actualOnError(error.toString());
        });

    } catch (error) {
        actualOnError(error.toString());
    }
};
