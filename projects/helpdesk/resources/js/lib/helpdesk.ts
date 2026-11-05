export const statusLabel: Record<string, string> = {
    open: 'Abierto',
    pending: 'Pendiente',
    resolved: 'Resuelto',
};

export const priorityLabel: Record<string, string> = {
    low: 'Baja',
    normal: 'Normal',
    high: 'Alta',
    urgent: 'Urgente',
};

export const categoryLabel: Record<string, string> = {
    billing: 'Facturación',
    account: 'Cuenta',
    technical: 'Técnico',
    shipping: 'Envíos',
    other: 'Otro',
};

export const triageLabel: Record<string, string> = {
    pending: 'En cola',
    running: 'Procesando',
    done: 'Triage listo',
    failed: 'Falló',
};

export function priorityTone(priority: string): string {
    return priority === 'urgent' || priority === 'high' ? 'hd-tag--urgent' : '';
}

export function triageTone(status: string): string {
    if (status === 'done') return 'hd-tag--done';
    if (status === 'failed') return 'hd-tag--urgent';
    return 'hd-tag--pending';
}

export function formatDate(value: string | null): string {
    if (!value) return '—';

    return new Intl.DateTimeFormat('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(value));
}
