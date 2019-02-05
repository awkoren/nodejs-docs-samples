// Copyright 2019 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// [START iam_quickstart]
'use strict';

const {google} = require('googleapis');

async function main() {
  // Get credentials
  var auth = await google.auth.getClient({
    scopes: ['https://www.googleapis.com/auth/cloud-platform']
  });

  // Create the Cloud IAM service object
  var service = await google.iam({
    version: 'v1',
    auth: auth
  });
  
  // Call the Cloud IAM Roles API
  var response = await service.roles.list();
  var roles = response.data.roles;

  // Process the response
  roles.forEach(role => {
    console.log('Title: ' + role.title);
    console.log('Name: ' + role.name);
    console.log('Description: ' + role.description);
    console.log();
  });
}

main().catch(console.error);
// [END iam_quickstart]
