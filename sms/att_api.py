"""Fuck AT&T

TODO: Probably handling errors is a good idea.
Handling errors is a good practice in general, but especially important
when dealing with ass goblins like AT&T.
"""
import requests
import jwt


CLIENT_ID = 'PRIV-hackgt1.qt9t.yeehaw'
CLIENT_SECRET = 'd42a3eb0-f8bd-48ee-87b9-b5c5c4fe36a8'

access_token = ''
refresh_token = ''
user_id = ''


def get_access_token():
    """This also returns expires_in"""
    response = requests.post('https://oauth-cpaas.att.com/cpaas/auth/v1/token',
                             headers={'Accept': 'application/json',
                                      'Content-Type': 'application/x-www-form-urlencoded'},
                             data={
                                 'client_secret': CLIENT_SECRET,
                                 'client_id': CLIENT_ID,
                                 'grant_type': 'client_credentials',
                                 'scope': 'openid'
                             })
    json_response = response.json()
    global access_token
    access_token = json_response['access_token']
    global refresh_token
    refresh_token = json_response['refresh_token']

    id = json_response['id_token']
    decoded = jwt.decode(id, verify=False)
    global user_id
    user_id = decoded['preferred_username']


def send_message(phone_number, message):
    if not access_token:
        get_access_token()

    print(user_id)


    response = requests.post(f'https://oauth-cpaas.att.com/cpaas/smsmessaging/v1/{user_id}/outbound/+14044580498/requests',
                             headers={'Content-Type': 'application/json',
                                      'Authorization': f'Bearer {access_token}'},
                             json={'outboundSMSMessageRequest': {
                                 'address': [phone_number],
                                 'clientCorrelator': CLIENT_ID,
                                 'outboundSMSTextMessage': {
                                     'message': message
                                 }
                             }},
                             )
    print(response.json())
