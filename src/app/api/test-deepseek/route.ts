import { respData, respErr } from "@/lib/resp";
import OpenAI from "openai";

export async function GET() {
  try {
    const apiKey = process.env.DEEPSEEK_API_KEY || "sk-69b181b15ee94c54877dee0b05868801";
    
    if (!apiKey) {
      return respErr("DeepSeek API key not configured");
    }

    console.log("Testing DeepSeek API...");
    console.log("API Key exists:", !!apiKey);
    console.log("API Key prefix:", apiKey.substring(0, 10) + "...");

    const deepseekClient = new OpenAI({
      apiKey: apiKey,
      baseURL: "https://api.deepseek.com/v1",
    });

    const response = await deepseekClient.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "user",
          content: "请简单回复'测试成功'"
        }
      ],
      max_tokens: 50,
    });

    const result = response.choices[0]?.message?.content;
    
    if (!result) {
      return respErr("No response from DeepSeek API");
    }

    return respData({ 
      message: "DeepSeek API 配置成功!",
      response: result,
      apiKeyExists: !!apiKey
    });
    
  } catch (error: any) {
    console.error("DeepSeek API test error:", error);
    return respErr(`API 测试失败: ${error.message}`);
  }
} 