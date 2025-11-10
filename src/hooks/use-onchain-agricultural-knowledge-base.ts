import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createKnowledgeArticle,
  publishArticle,
  upvoteArticle,
  downvoteArticle,
  viewArticle,
  calculateArticleScore,
  searchArticles,
  type KnowledgeArticle,
} from '@/lib/onchain-agricultural-knowledge-base-utils';

/**
 * Hook for onchain agricultural knowledge base operations
 * Requires Reown wallet connection via useAccount
 */
export function useOnchainAgriculturalKnowledgeBase() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [articles, setArticles] = useState<KnowledgeArticle[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const createArticle = async (
    title: string,
    content: string,
    category: KnowledgeArticle['category'],
    tags: string[]
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    setIsCreating(true);
    try {
      const article = createKnowledgeArticle(address, title, content, category, tags);
      setArticles((prev) => [...prev, article]);
      console.log('Creating knowledge article:', article);
      // Onchain article creation via smart contract
      await writeContract({
        address: '0x0000000000000000000000000000000000000000' as Address,
        abi: [],
        functionName: 'createKnowledgeArticle',
        args: [title, content, category, tags],
      });
    } finally {
      setIsCreating(false);
    }
  };

  const publishKnowledgeArticle = async (articleId: bigint): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    setIsPublishing(true);
    try {
      const article = articles.find((a) => a.id === articleId);
      if (!article) throw new Error('Article not found');
      const published = publishArticle(article);
      setArticles((prev) =>
        prev.map((a) => (a.id === articleId ? published : a))
      );
      console.log('Publishing knowledge article:', { articleId });
      // Onchain publishing via smart contract
      await writeContract({
        address: '0x0000000000000000000000000000000000000000' as Address,
        abi: [],
        functionName: 'publishKnowledgeArticle',
        args: [articleId],
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const upvoteKnowledgeArticle = async (articleId: bigint): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    try {
      const article = articles.find((a) => a.id === articleId);
      if (!article) throw new Error('Article not found');
      const updated = upvoteArticle(article);
      setArticles((prev) =>
        prev.map((a) => (a.id === articleId ? updated : a))
      );
      console.log('Upvoting knowledge article:', { articleId });
      // Onchain upvote via smart contract
      await writeContract({
        address: '0x0000000000000000000000000000000000000000' as Address,
        abi: [],
        functionName: 'upvoteKnowledgeArticle',
        args: [articleId],
      });
    } finally {
      // Upvote complete
    }
  };

  return {
    articles,
    createArticle,
    publishKnowledgeArticle,
    upvoteKnowledgeArticle,
    downvoteArticle,
    viewArticle,
    calculateArticleScore,
    searchArticles,
    isCreating,
    isPublishing,
    address,
  };
}

