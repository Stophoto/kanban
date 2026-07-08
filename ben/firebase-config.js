// ============================================================================
//  Firebase config — paste your project's keys here to turn on shared sync.
//
//  Until real keys are here, Pantry runs in SINGLE-DEVICE mode (this phone only,
//  saved in the browser). The app still works fully — it just doesn't sync to
//  the other phone yet.
//
//  To turn on shared, real-time sync between both phones (free, ~5 minutes):
//    Follow SETUP.md → "Turn on shared sync". You'll create a Firebase project,
//    then copy its firebaseConfig values into the fields below and redeploy.
//
//  These keys are NOT secret — Firebase web config is meant to ship in the app.
//  Access is controlled by the Firestore security rules (see firestore.rules).
// ============================================================================

export const firebaseConfig = {
  apiKey:            "AIzaSyBmh4vHs5dDcBErT15TjRbOwRgQ66IpVlc",
  authDomain:        "kanban-prefontaine.firebaseapp.com",
  projectId:         "kanban-prefontaine",
  storageBucket:     "kanban-prefontaine.firebasestorage.app",
  messagingSenderId: "875680133722",
  appId:             "1:875680133722:web:04ac80693c035db65e1e63"
};
