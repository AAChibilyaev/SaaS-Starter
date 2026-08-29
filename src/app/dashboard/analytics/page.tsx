import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AnalyticsService } from "@/lib/analytics/service";

export const metadata: Metadata = {
  title: "Analytics | AACSearch",
};

export default async function AnalyticsPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  const userId = session.user.id;
  const analytics = await AnalyticsService.getUserAnalytics(userId, 30);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-gray-600 mt-2">Usage trends and performance metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-sm font-medium text-gray-600">Total Requests</div>
          <div className="text-3xl font-bold mt-2">{analytics.totalRequests}</div>
          <div className="text-xs text-gray-500 mt-2">Last 30 days</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-sm font-medium text-gray-600">Total Cost</div>
          <div className="text-3xl font-bold mt-2">${analytics.totalCost.toFixed(2)}</div>
          <div className="text-xs text-gray-500 mt-2">
            ${analytics.averageCostPerRequest.toFixed(4)} avg/request
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-sm font-medium text-gray-600">Total Tokens</div>
          <div className="text-3xl font-bold mt-2">{analytics.totalTokens.toLocaleString()}</div>
          <div className="text-xs text-gray-500 mt-2">
            {Math.round(analytics.totalTokens / analytics.totalRequests)} avg/request
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-sm font-medium text-gray-600">Efficiency</div>
          <div className="text-3xl font-bold mt-2">
            {analytics.totalTokens > 0 ?
              (analytics.totalCost / (analytics.totalTokens / 1000)).toFixed(2)
            : '0'}
          </div>
          <div className="text-xs text-gray-500 mt-2">Cost per 1K tokens</div>
        </div>
      </div>

      {/* Top Operations */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-bold">Top Operations</h2>
        </div>
        <div className="divide-y">
          {analytics.topOperations.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              No data available
            </div>
          ) : (
            analytics.topOperations.map((op) => (
              <div key={op.type} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <div className="font-medium capitalize">{op.type}</div>
                  <div className="text-sm text-gray-600">{op.count} requests</div>
                </div>
                <div className="text-right">
                  <div className="font-bold">${op.cost.toFixed(2)}</div>
                  <div className="text-sm text-gray-600">
                    {((op.cost / analytics.totalCost) * 100).toFixed(1)}% of total
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Cost Trend */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-bold">Cost Trend (Last 30 Days)</h2>
        </div>
        <div className="p-6">
          {analytics.costTrend.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No data available
            </div>
          ) : (
            <div className="space-y-3">
              {analytics.costTrend.map((day) => (
                <div key={day.date} className="flex items-center gap-4">
                  <div className="w-32 text-sm">{day.date}</div>
                  <div className="flex-1 bg-gray-100 rounded h-8 flex items-center px-2">
                    <div
                      className="bg-blue-600 h-6 rounded flex items-center justify-end pr-2 text-white text-xs font-bold"
                      style={{
                        width: `${(day.cost / Math.max(...analytics.costTrend.map((d) => d.cost))) * 100}%`,
                      }}
                    >
                      ${day.cost.toFixed(2)}
                    </div>
                  </div>
                  <div className="w-20 text-right text-sm text-gray-600">
                    {day.requests} req
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Export Data */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="font-bold mb-3">Export Analytics</h3>
        <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
          Download as CSV
        </button>
      </div>
    </div>
  );
}
