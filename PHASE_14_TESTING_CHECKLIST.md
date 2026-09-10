# Phase 14 Testing Checklist

Run the client and server locally with a test account and test data. Do not use production credentials or real farmer data.

## Authentication and Privacy

- [ ] Register with valid data and confirm the account is created.
- [ ] Reject registration with missing/invalid fields and verify the error message.
- [ ] Log in with valid credentials and confirm the dashboard opens.
- [ ] Confirm the login token is stored without exposing its value in logs or the UI.
- [ ] Refresh an authenticated page and confirm the session is restored.
- [ ] Log out and confirm protected pages redirect to `/login`.
- [ ] Open a protected URL while logged out and confirm access is denied.
- [ ] Submit registration without privacy consent and confirm it is rejected.
- [ ] Confirm privacy policy access and consent details behave as expected.

## Crop Management and Images

- [ ] Create a crop with valid data.
- [ ] Edit a crop and confirm all changed fields persist.
- [ ] Delete a crop and confirm it disappears from the list.
- [ ] Reject invalid crop values with a useful error.
- [ ] Upload a valid crop image while online.
- [ ] Reject non-image files and oversized/invalid image input as configured.
- [ ] Confirm uploaded images appear in the crop history.
- [ ] Disable the network, upload an image, and confirm it is placed in the offline queue.
- [ ] Restore the network and confirm queued images synchronize automatically.
- [ ] Confirm successfully synchronized items leave the queue.
- [ ] Confirm failed synchronization keeps the item pending for retry.

## Disease Analysis and History

- [ ] Analyze an uploaded crop image while online.
- [ ] Confirm loading, success, and failure states are shown.
- [ ] Confirm the monthly usage count changes after a successful analysis.
- [ ] Confirm disease analysis history remains visible after refresh.
- [ ] Confirm history is associated with the correct crop and image.
- [ ] Reach the free-plan limit and confirm the next analysis is rejected clearly.
- [ ] Confirm usage resets correctly at the next usage period.

## Weather

- [ ] Submit valid latitude and longitude and confirm weather data appears.
- [ ] Reject missing, non-numeric, and out-of-range coordinates.
- [ ] Confirm the weather page is usable on a narrow mobile viewport.
- [ ] Confirm offline weather requests fail clearly without corrupting cached data.

## AI Assistant and RAG

- [ ] Ask a normal farming question and confirm an answer is returned.
- [ ] Confirm loading, error, and empty-question states.
- [ ] Ask a question that requires retrieved agricultural knowledge and verify relevant RAG context is used.
- [ ] Ask the same supported question in each configured language and verify the response language.
- [ ] Confirm unauthenticated assistant requests are rejected.
- [ ] Confirm assistant requests are not served from a stale authenticated cache.

## Voice

- [ ] Confirm voice controls render in a supported browser.
- [ ] Grant microphone access, speak a question, and confirm transcription and assistant response.
- [ ] Confirm speech output starts and can be stopped.
- [ ] Deny microphone access and verify a useful error message.
- [ ] Test unsupported-browser behavior.
- [ ] Test configured languages where browser speech support is available.

## Security and Resilience

- [ ] Confirm protected API requests require authentication.
- [ ] Confirm invalid or expired authentication is rejected and local auth state is cleared.
- [ ] Confirm authentication and analysis rate limits respond with a clear error.
- [ ] Confirm CORS permits the configured client origin and rejects unintended origins.
- [ ] Confirm Helmet security headers are present.
- [ ] Confirm passwords, tokens, API keys, and provider errors are not rendered or logged.
- [ ] Confirm server validation rejects malformed IDs and unexpected request data.

## PWA, Offline, and Mobile

- [ ] Build the client and confirm the manifest and service worker are generated.
- [ ] Inspect the manifest for name, short name, icons, start URL, standalone display, theme color, and background color.
- [ ] Install the app from a supported browser and confirm it opens in standalone mode.
- [ ] Reload the app once offline and confirm the app shell loads.
- [ ] Confirm backend, authentication, weather, assistant, and Cloudinary requests are not incorrectly cached as static assets.
- [ ] Confirm the offline status message appears when the connection is disabled.
- [ ] Confirm queued-image status is visible and synchronization runs when the connection returns.
- [ ] Test dashboard, crops/upload, weather, assistant, and voice UI at a narrow mobile width.
- [ ] Confirm buttons and form controls remain usable without horizontal scrolling.
- [ ] Confirm the installed app updates after a new client build.

Deployment is intentionally out of scope for this checklist and roadmap phase.
