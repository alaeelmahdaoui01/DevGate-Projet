// src/Firebase/Firestore/edit.js
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import { app } from '../config';

export const editProject = async(projectId, updatedData) => {
    if (!projectId || !updatedData || Object.keys(updatedData).length === 0) {
        throw new Error("Invalid project ID or data to update.");
    }

    try {
        const db = getFirestore(app);
        const projectRef = doc(db, 'projects', projectId);
        await updateDoc(projectRef, updatedData);
        console.log(`Project with ID ${projectId} successfully updated.`);
    } catch (error) {
        console.error('Error updating project:', error);
        throw error;
    }
};