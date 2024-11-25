import {User} from "@/types/user.ts";

const getRelevanceScore = (query: string, user: User) => {
    const lowerQuery = query.toLowerCase();
    const firstName = user.first_name.toLowerCase();
    const lastName = user.last_name.toLowerCase();

    let score = 0;

    // Prioritize matches at the start of the name
    if (firstName.startsWith(lowerQuery)) score += 1;
    if (lastName.startsWith(lowerQuery)) score += 1;

    // Partial matches get a lower score
    if (firstName.includes(lowerQuery)) score += 0.5;
    if (lastName.includes(lowerQuery)) score += 0.5;

    // Bonus for matches in both first and last name
    if (firstName.includes(lowerQuery) && lastName.includes(lowerQuery)) score += 1;

    return score;
};

export { getRelevanceScore };