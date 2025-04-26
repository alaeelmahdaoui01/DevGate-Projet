// src/Firebase/Firestore/delete.js
import { getFirestore, doc, deleteDoc } from 'firebase/firestore';
import { app } from '../config';

export const deleteProject = async(projectId) => {
    try {
        const db = getFirestore(app);
        const projectDocRef = doc(db, 'projects', projectId);
        await deleteDoc(projectDocRef);
        console.log(`Project with ID ${projectId} successfully deleted.`);
    } catch (error) {
        console.error('Error deleting project:', error);
        throw error;
    }
};