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
    # Generates a unique ID for the invite code
    invite_token = uuid.uuid4().hex[:8]

    for phone_num in phone_nums:
        att_api.send_message(phone_num, body + f'https://ape.ape/invite/${invite_token}')
    return invite_token


class SMSServer(sms_pb2_grpc.SMSServiceServicer):
    def CreateGroupInvite(self, request, context):
        """Handler for group invitation."""
        token = send_sms_request(request.body, request.invite_phone_num)
        tomorrow = datetime.now() + timedelta(hours=24)
        timestamp = Timestamp()
        timestamp.FromDatetime(tomorrow)
        return sms_pb2.InviteToken(
            token_id=token,
            expiration=timestamp
        )


def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    sms_pb2_grpc.add_SMSServiceServicer_to_server(SMSServer(), server)
    server.add_insecure_port('[::]:50051')
    server.start()
    server.wait_for_termination()


if __name__ == '__main__':
    serve()
