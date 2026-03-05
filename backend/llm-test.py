import asyncio
from ollama import AsyncClient

async def chat_stream():
    messages = [{'role': 'user', 'content': 'Why is the sky blue?'}]
    # Set stream=True (optional in some newer SDK versions where it might be default for async calls)
    async for part in await AsyncClient().chat(model='hf.co/unsloth/medgemma-4b-it-GGUF:UD-Q5_K_XL', messages=messages, stream=True):
        print(part['message']['content'], end='', flush=True)

if __name__ == "__main__":
    asyncio.run(chat_stream())
