# Security hardening — deployment status

Prepared locally; not deployed or pushed. Existing unrelated changes are preserved.

## Implemented
- Server-owned prices for the two available digital products; rejects unsupported products and invalid points.
- Event prices read from the database and membership checked under the authenticated user's JWT.
- Product verification requires a paid USD payment-mode Stripe session owned by the caller.
- Migration removes direct purchase inserts, restricts cash fulfillment to service_role, validates totals, serializes point spending and records Stripe session IDs.
- Browser-only PayPal checkout removed pending server-side capture verification. Do not re-enable with only an onApprove callback.
- Image extension/MIME/size validation; no SVG passthrough; storage MIME/size constraints and restrictive extension policies in migration.
- FAQ extraction sanitizes before parsing.

## Verification
Five targeted unit tests pass. Vite production bundle builds. SQL and real payment fulfillment are not yet integration-tested.

## Required before release
1. Test migration on a staging database. Test authenticated direct writes/RPC bypass rejection, concurrent/repeated requests, points-only purchases and insufficient points.
2. Deploy database migration and create-product-payment, create-event-payment, verify-product-payment together; include _shared/productCatalog.ts.
3. Test owned/unowned, pending/paid Stripe sessions using Stripe test mode, including points spent between checkout and fulfillment. This last case fails safely but requires support/refund handling.
4. Paid event checkout currently lacks a complete verified fulfillment path; test and implement it before enabling/advertising paid events. Free/member/points registration RPC was not changed in this patch.
5. Test upload restrictions against the live Storage API; browser MIME checks alone do not prove file contents. Consider decode/re-encode on a trusted image processing service.
6. Publish frontend only with the coordinated backend release. Confirm no customer is charged through unsupported PayPal flow.

## Additional finding
The two paid product PDFs are referenced by public website URLs. Purchase-record authorization alone does not make those files private. Move them to private storage and issue short-lived signed URLs after entitlement checks in a separate coordinated delivery change.

Stripe webhook signature verification, subscription checkout and assessment flow were not altered.
