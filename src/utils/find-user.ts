import {User} from "@/types/user.ts";
import { getRelevanceScore } from "@/utils/get-relevance-score.ts";

const findRelevantUsers = (query: string, users: User[] | null) => {
    if (!query || !users) return [];

    return users
        .map((user) => ({
            user,
            score: getRelevanceScore(query, user),
        }))
        .filter((item) => item.score > 0) // Only include matching users
        .sort((a, b) => b.score - a.score || a.user.first_name.localeCompare(b.user.first_name)) // Sort by score, then alphabetically
        .slice(0, 5) // Limit to top 5
        .map((item) => item.user); // Return the user objects
};

export { findRelevantUsers };