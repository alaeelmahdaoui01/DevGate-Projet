// src/Firebase/Firestore/edit.js
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import { app } from '../config';

export const editObjective = async(objectiveId, updatedData) => {
    if (!objectiveId || !updatedData || Object.keys(updatedData).length === 0) {
        throw new Error("Invalid objective ID or data to update.");
    }

    try {
        const db = getFirestore(app);
        const objectiveRef = doc(db, 'objectives', objectiveId);
        await updateDoc(objectiveRef, updatedData);
        console.log(`Objective with ID ${objectiveId} successfully updated.`);
    } catch (error) {
        console.error('Error updating objective:', error);
        throw error;
    }
};