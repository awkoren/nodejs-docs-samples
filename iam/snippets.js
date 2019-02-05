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

'use strict';

const { google } = require('googleapis');

var auth;
var iamService;
var crmService;

// [START iam_get_policy]
async function getPolicy(projectId) {
    var response = await crmService.projects.getIamPolicy({
        resource: projectId
    });
    var policy = response.data;
    console.log(policy);
    return policy;
}
// [END iam_get_policy]

// [START iam_modify_policy_member]
async function addMember(policy, role, member) {
    var binding = policy.bindings.find(x => x.role == role);
    binding.members.push(member);
    console.log(policy);
    return policy;
}
// [END iam_modify_policy_member]

// [START iam_modify_policy_add_role]
async function addBinding(policy, role, member) {
    var binding = {
        role: role,
        members: [member]
    };
    policy.bindings.push(binding);
    console.log(policy);
    return policy;
}
// [END iam_modify_policy_add_role]

// [START iam_set_policy]
async function setPolicy(projectId, policy) {
    var response = await crmService.projects.setIamPolicy({
        resource: projectId,
        requestBody: {
            policy: policy
        }
    });
    var policy = response.data;
    console.log(policy);
    return policy;
}
// [END iam_set_policy]

// [START iam_view_grantable_roles]
async function viewGrantableRoles(fullResourceName) {
    var response = await iamService.roles.queryGrantableRoles({
        fullResourceName: fullResourceName
    });
    var roles = response.data.roles;
    roles.forEach(role => {
        console.log('Title: ' + role.title);
        console.log('Name: ' + role.name);
        console.log('Description: ' + role.description);
        console.log();
    });
}
// [END iam_view_grantable_roles]

// [START iam_query_testable_permissions]
async function queryTestablePermissions(fullResourceName) {
    var response = await iamService.permissions.queryTestablePermissions({
        fullResourceName: fullResourceName
    });
    var permissions = response.data.permissions;
    permissions.forEach(p => console.log(p.name));
}
// [END iam_query_testable_permissions]

// [START iam_create_role]
async function createRole(name, project, title, description, permissions, stage) {
    var response = await iamService.projects.roles.create({
        parent: 'projects/' + project,
        requestBody: {
            roleId: name,
            role: {
                title: title,
                description: description,
                includedPermissions: permissions,
                stage: stage
            }
        }
    });
    var role = response.data;
    console.log('Created role: ' + role.name);
    return role;
}
// [END iam_create_role]

// [START iam_edit_role]
async function editRole(name, project, title, description, permissions, stage) {
    var response = await iamService.projects.roles.patch({
        name: 'projects/' + project + '/roles/' + name,
        requestBody: {
            title: title,
            description: description,
            includedPermissions: permissions,
            stage: stage
        }
    });
    var role = response.data;
    console.log('Updated role: ' + role.name);
    return role;
}
// [END iam_edit_role]

// [START iam_disable_role]
async function disableRole(name, project) {
    var response = await iamService.projects.roles.patch({
        name: 'projects/' + project + '/roles/' + name,
        requestBody: {
            stage: 'DISABLED'
        }
    });
    var role = response.data;
    console.log('Disabled role: ' + role.name);
}
// [END iam_disable_role]

// [START iam_list_roles]
async function listRoles(projectId) {
    var response = await iamService.roles.list({
        parent: 'projects/' + projectId,
    });
    var roles = response.data.roles;
    roles.forEach(role => console.log(role.name));
    return roles;
}
// [END iam_list_roles]

// [START iam_delete_role]
async function deleteRole(name, project) {
    await iamService.projects.roles.delete({
        name: 'projects/' + project + '/roles/' + name
    });
    console.log('Deleted role: ' + name);
}
// [END iam_delete_role]

// [START iam_undelete_role]
async function undeleteRole() {
    var response = await iamService.projects.roles.undelete({
        name: 'projects/' + project + '/roles/' + name
    });
    var role = response.data;
    console.log('Undeleted role: ' + role.name);
    return role;
}
// [END iam_undelete_role]

// [START iam_create_service_account]
async function createServiceAccount(projectId, name, displayName) {
    var response = await iamService.projects.serviceAccounts.create({
        name: 'projects/' + projectId,
        requestBody: {
            accountId: name,
            serviceAccount: {
                displayName: displayName
            }
        }
    });
    var serviceAccount = response.data;
    console.log('Created service account: ' + serviceAccount.email);
    return serviceAccount;
}
// [END iam_create_service_account]

// [START iam_list_service_accounts]
async function listServiceAccounts(projectId) {
    var response = await iamService.projects.serviceAccounts.list({
        name: 'projects/' + projectId
    });
    var serviceAccounts = response.data.accounts;
    serviceAccounts.forEach(account => {
        console.log('Name: ' + account.name);
        console.log('Email: ' + account.email);
        console.log();
    });
    return serviceAccounts;
}
// [END iam_list_service_accounts]

// [START iam_rename_service_account]
async function renameServiceAccount(email, newDisplayName) {
    // First, get a service account using List() or Get()
    var resource = 'projects/-/serviceAccounts/' + email;
    var response = await iamService.projects.serviceAccounts.get({
        name: resource
    });
    var serviceAccount = response.data;

    // Then you can update the display name
    serviceAccount.displayName = newDisplayName;
    response = await iamService.projects.serviceAccounts.update({
        name: resource,
        requestBody: serviceAccount
    });
    serviceAccount = response.data;

    console.log('Updated display name for ' + serviceAccount.email +
        'to ' + serviceAccount.displayName);
    return serviceAccount;
}
// [END iam_rename_service_account]

// [START iam_delete_service_account]
async function deleteServiceAccount(email) {
    await iamService.projects.serviceAccounts.delete({
        name: 'projects/-/serviceAccounts/' + email
    });
    console.log('Deleted service account: ' + email);
}
// [END iam_delete_service_account]

// [START iam_create_key]
async function createKey(serviceAccountEmail) {
    var response = await iamService.projects.serviceAccounts.keys.create({
        name: 'projects/-/serviceAccounts/' + serviceAccountEmail
    });
    var key = response.data;
    console.log('Created key: ' + key.name);
    return key;
}
// [END iam_create_key]

// [START iam_list_keys]
async function listKeys(serviceAccountEmail) {
    var response = await iamService.projects.serviceAccounts.keys.list({
        name: 'projects/-/serviceAccounts/' + serviceAccountEmail
    });
    var keys = response.data.keys;
    keys.forEach(key => console.log(key.name));
}
// [END iam_list_keys]

// [START iam_delete_key]
async function deleteKey(fullKeyName) {
    await iamService.projects.serviceAccounts.keys.delete({
        name: fullKeyName
    });
    console.log('Deleted key: ' + fullKeyName);
}
// [END iam_delete_key]

async function main() {

    auth = await google.auth.getClient({
        scopes: ['https://www.googleapis.com/auth/cloud-platform']
    });
    iamService = google.iam({
        version: 'v1',
        auth: auth
    });
    crmService = google.cloudresourcemanager({
        version: 'v1',
        auth: auth
    });
}

main().catch(console.error);
