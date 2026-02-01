import { CareerEditPage } from '@/features/career-edit'

interface CareerEditRouteProps {
  params: Promise<{ id: string }>
}

export default async function CareerEditRoutePage({
  params,
}: CareerEditRouteProps) {
  const { id } = await params
  return <CareerEditPage cardId={id} />
}
