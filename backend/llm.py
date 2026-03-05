from ollama import AsyncClient

client = AsyncClient()

async def generate(input):
    messages = [{
        "role": "user", 
        "content": f"{input.prompt}",               
    }]
    
    """ if input.image:
        messages[0]["images"] = f"{input.image}" """
        
    response = await client.chat(
        model='hf.co/unsloth/medgemma-4b-it-GGUF:UD-Q5_K_XL', 
        messages=messages, 
        stream=True)
    print(type(response), response)
    return response