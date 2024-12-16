//Redux
import { AppDispatch } from '@/redux/store'
import { setCurrentThrow } from '@/redux/slices/gameClassicSlice'

/* USED IN: ThrowValueSection component (when showNumberButtons === false */

export const handleThrowValueChange = (
   value: string,
   dispatch: AppDispatch
) => {
   dispatch(setCurrentThrow(Number(value)))
}

