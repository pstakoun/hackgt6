const grpc = require('grpc');
const messages = require('./sms_pb');
const services = require('./sms_grpc_pb');

let client;

function initGRPC() {
  try {
    console.log('Attempting to connect to sms.default.svc.cluster.local:50051');
    client = new services.SMSServiceClient('sms.default.svc.cluster.local:50051',
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
  console.log('creating request');
  return new Promise((resolve, reject) => {
    client.createGroupInvite(request, (err, response) => {
      // right now the response is not being handled.
      // TODO(Drake): Actually fucking implement it.
      if (err) {
        console.error(err);
        reject(err);
      }
      if (response) {
        resolve(response.getInvitesList());
      } else {
        console.error('No response from GRPC');
        reject(new Error('No GRPC response'));
      }
    });
  });
}

initGRPC();
exports.createGroupInvite = createGroupInvite;
