import { auth } from "@/Firebase/config.js"

const signOut = () => {
    return auth.signOut().then(() => {
        console.log('User signed out');
    }).catch(error => {
        console.error('Error signing out:', error);
    });
}

export default signOut;