export function API_BASE_URL(): string { return `${window.location.host.includes('localhost') ? 'http' : 'https'}://${window.location.host}/api/`; }
export function WS_BASE_URL(): string { return `${window.location.host.includes('localhost') ? 'ws' : 'wss'}://${window.location.host}/ws/`; }
