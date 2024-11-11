export const formatDate = (dateString, type = 'display') => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    if (type === 'display') {
        return `${day}/${month}/${year}`;
    } else if (type === 'calendar') {
        return `${year}-${month}-${day}`;
    }
};