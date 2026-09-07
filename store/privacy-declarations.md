# Draft privacy declarations

These answers must be checked against the exact production analytics configuration before submission.

## Product behavior

- Account required: No
- Care-plan selections: stored on the device with Capacitor Preferences; not uploaded to Cosmetics Asia
- Health platform APIs: none
- Runtime permissions: none beyond network access
- User-initiated communication: opens external Email or WhatsApp flows; the user controls whether to send
- Privacy choices: optional analytics consent is available; form answers and contact details are excluded from analytics events
- Deletion: uninstalling the app or clearing app storage removes the local care plan

## Apple App Privacy draft

If Google Analytics remains enabled in the store build, review and declare the analytics data actually collected, which may include:

- Usage Data: product interaction
- Diagnostics: performance or crash data, if enabled
- Location: coarse/approximate location, if received by analytics
- Identifiers: device or other analytics identifiers, if received by analytics

Purposes: Analytics only. Not used for tracking across third-party apps or personalized advertising. Care-plan selections are not collected by the developer.

## Google Play Data safety draft

If Google Analytics remains enabled, review and declare the same production data categories above. Data is encrypted in transit. Users can decline optional analytics. Care-plan selections remain on-device and are not collected.

## Google Play Health apps declaration

- Category: health/medical information and care coordination
- Medical device: No
- Diagnosis or treatment functionality: No
- Health Connect: No
- Health-related runtime permissions: No
- Required description disclaimer: included in the store listing and in the app
- Professional-care reminder: included in the store listing and in the app

## Export compliance draft

The app uses standard HTTPS provided by the operating system and third-party networking libraries. Confirm the applicable encryption exemption in App Store Connect; no proprietary encryption is implemented.
