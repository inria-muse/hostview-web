#!/bin/bash
set -e

echo "Hostview Web starting in '$NODE_ENV' environment"

if [[ $TEST && ${TEST-x} ]] ; then
    echo "Running all tests ..."
    exec npm test
else
    exec npm start
fi
