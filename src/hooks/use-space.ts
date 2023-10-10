import { useParams } from 'react-router-dom'

export const useSpaceId = () => {
  const { spaceId } = useParams()

  return spaceId || 'PUBLIC'
}
