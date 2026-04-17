/**
 * Retrieves the bright standard Clist rating color mapped for dark mode visibility.
 */
export const getRatingColor = (r: number | string): string => {
    const val = typeof r === 'string' ? parseInt(r, 10) : r;
    if (isNaN(val)) return '#ffa116';
    if (val < 1200) return '#9ca3af';
    if (val < 1400) return '#22c55e';
    if (val < 1600) return '#06b6d4';
    if (val < 1900) return '#3b82f6';
    if (val < 2100) return '#c084fc';
    if (val < 2400) return '#ffa116';
    return '#ef4743';
};
