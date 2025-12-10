import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  console.warn("OPENAI_API_KEY が設定されていません。AI 解析は動作しません。");
}

export function createOpenAIClient() {
  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY が未設定のため OpenAI クライアントを生成できません。"
    );
  }

  return new OpenAI({
    apiKey
  });
}

// Singleton instance for convenience
export const openai = apiKey ? new OpenAI({ apiKey }) : null;
