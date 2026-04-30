import transformers.integrations.peft
from transformers import pipeline, AutoModelForImageTextToText, AutoProcessor
from PIL import Image
import torch, requests, gc, os, dotenv
from peft import PeftModel
from transformers.utils import logging
from huggingface_hub import login
from io import BytesIO
from s3 import get_files

logging.set_verbosity_error()
dotenv.load_dotenv()

class Llm:

    pipe = None
    processor = None
    
    def __init__(self):

        login(token=os.environ.get("HF_TOKEN"))

        # --- WORKAROUND: Bypass the PEFT MoE conversion bug ---
        if not hasattr(transformers.integrations.peft, "_MOE_TARGET_MODULE_MAPPING"):
            transformers.integrations.peft._MOE_TARGET_MODULE_MAPPING = {}
        transformers.integrations.peft._MOE_TARGET_MODULE_MAPPING['llava'] = {}
        # ------------------------------------------------------

        base_model_id = "google/medgemma-4b-it"
        lora_adapter_path = "Hrushikesh-0000/medgemma-4b-it-sft-lora-MRI6k"

        self.processor = AutoProcessor.from_pretrained(base_model_id)

        self.pipe = pipeline(
            "image-text-to-text",
            model=lora_adapter_path,
            processor=self.processor,
            device="cuda",
            dtype=torch.bfloat16,
        )

        # 2. Apply the exact same generation configs from your eval
        self.pipe.model.generation_config.do_sample = False
        self.pipe.model.generation_config.pad_token_id = self.processor.tokenizer.eos_token_id
        self.processor.tokenizer.padding_side = "left"


    #prompt = "What is the most likely tumor type shown in the mri image, answer in a sentence?\nA: glioma\nB: menin\nC: pitutary"
    #image = Image.open("../brain_menin_0018.jpg").convert("RGB")
    #print("from here : ", image)
    #image = Image.open("./brain_tumor_0007.jpg").convert("RGB")
#    messages=[
    
 #       {
  #          "role": "user",
   #         "content": [
    #            {"type": "text", "text": prompt},
     #           {"type": "image", "image": image}
      #      ]
       # }]

    def format_prompt(self, prompt):
        """
        {
        "text":"qwerty",
        "image":"bytes"
        } 
        """

        if prompt.get("image"):
            img_bytes = get_files(prompt.get("image"))
            img_bytes = img_bytes["Body"].read()
            img = Image.open(BytesIO(img_bytes)).convert("RGB")
            print(img)
            return [{
            "role": "user",
            "content": [
                {"type": "text", "text": prompt.get("text")},
                {"type": "image", "image": img}]}]
        
        
        return [{
            "role": "user",
            "content": [
                {"type": "text", "text": prompt.get("text")}
            ]}]

    async def generate(self, promptt):
        with torch.no_grad(): # Prevents memory-intensive gradient tracking
            ft_outputs = self.pipe(
                self.format_prompt(promptt),
                #self.messages,
                max_new_tokens=20,
                batch_size=64,
                return_full_text=True
            )
        return ft_outputs[0]['generated_text'][-1]

    def clear_memory(self):
        """Purges the model from VRAM"""
        if hasattr(self, 'pipe'):
            # Delete model and tokenizer references
            del self.pipe.model
            del self.pipe.tokenizer
            del self.pipe
        
        if hasattr(self, 'processor'):
            del self.processor

        # Force Python garbage collection
        gc.collect()

        # Clear PyTorch CUDA cache
        if torch.cuda.is_available():
            torch.cuda.empty_cache()
            torch.cuda.ipc_collect()
        
        print("VRAM cleared successfully.")