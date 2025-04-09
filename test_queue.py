import asyncio
import aiohttp
import json
from datetime import datetime

async def submit_request(session, i):
    url = "http://localhost:7000/v1/audio/speech"
    data = {
        "input": "I'm fine. How are you?",
        "voice": "ash",
        "response_format": "mp3"
    }
    
    start_time = datetime.now()
    print(f"Submitting request {i} at {start_time}")
    
    try:
        async with session.post(url, json=data) as response:
            if response.status == 200:
                # For successful responses, we'll get audio data
                audio_data = await response.read()
                end_time = datetime.now()
                duration = (end_time - start_time).total_seconds()
                print(f"Request {i} completed in {duration:.2f} seconds")
                print(f"Received audio data of length: {len(audio_data)} bytes")
            else:
                error_data = await response.json()
                print(f"Request {i} failed with status {response.status}: {error_data}")
    except Exception as e:
        print(f"Request {i} failed: {str(e)}")

async def main():
    async with aiohttp.ClientSession() as session:
        tasks = [submit_request(session, i) for i in range(1, 2)]
        await asyncio.gather(*tasks)

if __name__ == "__main__":
    asyncio.run(main()) 