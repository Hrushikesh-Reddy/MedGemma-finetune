import boto3, uuid, os, dotenv

dotenv.load_dotenv()
# Let's use Amazon S3
AWS_BUCKET_NAME=os.environ.get("AWS_BUCKET_NAME")
AWS_BUCKET_REGION=os.environ.get("AWS_BUCKET_REGION")
AWS_ACCESS_KEY=os.environ.get("AWS_ACCESS_KEY")
AWS_SECRET_KEY=os.environ.get("AWS_SECRET_KEY")

s3 = boto3.client(
    service_name="s3",
    region_name= AWS_BUCKET_REGION,#os.environ.get("AWS_BUCKET_REGION"),
    aws_access_key_id=AWS_ACCESS_KEY,#os.environ.get("AWS_ACCESS_KEY"),#
    aws_secret_access_key=AWS_SECRET_KEY#os.environ.get("AWS_SECRET_KEY"),#,
)

def get_files(key: str):
    res = s3.get_object(
        Key=key,
        Bucket = AWS_BUCKET_NAME # os.environ.get("AWS_BUCKET_NAME")#
    )
    #print(res)
    return res