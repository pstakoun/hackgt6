// GENERATED CODE -- DO NOT EDIT!


const grpc = require('grpc');
const google_protobuf_timestamp_pb = require('google-protobuf/google/protobuf/timestamp_pb.js');
const sms_pb = require('./sms_pb.js');

function serialize_hackgt6_GroupInvite(arg) {
  if (!(arg instanceof sms_pb.GroupInvite)) {
    throw new Error('Expected argument of type hackgt6.GroupInvite');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_hackgt6_GroupInvite(buffer_arg) {
  return sms_pb.GroupInvite.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_hackgt6_InviteToken(arg) {
  if (!(arg instanceof sms_pb.InviteToken)) {
    throw new Error('Expected argument of type hackgt6.InviteToken');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_hackgt6_InviteToken(buffer_arg) {
  return sms_pb.InviteToken.deserializeBinary(new Uint8Array(buffer_arg));
}


// Service responsible for sending and managing invite SMS messages.
const SMSServiceService = exports.SMSServiceService = {
  createGroupInvite: {
    path: '/hackgt6.SMSService/CreateGroupInvite',
    requestStream: false,
    responseStream: false,
    requestType: sms_pb.GroupInvite,
    responseType: sms_pb.InviteToken,
    requestSerialize: serialize_hackgt6_GroupInvite,
    requestDeserialize: deserialize_hackgt6_GroupInvite,
    responseSerialize: serialize_hackgt6_InviteToken,
    responseDeserialize: deserialize_hackgt6_InviteToken,
  },
};

exports.SMSServiceClient = grpc.makeGenericClientConstructor(SMSServiceService);
