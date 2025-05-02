import { getFirestore, doc, deleteDoc, updateDoc, getDoc } from 'firebase/firestore';
import { app } from '../config';

export const deleteSkill = async (skillId, userId) => {
  try {
    const db = getFirestore(app);

    // Delete the skill document from the "skills" collection
    const skillDocRef = doc(db, 'skills', skillId);
    await deleteDoc(skillDocRef);
    console.log(`Skill with ID ${skillId} successfully deleted.`);

    // Update the user's "skills" field to remove the deleted skill mapping
    const userDocRef = doc(db, 'users', userId);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      const updatedSkills = userData.skills.filter(skill => skill.id !== skillId);

      await updateDoc(userDocRef, {
        skills: updatedSkills,
      });

      console.log(`Skill with ID ${skillId} removed from user ${userId}'s skills.`);
    } else {
      throw new Error('User document does not exist.');
    }
  } catch (error) {
    console.error('Error deleting skill:', error);
    throw error;
  }
};
