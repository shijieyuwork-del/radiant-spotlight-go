# Cosmetics Asia · Store release package

Release target: iOS and Android, version `1.0.0` (`1`).

Identifiers:

- App name: Cosmetics Asia
- Apple bundle ID: `com.cosmeticsasia.app`
- Android application ID: `com.cosmeticsasia.app`
- Support URL: `https://cosmetics-asia.com/about`
- Privacy URL: `https://cosmetics-asia.com/privacy`
- Marketing URL: `https://cosmetics-asia.com/`

## Release gates

- [x] App-specific mobile navigation and persistent care plan
- [x] Native iOS and Android projects
- [x] Native app icon and launch screen
- [x] Native haptics, share sheet, status bar and Android back handling
- [x] In-app medical disclaimer and privacy link
- [x] Care-plan data stored on-device only
- [x] No health, camera, microphone, contacts or location permissions requested
- [x] Production web build and Capacitor sync
- [x] Unsigned Android release bundle builds successfully with target SDK 36
- [x] Apple 6.9-inch and Google Play phone screenshots
- [x] Google Play feature graphic and 512px store icon
- [ ] Test on a physical iPhone and Android phone
- [ ] Confirm final App Privacy / Data safety answers against production analytics settings
- [ ] Apple Developer Program membership and App Store Connect app record
- [ ] Google Play Console developer account and app record
- [ ] Signed `.ipa` and `.aab`
- [ ] Upload to TestFlight and Google Play internal testing
- [ ] Complete Google Play Health apps declaration
- [ ] Final owner approval before Submit for Review / Start rollout

The app supplies information and coordination. It is not a medical device and does not diagnose, treat, cure or prevent any medical condition. Medical decisions remain between the user and a licensed healthcare professional.

## Build outputs and signing

The unsigned Android App Bundle is generated at `android/app/build/outputs/bundle/release/app-release.aab`.

Release signing is intentionally supplied outside source control through `CA_UPLOAD_KEYSTORE`, `CA_UPLOAD_KEYSTORE_PASSWORD`, `CA_UPLOAD_KEY_ALIAS` and `CA_UPLOAD_KEY_PASSWORD`. Never commit the upload keystore or its passwords.

The iOS archive must be created with full Xcode after an Apple Developer team and distribution signing identity are selected for `com.cosmeticsasia.app`.
