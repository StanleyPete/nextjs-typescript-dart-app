/* 
   USED IN: 
      pages:
         - game-classic page.tsx
         - game-cricket page.tsx
      
      game-classic:
         - handleSubmitThrowKeyboardButtons
         - handleSubmitThrowNumberButtons
         - handleSubmitThrowSubmitScoreButtons,
      
      - game-cricket:
         - handleScoreButtons
      
      controllers used in both game-classic and game-cricket:
         - handleCheckGameEnd
   
*/
export const playSound = (fileName: string, isSoundEnabled: boolean) => {
   if (isSoundEnabled) {
      const audio = new Audio(`/sounds/${fileName}.mp3`)
      audio.play().catch(error => console.log('Error:', error))
   }
}