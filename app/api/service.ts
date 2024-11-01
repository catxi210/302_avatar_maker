import ky from "ky";

/**
 * main_face_image: 上传图片(必须)
 * Upload image (required)
 * 
 * prompt: 提示词
 * Prompt text
 * 
 * width: 图片宽度，默认值896
 * Image width, default: 896
 * 
 * height: 图片高度，默认值1152
 * Image height, default: 1152
 * 
 * num_steps: 设置去噪步数（1-20），默认值20
 * Set denoising steps (1-20), default: 20
 * 
 * start_step: 设置开始插入ID的时间步长（建议0-4，0为最高保真度，4为更高可编辑性），默认值：0
 * Set the timestep to start inserting ID (recommended 0-4, 0 for highest fidelity, 4 for more editability), default: 0
 * 
 * guidance_scale: 设置文字提示影响力指导尺度（1.0-10.0）
 * Set text prompt guidance scale (1.0-10.0)
 * 
 * id_weight: 设置ID图像影响力的权重（0.0-3.0）
 * Set weight of ID image influence (0.0-3.0)
 * 
 * num_outputs: 设置要生成的图像数量（1-4），默认值：1
 * Set number of images to generate (1-4), default: 1
 * 
 * negative_prompt: 输入负面提示以指定图像中应避免的内容
 * Input negative prompts to specify what to avoid in the image
 * 默认值："质量差、质量最差、文本、签名、水印、额外肢体、低分辨率、部分渲染的物体、变形或部分渲染的眼睛、变形、眼球变形、斜视、模糊"
 * Default: "bad quality, worst quality, text, signature, watermark, extra limbs, low resolution, partially rendered objects, deformed or partially rendered eyes, distortion, deformed eyeballs, strabismus, blur"
 * 
 * seed: 设置生成的随机种子（留空或 -1 表示随机）
 * Set generation random seed (empty or -1 for random)
 * 
 * true_cfg: 设置无分类器指导(CFG)比例。1.0使用标准CFG，而值>1.0则启用True CFG，以更精确地控制生成。更高的值会增加对提示的遵守，但会以图像质量为代价。默认值：1
 * Set classifier-free guidance (CFG) ratio. 1.0 uses standard CFG, while values >1.0 enable True CFG for more precise control over generation. Higher values increase prompt adherence at the cost of image quality. Default: 1
 * 
 * max_sequence_length: 设置提示的最大序列长度（T5），越小越快（128-512），默认值：128
 * Set maximum sequence length for prompts (T5), smaller is faster (128-512), default: 128
 * 
 * output_format: 选择输出图像的格式，默认值："webp"
 * Choose output image format, default: "webp"
 * 
 * output_quality: 设置jpg和webp的输出图像质量（1-100），默认值：80
 * Set output image quality for jpg and webp (1-100), default: 80
 */
interface IPrams {
  main_face_image: string;
  prompt?: string
  width?: number;
  height?: number;
  num_steps?: number;
  start_step?: number;
  guidance_scale?: number;
  id_weight?: number;
  num_outputs?: number;
  negative_prompt?: string;
  seed?: number;
  true_cfg?: number;
  max_sequence_length?: number;
  output_format?: number;
  output_quality?: number;
}
export const generate = async (params: IPrams) => {
  return ky(`${process.env.NEXT_PUBLIC_API_URL}/302/submit/flux-selfie`, {
    method: 'post',
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "Apifox/1.0.0 (https://apifox.com)",
      "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`
    },
    body: JSON.stringify(params),
    timeout: false,
  }).then(res => res.json())
    .then(res => {
      return res;
    })
    .catch(async error => {
      console.log(error.options.body);
      if (error.response) {
        try {
          const errorData = await error.response.json();
          return errorData
        } catch (parseError) {
          return { error: parseError }
        }
      } else {
        return { error: error.message || 'Unknown error', }
      }
    })
}
