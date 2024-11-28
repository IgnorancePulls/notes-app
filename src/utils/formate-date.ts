const formatDate = (date: Date | string): string => {
    const parsedDate = new Date(date);

    const day = parsedDate.getDate().toString().padStart(2, '0');
    const month = (parsedDate.getMonth() + 1).toString().padStart(2, '0');
    const year = parsedDate.getFullYear();

    const options: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
    };

    const time = parsedDate.toLocaleTimeString('en-US', options);

    return `${day}.${month}.${year} at ${time}`;
};

export { formatDate };