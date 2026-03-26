import http.client

conn = http.client.HTTPSConnection("dev-m8md7je12nteuapn.us.auth0.com")

payload = "{\"client_id\":\"R5ma6tNvicHPn6W7JNalBzTkpqnMZuKB\",\"client_secret\":\"QrYVX1CCmbqcgLfhjD_qRfr0i1J95OQTdur0DV1n0UCmgOMh87U731oLD6uc-exT\",\"audience\":\"http://localhost:8000\",\"grant_type\":\"client_credentials\"}"

headers = { 'content-type': "application/json" }

conn.request("POST", "/oauth/token", payload, headers)

res = conn.getresponse()
data = res.read()

print(data.decode("utf-8"))

""" 

{
    "access_token":"eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlZKSjI0UVRMTFZmZG0zRnFVMnFBeiJ9.eyJpc3MiOiJodHRwczovL2Rldi1tOG1kN2plMTJudGV1YXBuLnVzLmF1dGgwLmNvbS8iLCJzdWIiOiJSNW1hNnROdmljSFBuNlc3Sk5hbEJ6VGtwcW5NWnVLQkBjbGllbnRzIiwiYXVkIjoiaHR0cDovL2xvY2FsaG9zdDo4MDAwIiwiaWF0IjoxNzczOTI5OTY2LCJleHAiOjE3NzQwMTYzNjYsInNjb3BlIjoicmVhZDptZXNzYWdlcyB3cml0ZTptZXNzYWdlcyIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyIsImF6cCI6IlI1bWE2dE52aWNIUG42VzdKTmFsQnpUa3Bxbk1adUtCIn0.kNPogmsVn_ZFTz8oC90Cw2ivnCrTdszwprqXheCYl88d2Z1Y41aBalHBMQuOHfNYi_aU8kPpySU1JJKr3P_6_X-vmApY21oDYwMWjkSRFBtnzetIWCLDqNkVowG3g2-6EJoVhf5Iu97hTx1NpkmiKJwtpczw6O2j0FHbCVu9b--gUrIfVHQvK10_SZ2DVUWw9HYp_sodv5FB8iS0C9RHXnCHf4aZl-7b9HqkXLIZbRWKKJMps52Zgen0o3-3uqYUpjEjkRruKbenZi21wdU-Mu806AkUIa3meug1P2mRFdkjG-Y_YdbmNvp2GRfBj-y587yPtrGyFdJ1ZWLi31Ox8A",
    "scope":"read:messages write:messages","expires_in":86400,
    "token_type":"Bearer"
}


"""