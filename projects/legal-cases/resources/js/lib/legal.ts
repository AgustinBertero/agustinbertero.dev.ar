export const roleLabel: Record<string, string> = {
    owner: 'Titular',
    lawyer: 'Abogado/a',
    assistant: 'Asistente',
};

export const caseStatusLabel: Record<string, string> = {
    open: 'Abierto',
    paused: 'Pausado',
    closed: 'Cerrado',
    archived: 'Archivado',
};

export const matterLabel: Record<string, string> = {
    civil: 'Civil',
    commercial: 'Comercial',
    labor: 'Laboral',
    family: 'Familia',
    criminal: 'Penal',
    administrative: 'Administrativo',
    other: 'Otro',
};

export const deadlineStatusLabel: Record<string, string> = {
    pending: 'Pendiente',
    done: 'Cumplido',
    missed: 'Vencido',
};

export const deadlineTypeLabel: Record<string, string> = {
    procedural: 'Procesal',
    hearing: 'Audiencia',
    filing: 'Presentación',
    meeting: 'Reunión',
    other: 'Otro',
};

export const taskStatusLabel: Record<string, string> = {
    pending: 'Pendiente',
    done: 'Hecha',
};

export function formatDate(value: string | null | undefined, withTime = false): string {
    if (!value) return '—';
    return new Intl.DateTimeFormat('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {}),
    }).format(new Date(value));
}

export function formatDateTime(value: string | null | undefined): string {
    return formatDate(value, true);
}

export function isOverdue(value: string | null | undefined, status = 'pending'): boolean {
    return status === 'pending' && !!value && new Date(value).getTime() < Date.now();
}

export function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function statusTone(status: string): string {
    if (status === 'open' || status === 'pending') return 'lg-chip--open';
    if (status === 'closed') return 'lg-chip--closed';
    if (status === 'archived' || status === 'paused') return 'lg-chip--paused';
    return '';
}

export function deadlineTone(status: string, dueAt: string | null): string {
    if (status === 'missed' || isOverdue(dueAt, status)) return 'lg-chip--overdue';
    if (status === 'done') return 'lg-chip--closed';
    return 'lg-chip--pending';
}
