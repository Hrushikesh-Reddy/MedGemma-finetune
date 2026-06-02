import base64, asyncio
from .aws_s3 import get_files
from ollama import AsyncClient
import requests

client = AsyncClient()

async def generate(input):
    #messages = [{
       # "role": "user", 
       # "content": f"{input.get("prompt")}",               
   # }]
    message = [{
        "role":"user",
        "content":input.get("prompt")
    }]
    #if input["image"]:
     #   res = get_files(input["image"])
      #  image_bytes = res["Body"].read()
       # image_base64 = base64.b64encode(image_bytes).decode("utf-8")
        #message["image"] = input["image"]
        
    response = await client.chat(
        model="gemma4:31b-cloud",
        #model="glm-5:cloud",
        #model='hf.co/unsloth/medgemma-4b-it-GGUF:UD-Q5_K_XL', 
        #model="hf.co/Hrushikesh-0000/medgemma-4b-it-MRI6k-merged-GGUF:Q4_K_M",
        messages=message, 
        stream=True)
    #print(type(response), response)
    return response 
    #async for chunk in response:
        #print(chunk)
     
#res = asyncio.run(generate({"prompt":"Hello, what is 2x2 ?"}))

async def generate_session_name(prompt: str):
    messages = [
         {"role": "system", "content": "Generate a short session name within 50 characters, don't give any explanation"},
         {"role": "user", "content": f"{prompt}"}
    ]
        
    response = await client.chat(
        model="glm-4.6:cloud",
        #model='hf.co/unsloth/medgemma-4b-it-GGUF:UD-Q5_K_XL', 
        #model="hf.co/Hrushikesh-0000/medgemma-4b-it-MRI6k-merged-GGUF:Q4_K_M",
        messages=messages, )
    #print(type(response), response)
    return response.message.content 
