from flask import Flask, redirect, url_for, session, request
from google_auth_oauthlib.flow import Flow
import os
import pathlib

app = Flask(__name__)
app.secret_key = "your_secret_key_here"  # Replace with a real secret key

# OAuth 2.0 client config (replace with your real values)
GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID"
GOOGLE_CLIENT_SECRET = "YOUR_GOOGLE_CLIENT_SECRET"

os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"  # For testing only (HTTP)
GOOGLE_DISCOVERY_URL = "https://accounts.google.com/.well-known/openid-configuration"

@app.route("/")
def index():
    return "Welcome to MediLong Google Login!"

@app.route("/login")
def login():
    flow = Flow.from_client_config(
        {
            "web": {
                "client_id": GOOGLE_CLIENT_ID,
                "client_secret": GOOGLE_CLIENT_SECRET,
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
                "redirect_uris": ["http://localhost:5000/callback"],
                "scopes": ["https://www.googleapis.com/auth/userinfo.email", "openid"]
            }
        },
        scopes=["https://www.googleapis.com/auth/userinfo.email", "openid"],
        redirect_uri="http://localhost:5000/callback"
    )

    authorization_url, state = flow.authorization_url()
    session["state"] = state
    return redirect(authorization_url)

@app.route("/callback")
def callback():
    state = session["state"]
    flow = Flow.from_client_config(
        {
            "web": {
                "client_id": GOOGLE_CLIENT_ID,
                "client_secret": GOOGLE_CLIENT_SECRET,
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
                "redirect_uris": ["http://localhost:5000/callback"],
                "scopes": ["https://www.googleapis.com/auth/userinfo.email", "openid"]
            }
        },
        scopes=["https://www.googleapis.com/auth/userinfo.email", "openid"],
        state=state,
        redirect_uri="http://localhost:5000/callback"
    )

    flow.fetch_token(authorization_response=request.url)

    credentials = flow.credentials
    session["credentials"] = credentials_to_dict(credentials)

    from googleapiclient.discovery import build
    oauth2_client = build('oauth2', 'v2', credentials=credentials)
    user_info = oauth2_client.userinfo().get().execute()

    return f"Logged in as: {user_info['email']}"

def credentials_to_dict(credentials):
    return {
        'token': credentials.token,
        'refresh_token': credentials.refresh_token,
        'token_uri': credentials.token_uri,
        'client_id': credentials.client_id,
        'client_secret': credentials.client_secret,
        'scopes': credentials.scopes
    }

if __name__ == "__main__":
    app.run(debug=True)
