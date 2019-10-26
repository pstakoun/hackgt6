#!/bin/bash
# Compile protobufs for the different languages
grpc_tools_node_protoc --js_out=import_style=commonjs,binary:../server/grpc/ --grpc_out=../server/grpc --plugin=protoc-gen-grpc=`which grpc_tools_node_protoc_plugin` sms.proto
python -m grpc_tools.protoc -I./ --python_out=../sms --grpc_python_out=../sms ./sms.proto