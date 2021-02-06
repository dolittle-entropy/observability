import { Configuration } from './Configuration';

export const merge = (child: Configuration, parent?: Configuration): Configuration =>
    ({
        serverUrl: child.serverUrl ?? parent?.serverUrl,
        websocketServerUrl: child.websocketServerUrl ?? parent?.websocketServerUrl,
    });
