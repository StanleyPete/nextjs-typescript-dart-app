//Redux
import { AppDispatch } from '@/redux/store'
import { setCurrentThrow } from '@/redux/slices/game-online/gameOnlineSlice'

/* USED IN: ThrowValueSection component (when showNumberButtons === false */

export const handleThrowValueChangeOnline = (
   value: string,
   dispatch: AppDispatch
) => {
   dispatch(setCurrentThrow(Number(value)))
}
