import base64
from .aws_s3 import get_files
from ollama import AsyncClient

client = AsyncClient()

async def generate(input):
    messages = [{
        "role": "user", 
        "content": f"{input.get("prompt")}",               
    }]
    
    if input["image"]:
        res = get_files(input["image"])
        image_bytes = res["Body"].read()
        image_base64 = base64.b64encode(image_bytes).decode("utf-8")
        messages[0]["images"] = [image_base64]
        
    response = await client.chat(
        model='hf.co/unsloth/medgemma-4b-it-GGUF:UD-Q5_K_XL', 
        #model="hf.co/Hrushikesh-0000/medgemma-4b-it-MRI6k-merged-GGUF:Q4_K_M",
        messages=messages, 
        stream=True)
    #print(type(response), response)
    return response 

async def generate_session_name(prompt: str):
    messages = [
         {"role": "system", "content": "Generate a short session name within 50 characters, don't give any explanation"},
         {"role": "user", "content": f"{prompt}"}
    ]
        
    response = await client.chat(
        model='hf.co/unsloth/medgemma-4b-it-GGUF:UD-Q5_K_XL', 
        #model="hf.co/Hrushikesh-0000/medgemma-4b-it-MRI6k-merged-GGUF:Q4_K_M",
        messages=messages, )
    #print(type(response), response)
    return response.message.content 
