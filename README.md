<p align="center">
  <a href="https://github.com/loqteklabs/scaleManager">
   <img src="/assets/images/noBgScaleManagerLogo.png" alt="logo" width="200"/>
  </a>
</p>

# Welcome To Scale Manager
This app is for [Headscale](https://github.com/juanfont/headscale) users who want to manage their server via HTTP/HTTPS without 
needing a Web UI or using Headscales gRPC.

This simple but useful app allows you to manage multiple headscale servers, their 
pre-auth keys, users, API keys, devices, device registration and more all with one app.

<p align="center">
  <a href="https://apps.apple.com/us/app/scale-manager/id6751473022" target="_blank">
    <img src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us" alt="Download on the App Store" height="180">
  </a>
  <a href="">
      Android Coming Soon
  </a>
</p>

## Features
- Manage multiple servers
- Device registration, deletion, and modification
- API Key creation, and expiration
- Pre Auth Key creation, and expiration
- User creation, rename, and deletion
- View total online, offline devices and ping to server
- Routes enable, and disable


## Get started
Use npm or bun (recommended) to install dependencies

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

## build a .ipa using xcode >= 15.1

   ```bash
   cd /project-path/scaleManager/ios
   ```

   Build the code (This may take a while)
   ```bash
   xcodebuild -workspace scaleManager.xcworkspace -scheme scaleManager -configuration Release -sdk iphoneos -archivePath ./build/scaleManager.xcarchive archive
   ```

   Export archive as .ipa file
   ```bash
   xcodebuild -exportArchive -archivePath ./build/scaleManager.xcarchive -exportPath ./build/ipa -exportOptionsPlist exportOptions.plist
   ```

   Then check the ./build/ipa file to find the built .ipa file.

### Please Note
Since this IPA was built without code signing, it cannot be installed directly on physical devices through normal means. To install on devices:

1. Use AltStore (https://altstore.io/) 
2. Or other sideloading tools like SideloadLY or AppDB

## build a .apk

   ```bash
   npm install eas-cli
   ```

   edit eas.json to fit this json to build it as apk and not aab

   ```json
   "build": {
      "apk": {
         "android": {
            "buildType": "apk"
         }
      }

   }
   ```


   ```bash
   eas build -p android --profile apk
   ```


## Contributions
Pull requests are always welcome and appreciated! feel free to contribute by sharing ideas or suggestions through the Issues we're 
always looking for ways to improve the app!


