import { getFirestore, doc, updateDoc, getDoc } from 'firebase/firestore';
import { app } from '../config';

export const editProject = async (projectId, updatedData, userId) => {
  if (!projectId || !updatedData || !userId || Object.keys(updatedData).length === 0) {
    throw new Error("Invalid project ID, user ID, or data to update.");
  }

  try {
    const db = getFirestore(app);

    // Update the project in the "projects" collection
    const projectRef = doc(db, 'projects', projectId);
    await updateDoc(projectRef, updatedData);
    console.log(`Project with ID ${projectId} successfully updated.`);

    // Update the project in the user's "projects" array
    const userDocRef = doc(db, 'users', userId);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      const updatedProjects = userData.projects.map(project =>
        project.id === projectId ? { ...project, ...updatedData } : project
      );

      await updateDoc(userDocRef, { projects: updatedProjects });
      console.log(`Project with ID ${projectId} updated in user ${userId}'s projects.`);
    } else {
      throw new Error('User document does not exist.');
    }
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
};
