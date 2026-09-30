import { Application_header } from "@/features/navigation/components/application_header"
import { get_review_request } from "@/features/reviews/api/reviews"
import { Review_form } from "@/features/reviews/components/review_form"
import { Review_link_status } from "@/features/reviews/components/review_link_status"

export const dynamic = "force-dynamic"

type Review_page_props = {
  params: Promise<{ code: string }>
}

export default async function Review_page({ params }: Review_page_props) {
  const { code } = await params
  const result = await get_review_request(code)

  if (!result.ok) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Application_header />
        <Review_link_status message={result.message} />
      </div>
    )
  }

  if (!result.data.utilizable) {
    const message = result.data.vencida
      ? "El plazo para usar este enlace ya venció."
      : "Este enlace ya fue utilizado o dejó de estar disponible."

    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Application_header />
        <Review_link_status message={message} />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Application_header />
      <Review_form review_request={result.data} />
    </div>
  )
}
