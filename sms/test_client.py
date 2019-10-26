import grpc
import sms_pb2
import sms_pb2_grpc

def run():
    # NOTE(gRPC Python Team): .close() is possible on a channel and should be
    # used in circumstances in which the with statement does not fit the needs
    # of the code.
    with grpc.insecure_channel('localhost:50051') as channel:
        stub = sms_pb2_grpc.SMSServiceStub(channel)
        response = stub.CreateGroupInvite(sms_pb2.GroupInvite(playlist_id='420', body='hey dipshit, you are invited', invite_phone_num=['1','2','3']))
    print("Greeter client received: " + response.token_id)


if __name__ == '__main__':
    run()