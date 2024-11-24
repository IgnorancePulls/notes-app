const formatDate = (date: Date | string): string => {
    const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    };

    return new Date(date).toLocaleString('en-US', options).replace(',', ' at');
}

export { formatDate };
