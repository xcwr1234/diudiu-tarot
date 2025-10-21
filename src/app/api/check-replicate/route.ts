export async function GET() {
  try {
    // 检查环境变量
    const replicateApiKey = process.env.REPLICATE_API_TOKEN;
    
    console.log("检查环境变量:", {
      hasApiKey: !!replicateApiKey,
      apiKeyLength: replicateApiKey?.length || 0,
      apiKeyPrefix: replicateApiKey?.substring(0, 10) || "none"
    });
    
    if (!replicateApiKey) {
      return Response.json({
        error: "REPLICATE_API_TOKEN environment variable is not set",
        instructions: "Please add REPLICATE_API_TOKEN to your .env.local file"
      }, { status: 500 });
    }

    // 尝试导入Replicate
    let replicate;
    try {
      const replicateModule = await import("@ai-sdk/replicate");
      replicate = replicateModule.replicate;
      console.log("Replicate模块导入成功");
    } catch (importError) {
      console.error("导入Replicate模块失败:", importError);
      return Response.json({
        error: "Failed to import Replicate module",
        details: importError instanceof Error ? importError.message : "Unknown error"
      }, { status: 500 });
    }
    
    // 测试API连接
    try {
      const imageModel = replicate.image("stability-ai/stable-diffusion:db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf");
      console.log("Replicate模型初始化成功");
      
      return Response.json({
        success: true,
        message: "Replicate API is configured correctly",
        hasApiKey: !!replicateApiKey,
        apiKeyLength: replicateApiKey.length,
        apiKeyPrefix: replicateApiKey.substring(0, 10),
        model: "stable-diffusion available"
      });
    } catch (modelError) {
      console.error("Replicate模型初始化失败:", modelError);
      return Response.json({
        error: "Failed to initialize Replicate model",
        details: modelError instanceof Error ? modelError.message : "Unknown error",
        stack: modelError instanceof Error ? modelError.stack : undefined
      }, { status: 500 });
    }

  } catch (error) {
    console.error("检查Replicate配置失败:", error);
    return Response.json({
      error: "Failed to check Replicate configuration",
      details: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
