import { GameResponses, gameStates } from '@/types/gameTypes';
import { toast } from 'react-toastify';

export function updateGameState(
  gameType: keyof GameResponses, 
  updates: Partial<GameResponses[keyof GameResponses]>
) {
  try {
    const currentState = gameStates[gameType];
    const newState = { ...currentState, ...updates };
    
    // Éviter les mises à jour inutiles
    const hasChanged = Object.keys(updates).some(
      key => currentState[key] !== newState[key]
    );

    if (hasChanged) {
      gameStates[gameType] = newState;
      console.log(`Game state updated for ${gameType}:`, newState);
    }
  } catch (error) {
    console.error(`Erreur lors de la mise à jour de l'état du jeu ${gameType}:`, error);
    toast.error(`Erreur de mise à jour du jeu ${gameType}`);
  }
}

export function setCurrentGameAnswer(
  gameType: keyof GameResponses, 
  answer: string
) {
  try {
    if (answer !== gameStates[gameType].currentAnswer) {
      updateGameState(gameType, { currentAnswer: answer });
    }
  } catch (error) {
    console.error(`Erreur lors de la définition de la réponse pour ${gameType}:`, error);
    toast.error(`Impossible de définir la réponse pour ${gameType}`);
  }
}

export function addUserAnswer(
  gameType: keyof GameResponses, 
  answer: string
) {
  try {
    const currentState = gameStates[gameType];
    const newUserAnswers = [...currentState.userAnswers, answer];
    
    updateGameState(gameType, { 
      userAnswers: newUserAnswers,
      currentAnswer: '' // Réinitialiser la réponse actuelle
    });

    toast.success('Réponse enregistrée avec succès !');
  } catch (error) {
    console.error(`Erreur lors de l'ajout de la réponse pour ${gameType}:`, error);
    toast.error(`Impossible d'ajouter la réponse pour ${gameType}`);
  }
}

export function completeGame(gameType: keyof GameResponses) {
  try {
    updateGameState(gameType, { 
      isCompleted: true 
    });

    toast.info(`Jeu ${gameType} terminé !`);
  } catch (error) {
    console.error(`Erreur lors de la complétion du jeu ${gameType}:`, error);
    toast.error(`Impossible de terminer le jeu ${gameType}`);
  }
}
