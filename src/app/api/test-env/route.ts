import { respData, respErr } from "@/lib/resp";

export async function GET() {
  try {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    
    console.log("Environment check:");
    console.log("DEEPSEEK_API_KEY exists:", !!apiKey);
    console.log("DEEPSEEK_API_KEY value:", apiKey ? apiKey.substring(0, 10) + "..." : "undefined");
    
    return respData({
      message: "环境变量检查完成",
      apiKeyExists: !!apiKey,
      apiKeyPrefix: apiKey ? apiKey.substring(0, 10) + "..." : "undefined",
    });
    
  } catch (error: any) {
    console.error("Environment test error:", error);
    return respErr(`环境变量测试失败: ${error.message}`);
  }
} 