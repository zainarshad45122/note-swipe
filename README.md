# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   yarn install
   ```

2. Start the app

   ```bash
   yarn start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **src/app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Android debugging (physical device)

If **Open DevTools** shows `No compatible apps connected`, Metro is not seeing your phone as a debugger target. Use USB + port forwarding:

1. Enable **USB debugging** on the phone and connect it to your Mac.
2. Run:

   ```bash
   yarn android:debug
   ```

3. Open the project in **Expo Go 56** when prompted (must match SDK 56).
4. With the app open, press **`j`** in the terminal (or use **Open DevTools** in the shake menu).

Check that Metro sees the device:

```bash
curl http://127.0.0.1:8081/json/list
```

You should get a non-empty JSON array while the app is open. If it is `[]`, reload the app (`r` in the terminal) or re-run `yarn android:debug`.

Wi‑Fi-only (no USB): use `npx expo start --tunnel` instead, then reconnect Expo Go.

## Get a fresh project

When you're ready, run:

```bash
yarn reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

### Other setup steps

- To set up ESLint for linting, run `npx expo lint`, or follow our guide on ["Using ESLint and Prettier"](https://docs.expo.dev/guides/using-eslint/)
- If you'd like to set up unit testing, follow our guide on ["Unit Testing with Jest"](https://docs.expo.dev/develop/unit-testing/)
- Learn more about the TypeScript setup in this template in our guide on ["Using TypeScript"](https://docs.expo.dev/guides/typescript/)

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
