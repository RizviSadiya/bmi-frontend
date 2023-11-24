#!/bin/bash
set -e
cd /var/www/html/auto-deploy/bmi-front-end
npm install
if [ "$DEPLOYMENT_GROUP_NAME" == "BMIProdDeploymentGroup" ]
then
   npm run prod
elif [ "$DEPLOYMENT_GROUP_NAME" == "BMIStagingDeploymentGroup" ]
then
  npm run build
fi
