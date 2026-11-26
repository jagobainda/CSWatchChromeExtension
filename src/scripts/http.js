const TIMEOUT_MS = 10000;
const STATUS_ERRORS = { 403: 'blocked', 404: 'not_found', 429: 'blocked' };

export const fetchResource = async (url, read, init = {}) => {
    try {
        const response = await fetch(url, { ...init, signal: AbortSignal.timeout(TIMEOUT_MS) });
        if (!response.ok) throw new Error(STATUS_ERRORS[response.status] ?? 'http');
        return await response[read]();
    } catch (error) {
        throw error.name === 'TimeoutError' ? new Error('timeout') : error;
    }
};
