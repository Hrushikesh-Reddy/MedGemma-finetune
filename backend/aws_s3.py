import boto3, uuid #os, dotenv
from .config import settings
#dotenv.load_dotenv()
# Let's use Amazon S3
s3 = boto3.client(
    service_name="s3",
    region_name= settings.AWS_BUCKET_REGION,#os.environ.get("AWS_BUCKET_REGION"),
    aws_access_key_id=settings.AWS_ACCESS_KEY,#os.environ.get("AWS_ACCESS_KEY"),#
    aws_secret_access_key=settings.AWS_SECRET_KEY#os.environ.get("AWS_SECRET_KEY"),#,
)

def generate_upload_url(user_id: str, filename: str):
    ext = filename.split(".")[-1]
    key = f"uploads/{user_id}/{uuid.uuid4()}.{ext}"
    
    url = s3.generate_presigned_url(
        "put_object",
        Params={
            "Bucket" : settings.AWS_BUCKET_NAME,
            "Key" : key
            },
        ExpiresIn=400
    )
    
    return {
        "url":url,
        "Key":key
    }

def get_files(key: str):
    res = s3.get_object(
        Key=key,
        Bucket = settings.AWS_BUCKET_NAME # os.environ.get("AWS_BUCKET_NAME")#
    )
    #print(res)
    return res

#get_files("uploads/user_id/acb2a9bd-3266-47a0-8165-6ba94449088a.png")



# Print out bucket names
""" res = s3.list_buckets()

print(res.get("Buckets")) """

""" res = s3.put_object(Body=open("./Screenshot 2026-02-12 213129.png", "rb"), Bucket=os.environ.get("AWS_BUCKET_NAME"), Key="uploads/u1/1.png")
print(res) """