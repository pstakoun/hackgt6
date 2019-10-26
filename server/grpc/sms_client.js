const grpc = require('grpc');
const messages = require('./sms_pb');
const services = require('./sms_grpc_pb');

function main() {
  const client = new services.SMSServiceClient('localhost:50051',
    grpc.credentials.createInsecure());

  const request = new messages.GroupInvite();
  request.setInvitePhoneNumList(['123', '333']);
  request.setBody('yo join my app');
  request.setPlaylistId('1');
  client.createGroupInvite(request, (err, response) => {
    console.log(response.getTokenId());
  });
}

main();
