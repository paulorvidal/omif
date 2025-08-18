export const getInitials = (name: string | undefined): string => {
    if (!name) return "?";
    const names = name.split(' ');
    const firstInitial = names[0][0];
    const lastInitial = names.length > 1 ? names[names.length - 1][0] : '';
    return `${firstInitial}${lastInitial}`.toUpperCase();
};
