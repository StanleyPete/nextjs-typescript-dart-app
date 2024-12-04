import { AppDispatch } from '@/redux/store'
import { setCurrentThrow } from '@/redux/slices/gameRegularSlice'

export const handleThrowChange = (value: string, dispatch: AppDispatch) => {
   dispatch(setCurrentThrow(Number(value)))
}