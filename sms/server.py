"""GRPC server for the SMS service"""
import sms_pb2_grpc
import sms_pb2
from google.protobuf.timestamp_pb2 import Timestamp
from concurrent import futures
import grpc

def create_token(playlist_id, body, phone_nums):
    return '69'

class SMSServer(sms_pb2_grpc.SMSServiceServicer):
    def CreateGroupInvite(self, request, context):
        """Handler for group invitation."""
        token = create_token(request.playlist_id, request.body, request.invite_phone_num)
        print('WUT!')
        timestamp = Timestamp()
        timestamp.GetCurrentTime()
        print(timestamp)
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
