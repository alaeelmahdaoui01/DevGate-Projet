// src/Firebase/Firestore/editSkills.js
import { getFirestore, doc, updateDoc, getDoc } from 'firebase/firestore';
import { app } from '../config';

export const editSkill = async (skillId, updatedData, userId) => {
  if (!skillId || !updatedData || !userId || Object.keys(updatedData).length === 0) {
    throw new Error("Invalid skill ID, user ID, or data to update.");
  }

  try {
    const db = getFirestore(app);

    // Update the skill in the "skills" collection
    const skillRef = doc(db, 'skills', skillId);
    await updateDoc(skillRef, updatedData);
    console.log(`Skill with ID ${skillId} successfully updated.`);

    // Update the skill in the user's "skills" array
    const userDocRef = doc(db, 'users', userId);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      const updatedSkills = userData.skills.map(skill =>
        skill.id === skillId ? { ...skill, ...updatedData } : skill
      );

      await updateDoc(userDocRef, { skills: updatedSkills });
      console.log(`Skill with ID ${skillId} updated in user ${userId}'s skills.`);
    } else {
      throw new Error('User document does not exist.');
    }
  } catch (error) {
    console.error('Error updating skill:', error);
    throw error;
  }
};
