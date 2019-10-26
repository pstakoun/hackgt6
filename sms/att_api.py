"""Fuck AT&T

TODO: Probably handling errors is a good idea.
Handling errors is a good practice in general, but especially important
when dealing with ass goblins like AT&T.
"""
import requests

APP_KEY = 'PENIS'
APP_SECRET = 'APE'

API_SCOPES = 'SMS'

access_token = ''
refresh_token = ''


def get_access_token():
    """This also returns expires_in"""
    response = requests.post('https://api.att.com/oauth/v4/token',
                             headers={'Accept': 'application/json'},
                             data={
                                 'client_id': f'{APP_KEY}',
                                 'client_secret': f'{APP_SECRET}',
                                 'grant_type': 'client_credentials',
                                 'scope': f'{API_SCOPES}'
                             })
    json_response = response.json()
    global access_token
    access_token = json_response.access_token
    global refresh_token
    refresh_token = json_response.refresh_token


def send_message(phone_number, message):
    if not access_token:
        get_access_token()
    response = requests.post('https://api.att.com/sms/v3/messaging/outbox',
                             headers={'Accept': 'application/json',
                                      'Content-Type': 'application/json',
                                      'Authorization': f'Bearer {access_token}'},
                             data={'outboundSMSRequest': {
                                 'address': phone_number,
                                 'message': message
                             }}
                             )
