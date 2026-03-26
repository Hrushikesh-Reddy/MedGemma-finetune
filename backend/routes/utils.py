import io
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from ..aws_s3 import generate_upload_url, get_files


router = APIRouter()

@router.get("/upload/")
async def generate_url(user_id: str, filename: str):
   res = generate_upload_url(user_id, filename)
   return res

@router.get("/image/")
async def get_image(Key: str):
    res = get_files(Key)
    image_bytes = res["Body"].read()
    return StreamingResponse(
        io.BytesIO(image_bytes),
        media_type="image/png"
    )