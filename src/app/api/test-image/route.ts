import { experimental_generateImage as generateImage } from "ai";
import { replicate } from "@ai-sdk/replicate";

export async function GET() {
  try {
    console.log("开始测试图像生成...");
    
    // 简单的测试提示词
    const prompt = "A simple tarot card with The Hermit, mystical art style, golden frame";
    
    // 使用Replicate的Stable Diffusion模型
    const imageModel = replicate.image("stability-ai/stable-diffusion:db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf");
    
    const { images, warnings } = await generateImage({
      model: imageModel,
      prompt: prompt,
      n: 1,
      providerOptions: {
        replicate: {
          width: 512,
          height: 896,
          num_inference_steps: 20, // 减少步数以加快测试
          guidance_scale: 7.5,
          seed: 12345, // 固定种子以便调试
        },
      },
    });

    if (warnings.length > 0) {
      console.log("生成图像警告:", warnings);
    }

    if (!images || images.length === 0) {
      return Response.json({ error: "No images generated" }, { status: 500 });
    }

    const image = images[0];
    
    // 直接返回base64图像
    return Response.json({
      success: true,
      imageBase64: image.base64,
      prompt: prompt
    });

  } catch (err) {
    console.error("测试图像生成失败:", err);
    return Response.json({ 
      error: "Failed to generate test image",
      details: err instanceof Error ? err.message : "Unknown error"
    }, { status: 500 });
  }
}





