"""GRPC server for the SMS service"""
import sms_pb2_grpc
import sms_pb2
import att_api

from google.protobuf.timestamp_pb2 import Timestamp
import grpc

import uuid
from datetime import datetime, timedelta
from concurrent import futures


def send_sms_request(body, phone_nums):
    invites = []
    for phone_num in phone_nums:
        # Generates a unique ID for the invite code
        invite_token = uuid.uuid4().hex[:8]
        # TODO(Drake): Eventually do this in a try catch for error handling
        att_api.send_message(phone_num, f'{body} http://mixtape.fratstar.org/invite/join/{invite_token}')
        invite_proto = sms_pb2.InviteToken(phone_number=phone_num, token_id=invite_token, expiration=generate_expiration())
        invites.append(invite_proto)
    return invites


def generate_expiration():
    """Generates the expiration date. Can be modified in the future to take a parameter.
    Default for now will be 24 hours"""
    tomorrow = datetime.now() + timedelta(hours=24)
    timestamp = Timestamp()
    return timestamp.FromDatetime(tomorrow)


class SMSServer(sms_pb2_grpc.SMSServiceServicer):
    def CreateGroupInvite(self, request, context):
        """Handler for group invitation."""
        invites = send_sms_request(request.body, request.invite_phone_num)
        return sms_pb2.InviteResponse(invites=invites)


def serve():
    print('Starting SMS Microservice.')
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    sms_pb2_grpc.add_SMSServiceServicer_to_server(SMSServer(), server)
    server.add_insecure_port('localhost:50051')
    server.start()
    server.wait_for_termination()


if __name__ == '__main__':
    serve()
