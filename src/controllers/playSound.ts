export const playSound = (fileName: string, isSoundEnabled: boolean) => {
   if (isSoundEnabled) {
      const audio = new Audio(`/sounds/${fileName}.mp3`)
      audio.play().catch(error => console.log('Error:', error))
   }
}