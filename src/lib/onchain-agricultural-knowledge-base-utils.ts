import { type Address } from 'viem';

/**
 * Onchain Agricultural Knowledge Base utilities
 * Share agricultural knowledge onchain
 */

export interface KnowledgeArticle {
  id: bigint;
  author: Address;
  title: string;
  content: string;
  category: 'crop-management' | 'pest-control' | 'irrigation' | 'soil-health' | 'harvesting' | 'general';
  tags: string[];
  upvotes: number;
  downvotes: number;
  views: number;
  createdAt: bigint;
  updatedAt: bigint;
  status: 'draft' | 'published' | 'archived';
}

export function createKnowledgeArticle(
  author: Address,
  title: string,
  content: string,
  category: KnowledgeArticle['category'],
  tags: string[]
): KnowledgeArticle {
  const now = BigInt(Date.now());
  return {
    id: BigInt(0),
    author,
    title,
    content,
    category,
    tags,
    upvotes: 0,
    downvotes: 0,
    views: 0,
    createdAt: now,
    updatedAt: now,
    status: 'draft',
  };
}

export function publishArticle(article: KnowledgeArticle): KnowledgeArticle {
  return {
    ...article,
    status: 'published',
    updatedAt: BigInt(Date.now()),
  };
}

export function upvoteArticle(article: KnowledgeArticle): KnowledgeArticle {
  return {
    ...article,
    upvotes: article.upvotes + 1,
  };
}

export function downvoteArticle(article: KnowledgeArticle): KnowledgeArticle {
  return {
    ...article,
    downvotes: article.downvotes + 1,
  };
}

export function viewArticle(article: KnowledgeArticle): KnowledgeArticle {
  return {
    ...article,
    views: article.views + 1,
  };
}

export function calculateArticleScore(article: KnowledgeArticle): number {
  const voteScore = article.upvotes - article.downvotes;
  const viewBonus = Math.min(article.views / 100, 10);
  return voteScore + viewBonus;
}

export function searchArticles(
  articles: KnowledgeArticle[],
  query: string,
  category?: KnowledgeArticle['category']
): KnowledgeArticle[] {
  let filtered = articles.filter((a) => a.status === 'published');
  
  if (category) {
    filtered = filtered.filter((a) => a.category === category);
  }
  
  if (query) {
    const lowerQuery = query.toLowerCase();
    filtered = filtered.filter(
      (a) =>
        a.title.toLowerCase().includes(lowerQuery) ||
        a.content.toLowerCase().includes(lowerQuery) ||
        a.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
  }
  
  return filtered.sort((a, b) => calculateArticleScore(b) - calculateArticleScore(a));
}

