import { GameSettingsStates } from '@/types/redux/gameSettingsTypes'
import { AppDispatch } from '@/redux/store'
import { setFocusedSection, setPreviousFocusedSection } from '@/redux/slices/gameSettingsSlice'

export const handleChangeFocusedSection = (
   event: KeyboardEvent,
   gameType: GameSettingsStates['gameType'],
   focusedSection: GameSettingsStates['focusedSection'],
   previousFocusedSection: GameSettingsStates['previousFocusedSection'],
   dispatch: AppDispatch
) => {

   if (event.key === 'Tab') {
      event.preventDefault()
   }

   if (!focusedSection && event.key === 'ArrowUp' || !focusedSection && (event.key === 'Tab' && event.shiftKey)) {
      dispatch(setFocusedSection('gameStart'))
      return
   }

   if (!focusedSection && event.key === 'ArrowDown' || !focusedSection && event.key === 'Tab') {
      dispatch(setFocusedSection('gameType'))
      return
   }


   if (gameType === 'single') {
      const singleSections = ['gameType', 'gameSinglePlayerNameInput', 'gameMode', 'winType', 'numberOfLegs', 'gameStart']
      const currentFocusedSectionIndex = singleSections.findIndex(element => element === focusedSection)
      
      if (event.key === 'ArrowUp' || (event.key === 'Tab' && event.shiftKey)) {
         if (focusedSection === 'gameMode') {
            dispatch(setPreviousFocusedSection('gameMode'))
         }

         const prevIndex = (currentFocusedSectionIndex - 1 + singleSections.length) % singleSections.length
         dispatch(setFocusedSection(singleSections[prevIndex]))
         return
      }

      if (event.key === 'ArrowDown' || event.key === 'Tab') {
         if(focusedSection === 'gameType') {
            dispatch(setPreviousFocusedSection('gameType'))
         }

         if (previousFocusedSection === 'gameSinglePlayerNameInput' && focusedSection !== 'gameMode') {
            dispatch(setFocusedSection('gameMode'))
            return
         }
         if (currentFocusedSectionIndex === 1) {
            dispatch(setFocusedSection(singleSections[2]))
            return
         }
         const nextIndex = (currentFocusedSectionIndex + 1) % singleSections.length
         dispatch(setFocusedSection(singleSections[nextIndex]))
         return
      }


   }

   if (gameType === 'teams') {
      const singleSections = ['gameType', 'gameTeamsPlayerNameInputTeam1', 'gameTeamsPlayerNameInputTeam2', 'gameMode', 'winType', 'numberOfLegs', 'gameStart']
      const currentFocusedSectionIndex = singleSections.findIndex(element => element === focusedSection)

      if (currentFocusedSectionIndex === 0) {
         dispatch(setPreviousFocusedSection('gameType'))
      } else if (currentFocusedSectionIndex === 3) {
         dispatch(setPreviousFocusedSection('gameMode'))
      }

      if (event.key === 'ArrowUp' || (event.key === 'Tab' && event.shiftKey)) {
         if (focusedSection === 'gameMode') {
            dispatch(setPreviousFocusedSection('gameMode'))
         }
         
         const prevIndex = (currentFocusedSectionIndex - 1 + singleSections.length) % singleSections.length

         dispatch(setFocusedSection(singleSections[prevIndex]))
         return
      }

      if (event.key === 'ArrowDown' || event.key === 'Tab') {
         if(focusedSection === 'gameType') {
            dispatch(setPreviousFocusedSection('gameType'))
         }

         const nextIndex = (currentFocusedSectionIndex + 1) % singleSections.length
         dispatch(setFocusedSection(singleSections[nextIndex]))
         return
      }


   }

   if (gameType === 'online') {
      const onlineSections = ['gameType', 'numberOfPlayers', 'gameOnlinePlayerNameInput', 'gameMode', 'winType', 'numberOfLegs', 'timeToThrow', 'gameOnlineStart']
      const currentFocusedSectionIndex = onlineSections.findIndex(element => element === focusedSection)

      if (currentFocusedSectionIndex === 2 && event.key === 'Enter') {
         const nextIndex = (currentFocusedSectionIndex + 1) % onlineSections.length
         dispatch(setFocusedSection(onlineSections[nextIndex]))
         return
      }

      if (event.key === 'ArrowUp' || (event.key === 'Tab' && event.shiftKey)) {
         if (focusedSection === 'gameMode') {
            dispatch(setPreviousFocusedSection('gameMode'))
         }
         
         const prevIndex = (currentFocusedSectionIndex - 1 + onlineSections.length) % onlineSections.length

         dispatch(setFocusedSection(onlineSections[prevIndex]))
         return
      }

      if (event.key === 'ArrowDown' || event.key === 'Tab') {
         if(focusedSection === 'numberOfPlayers') {
            dispatch(setPreviousFocusedSection('numberOfPlayers'))
         }
         const nextIndex = (currentFocusedSectionIndex + 1) % onlineSections.length
         dispatch(setFocusedSection(onlineSections[nextIndex]))
         return
      }



   }

}
  
   