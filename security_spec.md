# Security Specification for Kutira-Kone

## Data Invariants
- A listing must have valid owner information and a valid status.
- A swap request must link to an existing listing and be initiated by a signed-in user.
- A user can only edit their own profile.
- listings are publicly readable, but only owners can edit them.
- Swap requests are only readable by the owner of the listing and the requester.

## The Dirty Dozen Payloads (Rejection Tests)
1. **Unauthenticated Write**: Attempt to create a listing without being signed in.
2. **Identity Spoofing**: Attempt to create a listing with an `ownerId` that doesn't match `request.auth.uid`.
3. **Malicious ID**: Attempt to create a listing with a document ID that is 2KB of junk characters.
4. **Invalid Material**: Attempt to set `material` to "Unobtainium".
5. **Unauthorized Update**: Attempt to update someone else's listing.
6. **Price Injection**: Attempt to set a `price` on a listing of type "free" or "swap".
7. **Status Bypass**: Attempt to update a listing's status from "available" directly to "exchanged" without a swap request.
8. **Shadow Field**: Attempt to add `isAdmin: true` to a listing document.
9. **PII Leak**: Attempt to read all user profiles as an anonymous user (if restricted).
10. **Swap Request Hijack**: Attempt to read a swap request between User A and User B as User C.
11. **Negative Price**: Attempt to set `price: -100`.
12. **Future Timestamp**: Attempt to set `createdAt` to a date one year in the future.

## Test Runner Logic (Conceptual)
The `firestore.rules` will be built to deny all these cases using the pillars of hardened rules.
