import { db } from "@/database";
import {
  customerWallets,
  usageRecords,
  rateLimits,
  users,
} from "@/database/schema";
import { eq, and, gte } from "drizzle-orm";

export interface UsageOperation {
  userId: string;
  operationType: string;
  cost: number;
  tokensUsed?: number;
  metadata?: Record<string, unknown>;
}

export interface WalletInfo {
  balance: number;
  totalSpent: number;
  totalEarned: number;
  currency: string;
}

export interface RateLimitConfig {
  requestsPerMinute: number;
  requestsPerDay: number;
  monthlyTokenLimit: number;
  concurrentRequests: number;
}

export class CustomerService {
  // Get or create wallet for a user
  static async getOrCreateWallet(userId: string): Promise<WalletInfo> {
    let wallet = await db
      .select()
      .from(customerWallets)
      .where(eq(customerWallets.userId, userId));

    if (wallet.length === 0) {
      const created = await db
        .insert(customerWallets)
        .values({
          userId,
          balance: "0",
          currency: "usd",
          totalSpent: "0",
          totalEarned: "0",
        })
        .returning();

      wallet = created;
    }

    return {
      balance: parseFloat(wallet[0].balance),
      totalSpent: parseFloat(wallet[0].totalSpent),
      totalEarned: parseFloat(wallet[0].totalEarned),
      currency: wallet[0].currency,
    };
  }

  // Add credit to wallet
  static async addCredit(userId: string, amount: number): Promise<void> {
    await db
      .update(customerWallets)
      .set({
        balance: db.sql`balance + ${amount}`,
        totalEarned: db.sql`total_earned + ${amount}`,
        updatedAt: new Date(),
      })
      .where(eq(customerWallets.userId, userId));
  }

  // Deduct from wallet (usage)
  static async deductUsage(operation: UsageOperation): Promise<void> {
    // Record usage
    await db.insert(usageRecords).values({
      userId: operation.userId,
      operationType: operation.operationType,
      cost: operation.cost.toString(),
      tokensUsed: operation.tokensUsed || 0,
      metadata: operation.metadata,
    });

    // Deduct from wallet
    await db
      .update(customerWallets)
      .set({
        balance: db.sql`balance - ${operation.cost}`,
        totalSpent: db.sql`total_spent + ${operation.cost}`,
        updatedAt: new Date(),
      })
      .where(eq(customerWallets.userId, operation.userId));
  }

  // Check if user has sufficient balance
  static async hasSufficientBalance(
    userId: string,
    requiredAmount: number,
  ): Promise<boolean> {
    const wallet = await CustomerService.getOrCreateWallet(userId);
    return wallet.balance >= requiredAmount;
  }

  // Get usage statistics for a user
  static async getUsageStats(
    userId: string,
    days: number = 30,
  ): Promise<Record<string, unknown>> {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - days);

    const stats = await db
      .select()
      .from(usageRecords)
      .where(
        and(
          eq(usageRecords.userId, userId),
          gte(usageRecords.timestamp, pastDate),
        ),
      );

    const grouped = stats.reduce(
      (acc: Record<string, unknown>, record) => {
        const type = record.operationType;
        if (!acc[type]) {
          acc[type] = { count: 0, totalCost: 0, totalTokens: 0 };
        }
        const stat = acc[type] as Record<string, number>;
        stat.count += 1;
        stat.totalCost += parseFloat(record.cost);
        stat.totalTokens += record.tokensUsed;
        return acc;
      },
      {},
    );

    return grouped;
  }

  // Get or create rate limits for user
  static async getOrCreateRateLimit(
    userId: string,
    planId?: string,
  ): Promise<RateLimitConfig> {
    let limit = await db
      .select()
      .from(rateLimits)
      .where(eq(rateLimits.userId, userId));

    if (limit.length === 0) {
      const created = await db
        .insert(rateLimits)
        .values({
          userId,
          planId,
          requestsPerMinute: 100,
          requestsPerDay: 10000,
          monthlyTokenLimit: 1000000,
          concurrentRequests: 10,
        })
        .returning();

      limit = created;
    }

    return {
      requestsPerMinute: limit[0].requestsPerMinute,
      requestsPerDay: limit[0].requestsPerDay,
      monthlyTokenLimit: limit[0].monthlyTokenLimit,
      concurrentRequests: limit[0].concurrentRequests,
    };
  }

  // Update rate limits (admin only)
  static async updateRateLimit(
    userId: string,
    updates: Partial<RateLimitConfig>,
  ): Promise<void> {
    await db
      .update(rateLimits)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(rateLimits.userId, userId));
  }

  // Get monthly token usage
  static async getMonthlyTokenUsage(userId: string): Promise<number> {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const records = await db
      .select()
      .from(usageRecords)
      .where(
        and(
          eq(usageRecords.userId, userId),
          gte(usageRecords.timestamp, monthStart),
        ),
      );

    return records.reduce((sum, record) => sum + record.tokensUsed, 0);
  }

  // Check if monthly token limit exceeded
  static async hasExceededMonthlyLimit(userId: string): Promise<boolean> {
    const monthlyUsed = await CustomerService.getMonthlyTokenUsage(userId);
    const config = await CustomerService.getOrCreateRateLimit(userId);
    return monthlyUsed > config.monthlyTokenLimit;
  }
}
