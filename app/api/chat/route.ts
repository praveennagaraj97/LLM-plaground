import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { provider, model, apiKey, messages, systemPrompt } = body;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 400 }
      );
    }

    if (!model) {
      return NextResponse.json({ error: 'Model is required' }, { status: 400 });
    }

    if (provider === 'gemini') {
      const genAI = new GoogleGenAI({ apiKey });

      // Convert messages format for Gemini
      // Gemini expects contents array with role and parts
      const contents = messages.map(
        (msg: { role: string; content: string }) => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }],
        })
      );

      // Prepare config object
      const config: any = {};
      if (systemPrompt) {
        config.systemInstruction = systemPrompt;
      }

      // Use the new API structure
      const response = await genAI.models.generateContent({
        model,
        contents,
        config,
      });

      // Extract text from response
      // The response structure may vary, so we need to check the actual structure
      let text = '';
      if (response.text) {
        text = response.text;
      } else if (
        response.candidates &&
        response.candidates[0]?.content?.parts
      ) {
        text = response.candidates[0].content.parts
          .map((part: any) => part.text)
          .join('');
      } else if (typeof response === 'string') {
        text = response;
      }

      // Get token usage from the response
      // Check different possible locations for usage metadata
      const usageMetadata =
        (response as any).usageMetadata ||
        (response as any).usage?.metadata ||
        (response as any).usage;
      const tokenUsage = {
        promptTokenCount: usageMetadata?.promptTokenCount || 0,
        candidatesTokenCount: usageMetadata?.candidatesTokenCount || 0,
        totalTokenCount: usageMetadata?.totalTokenCount || 0,
      };

      return NextResponse.json({
        content: text,
        usage: tokenUsage,
      });
    }

    // Placeholder for GPT and Claude
    if (provider === 'gpt' || provider === 'claude') {
      return NextResponse.json(
        { error: `${provider} integration coming soon` },
        { status: 501 }
      );
    }

    return NextResponse.json({ error: 'Invalid provider' }, { status: 400 });
  } catch (error: any) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process chat request' },
      { status: 500 }
    );
  }
}
