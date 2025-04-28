// src/Firebase/Firestore/delete.js
import { getFirestore, doc, deleteDoc } from 'firebase/firestore';
import { app } from '../config';

export const deleteObjective = async(objectiveId) => {
    try {
        const db = getFirestore(app);
        const objectiveDocRef = doc(db, 'objectives', objectiveId);
        await deleteDoc(objectiveDocRef);
        console.log(`Objective with ID ${objectiveId} successfully deleted.`);
    } catch (error) {
        console.error('Error deleting objective:', error);
        throw error;
    }
};