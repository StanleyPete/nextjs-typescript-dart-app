import { AppDispatch } from '@/redux/store'
import { setCurrentThrow } from '@/redux/slices/gameRegularSlice'
import { setCurrentThrow as setCurrentThrowTeams } from '@/redux/slices/gameRegularTeamsSlice'

export const handleThrowChangeRegular = (value: string, dispatch: AppDispatch) => {
   dispatch(setCurrentThrow(Number(value)))
}

export const handleThrowChangeTeams = (value: string, dispatch: AppDispatch) => {
   dispatch(setCurrentThrowTeams(Number(value)))
}