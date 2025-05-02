import { getFirestore, doc, deleteDoc, updateDoc, getDoc } from 'firebase/firestore';
import { app } from '../config';

export const deleteProject = async (projectId, userId) => {
  try {
    const db = getFirestore(app);

    // Delete the project document from the "projects" collection
    const projectDocRef = doc(db, 'projects', projectId);
    await deleteDoc(projectDocRef);
    console.log(`Project with ID ${projectId} successfully deleted.`);

    // Update the user's "projects" field to remove the deleted project mapping
    const userDocRef = doc(db, 'users', userId);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      const updatedProjects = userData.projects.filter(
        project => project.id !== projectId
      );

      await updateDoc(userDocRef, {
        projects: updatedProjects,
      });

      console.log(`Project with ID ${projectId} removed from user ${userId}'s projects.`);
    } else {
      throw new Error('User document does not exist.');
    }
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
};
