// Shared Firebase project config for the personalBudy cluster.
// All apps (budgetBuddy, DietBudy, GymBudy, personalBudy) use the same Firebase project.
//
// SSO NOTE: Session sharing works because all apps are served from splochev.github.io
// (same browser origin), so Firebase's IndexedDB auth session is visible to all of them.
// Moving any app to a custom domain will silently break SSO.
export const sharedFirebaseConfig = {
  apiKey: "AIzaSyCIJlxyWuBSUMepIfPGKaeBvcHDsdFVftY",
  authDomain: "personalbudy-2f735.firebaseapp.com",
  projectId: "personalbudy-2f735",
  storageBucket: "personalbudy-2f735.firebasestorage.app",
  messagingSenderId: "138709908215",
};
