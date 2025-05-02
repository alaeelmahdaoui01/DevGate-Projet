import { getFirestore, doc, updateDoc, getDoc } from 'firebase/firestore';
import { app } from '../config';

export const editObjective = async (objectiveId, updatedData, userId) => {
  if (!objectiveId || !updatedData || !userId || Object.keys(updatedData).length === 0) {
    throw new Error("Invalid objective ID, user ID, or data to update.");
  }

  try {
    const db = getFirestore(app);

    // Update the objective in the "objectives" collection
    const objectiveRef = doc(db, 'objectives', objectiveId);
    await updateDoc(objectiveRef, updatedData);
    console.log(`Objective with ID ${objectiveId} successfully updated.`);

    // Update the objective in the user's "objectives" array
    const userDocRef = doc(db, 'users', userId);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      const updatedObjectives = userData.objectives.map(objective =>
        objective.id === objectiveId ? { ...objective, ...updatedData } : objective
      );

      await updateDoc(userDocRef, { objectives: updatedObjectives });
      console.log(`Objective with ID ${objectiveId} updated in user ${userId}'s objectives.`);
    } else {
      throw new Error('User document does not exist.');
    }
  } catch (error) {
    console.error('Error updating objective:', error);
    throw error;
  }
};
