import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  try {
    const { messages, userMessage } = await request.json();

    const systemPrompt = `You are an intelligent search assistant for AACSearch - an advanced semantic search platform.
Your role is to:
1. Help users formulate better search queries
2. Suggest relevant search refinements
3. Explain search results and patterns
4. Provide tips for finding exactly what they're looking for

When users ask about their data, provide concise, helpful responses and suggest optimized search queries.
Always be friendly and professional.

If the user's message could be converted to a search query, include a "suggestedQuery" in your response.
Format your response as JSON with:
- response: Your conversational response
- suggestedQuery: (optional) A suggested search query based on the user's question`;

    const conversationHistory = messages
      .map(
        (msg: { role: string; content: string }) =>
          `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`
      )
      .join("\n");

    const prompt = `${conversationHistory}\nUser: ${userMessage}\nAssistant:`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": process.env.ANTHROPIC_API_KEY || "",
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 500,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.statusText}`);
    }

    const data = await response.json();
    const assistantResponse =
      data.content[0]?.type === "text" ? data.content[0].text : "";

    let suggestedQuery: string | undefined;
    try {
      const jsonMatch = assistantResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        suggestedQuery = parsed.suggestedQuery;
      }
    } catch {
      // If no JSON found, just use the response as-is
    }

    return Response.json({
      response: assistantResponse,
      suggestedQuery,
    });
  } catch (error) {
    console.error("Search assist error:", error);
    return Response.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
