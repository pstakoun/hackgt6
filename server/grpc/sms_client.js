const grpc = require('grpc');
const messages = require('./sms_pb');
const services = require('./sms_grpc_pb');

let client;

function initGRPC() {
  try {
    client = new services.SMSServiceClient('127.0.0.1:50051',
      grpc.credentials.createInsecure());
    console.log('connected');
  } catch (e) {
    console.warn('Unable to connect to the SMS microservice.');
  }
}

/**
 * Invite a list of phone numbers via SMS
 * @param playlistId
 * @param messageBodyContent
 * @param phoneNumberList
 */
function createGroupInvite(messageBodyContent, phoneNumberList) {
  const request = new messages.GroupInvite();
  request.setInvitePhoneNumList(phoneNumberList);
  request.setBody(messageBodyContent);
  return new Promise((resolve, reject) => {
    client.createGroupInvite(request, (err, response) => {
      // right now the response is not being handled.
      // TODO(Drake): Actually fucking implement it.
      if (err) {
        console.error(err);
        reject(err);
      }
      resolve(response.getInvitesList());
    });
  });
}

initGRPC();
exports.createGroupInvite = createGroupInvite;
