import { ref } from 'vue';
import { db, auth } from "@/Firebase/config";
// import { updateProfile, updateEmail } from "firebase/auth";

const user = ref(auth.currentUser);
let authInitialized = false;
let authResolve;

const authReady = new Promise(resolve => {
    authResolve = resolve;
});

auth.onAuthStateChanged(_user => {
    console.log('User state change. Current user is:', _user);
    user.value = _user;
    authInitialized = true;
    authResolve();
});

const getUser = () => {
    return user.value;
}

const isLogged = () => {
    return !!user.value;
}

const waitForAuthInit = () => {
    if (authInitialized) {
        return Promise.resolve();
    }
    return authReady;
}

const getUserById = async(uid) => {
    const res = await db.collection('users').doc(uid).get();
    return res.data();
};


/*const updateUserProfile = async(userId, { displayName, email }) => {
    const currentUser = auth.currentUser;
    if (!currentUser || currentUser.uid !== userId) {
        throw new Error("Unauthorized or invalid user.");
    }

    if (displayName && currentUser.displayName !== displayName) {
        await updateProfile(currentUser, { displayName });
    }

    if (email && currentUser.email !== email) {
        await updateEmail(currentUser, email);
    }

    // Optionally update Firestore too:
    await projectFirestore.collection('users').doc(userId).update({
        displayName,
        email
    });
};
*/


export {
    getUser,
    isLogged,
    waitForAuthInit,
    getUserById,
    // updateUserProfile // ✅ make sure it's exported!
};