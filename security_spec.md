# AIG Security Specification - Attribute-Based Access Control (ABAC)

## 1. Data Invariants
- **Owner-Only Read/Write**: Profile documents stored at `/users/{userId}` can only be read or created by the owner matching `request.auth.uid`.
- **Admin Verification**: Admins configured at `/admins/{adminId}` can read and write all files and update any user's profile and roles.
- **Email Verified Requirement**: For any standard user sign-in and profile creation, the operator's email must be verified (`request.auth.token.email_verified == true`).
- **Role Immutability for Self**: Standard users cannot modify or upgrade their assigned roles. Only Admins can modify other users' roles.
- **Strict Size/Form Boundaries**: Unbounded string fields must not exceed standard lengths to prevent storage overflow attacks.

## 2. The "Dirty Dozen" Payloads (Exploit Scenarios)
1. **Self-Elevating Administrator**: A general user attempts to set `role` to `Admin` on profile creation.
2. **Impersonate Another Operator**: A user attempts to write to a `/users/{otherUserId}` profile path.
3. **Ghost Fields Injection**: A user inserts a random `isVerifiedBoss: true` field.
4. **Falsified Timestamp**: Users bypasses server timestamps and supplies their own past client date.
5. **No Verification Bypass**: An unverified email account (`email_verified: false`) tries to register.
6. **Path Traversal Poisoning**: Injecting an extremely long id `userId = "a...overflow"` as a path.
7. **Cross-Tenant Theft**: Read other user's PII profile via a blanket list query.
8. **Admin Config Tampering**: General user attempts to create doc `/admins/myUserUid`.
9. **Role Modification Post-Signup**: A General User tries to update their `role` field from General User to Analyst.
10. **Zero Size Strings ID**: Attempting to query with a blank string ID.
11. **Improper Type Payload**: Sending a number for `displayName`.
12. **Null Token Authentication**: Attempting to read `/users/{userId}` without any login session inside `request.auth`.

## 3. Deployment Rules Draft and Verification
We will define and deploy these in the `firestore.rules` file to prevent updates to un-allowlisted elements.
