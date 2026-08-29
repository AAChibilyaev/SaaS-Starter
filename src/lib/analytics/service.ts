import { db } from "@/database";
import { usageRecords } from "@/database/schema";
import { eq, and, gte, lte, desc } from "drizzle-orm";

export interface AnalyticsData {
  totalRequests: number;
  totalCost: number;
  totalTokens: number;
  averageCostPerRequest: number;
  topOperations: Array<{
    type: string;
    count: number;
    cost: number;
  }>;
  costTrend: Array<{
    date: string;
    cost: number;
    requests: number;
  }>;
}

export class AnalyticsService {
  /**
   * Get analytics for a user over a period
   */
  static async getUserAnalytics(userId: string, days: number = 30): Promise<AnalyticsData> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const records = await db
      .select()
      .from(usageRecords)
      .where(
        and(
          eq(usageRecords.userId, userId),
          gte(usageRecords.timestamp, startDate)
        )
      )
      .orderBy(desc(usageRecords.timestamp));

    // Calculate metrics
    const totalRequests = records.length;
    const totalCost = records.reduce((sum, r) => sum + parseFloat(r.cost.toString()), 0);
    const totalTokens = records.reduce((sum, r) => sum + r.tokensUsed, 0);
    const averageCostPerRequest = totalRequests > 0 ? totalCost / totalRequests : 0;

    // Group by operation type
    const operationMap = new Map<
      string,
      { count: number; cost: number }
    >();

    records.forEach((record) => {
      const existing = operationMap.get(record.operationType) || { count: 0, cost: 0 };
      existing.count++;
      existing.cost += parseFloat(record.cost.toString());
      operationMap.set(record.operationType, existing);
    });

    const topOperations = Array.from(operationMap.entries())
      .map(([type, data]) => ({
        type,
        count: data.count,
        cost: data.cost,
      }))
      .sort((a, b) => b.cost - a.cost)
      .slice(0, 5);

    // Generate cost trend (group by day)
    const trendMap = new Map<string, { cost: number; requests: number }>();

    records.forEach((record) => {
      const date = record.timestamp.toISOString().split("T")[0];
      const existing = trendMap.get(date) || { cost: 0, requests: 0 };
      existing.cost += parseFloat(record.cost.toString());
      existing.requests++;
      trendMap.set(date, existing);
    });

    const costTrend = Array.from(trendMap.entries())
      .map(([date, data]) => ({
        date,
        cost: parseFloat(data.cost.toFixed(2)),
        requests: data.requests,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return {
      totalRequests,
      totalCost: parseFloat(totalCost.toFixed(2)),
      totalTokens,
      averageCostPerRequest: parseFloat(averageCostPerRequest.toFixed(4)),
      topOperations,
      costTrend,
    };
  }

  /**
   * Get analytics for all users (admin)
   */
  static async getGlobalAnalytics(days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const records = await db
      .select()
      .from(usageRecords)
      .where(gte(usageRecords.timestamp, startDate))
      .orderBy(desc(usageRecords.timestamp));

    const totalRequests = records.length;
    const totalCost = records.reduce((sum, r) => sum + parseFloat(r.cost.toString()), 0);
    const totalTokens = records.reduce((sum, r) => sum + r.tokensUsed, 0);

    // Unique users
    const uniqueUsers = new Set(records.map((r) => r.userId)).size;

    // Group by user
    const userMap = new Map<string, { requests: number; cost: number }>();
    records.forEach((record) => {
      const existing = userMap.get(record.userId) || { requests: 0, cost: 0 };
      existing.requests++;
      existing.cost += parseFloat(record.cost.toString());
      userMap.set(record.userId, existing);
    });

    const topUsers = Array.from(userMap.entries())
      .map(([userId, data]) => ({
        userId,
        requests: data.requests,
        cost: parseFloat(data.cost.toFixed(2)),
      }))
      .sort((a, b) => b.cost - a.cost)
      .slice(0, 10);

    return {
      totalRequests,
      totalCost: parseFloat(totalCost.toFixed(2)),
      totalTokens,
      uniqueUsers,
      topUsers,
      averageCostPerUser: uniqueUsers > 0 ? totalCost / uniqueUsers : 0,
    };
  }

  /**
   * Get high-usage users (for alerting)
   */
  static async getHighUsageUsers(threshold: number = 100, days: number = 30) {
    const analytics = await this.getGlobalAnalytics(days);

    return analytics.topUsers.filter((user) => user.cost >= threshold);
  }

  /**
   * Get low-balance users (for alerting)
   */
  static async getLowBalanceUsers(threshold: number = 5) {
    const lowBalanceUsers = await db
      .select({
        userId: usageRecords.userId,
        balance: usageRecords.cost, // This would need wallet join
      })
      .from(usageRecords)
      .where(lte(usageRecords.cost, threshold));

    return lowBalanceUsers;
  }
}
