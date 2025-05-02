import { getFirestore, doc, deleteDoc, updateDoc, getDoc } from 'firebase/firestore';
import { app } from '../config';

export const deleteObjective = async (objectiveId, userId) => {
  try {
    const db = getFirestore(app);

    // Delete the objective document from the "objectives" collection
    const objectiveDocRef = doc(db, 'objectives', objectiveId);
    await deleteDoc(objectiveDocRef);
    console.log(`Objective with ID ${objectiveId} successfully deleted.`);

    // Update the user's "objectives" field to remove the deleted objective mapping
    const userDocRef = doc(db, 'users', userId);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      const updatedObjectives = userData.objectives.filter(
        objective => objective.id !== objectiveId
      );

      await updateDoc(userDocRef, {
        objectives: updatedObjectives,
      });

      console.log(`Objective with ID ${objectiveId} removed from user ${userId}'s objectives.`);
    } else {
      throw new Error('User document does not exist.');
    }
  } catch (error) {
    console.error('Error deleting objective:', error);
    throw error;
  }
};
