import { GameSettingsStates } from '@/types/redux/gameSettingsTypes'
import { AppDispatch } from '@/redux/store'
import { setFocusedSection } from '@/redux/slices/gameSettingsSlice'
import { GameOnlineStates } from '@/types/redux/gameOnlineTypes'

export const handleChangeFocusedSectionLobby = (
   event: KeyboardEvent,
   focusedSection: GameSettingsStates['focusedSection'], 
   role: GameOnlineStates['role'],
   dispatch: AppDispatch
) => {
   const sections = [
      'gameModeOnlineSection', 
      'winTypeOnlineSection', 
      'numberOfLegsOnlineSection', 
      'ThrowTimeOnlineSection', 
      role === 'host' ? 'startOnlineGameButton' : 'guestReadyButton'
   ]

   if (!focusedSection && event.key === 'ArrowUp' || !focusedSection && (event.key === 'Tab' && event.shiftKey)) {
      dispatch(setFocusedSection('startOnlineGameButton'))
      return
   }

   if (!focusedSection && event.key === 'ArrowDown' || !focusedSection && event.key === 'Tab') {
      dispatch(setFocusedSection('gameModeOnlineSection'))
      return
   }

   const currentFocusedSectionIndex = sections.findIndex(element => element === focusedSection)

   if (event.key === 'ArrowUp' || (event.key === 'Tab' && event.shiftKey)) {
      const prevIndex = (currentFocusedSectionIndex - 1 + sections.length) % sections.length
      dispatch(setFocusedSection(sections[prevIndex]))
      return
   }

   if (event.key === 'ArrowDown' || event.key === 'Tab') {
      const nextIndex = (currentFocusedSectionIndex + 1) % sections.length
      dispatch(setFocusedSection(sections[nextIndex]))
      return
   }


   

   

}
  
   