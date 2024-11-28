import { User } from '@/types/user.ts';
import { getRelevanceScore } from '@/utils/get-relevance-score.ts';

const findRelevantUsers = (
  query: string,
  users: User[] | null
): User[] | [] => {
  if (!query || !users) return [];

  return users
    .map(user => ({
      user,
      score: getRelevanceScore(query, user),
    }))
    .filter(item => item.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score || a.user.first_name.localeCompare(b.user.first_name)
    )
    .slice(0, 5)
    .map(item => item.user);
};

export { findRelevantUsers };
