import { AlertCircleIcon } from "hugeicons-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Review_link_status_props = {
  message: string
  title?: string
}

export function Review_link_status({
  message,
  title = "No se puede completar la reseña",
}: Review_link_status_props) {
  return (
    <main className="grid min-h-screen place-items-center px-5 py-12">
      <Card className="w-full max-w-md text-center shadow-lg">
        <CardHeader className="items-center">
          <AlertCircleIcon className="size-9 text-foreground" />
          <CardTitle className="font-heading text-xl font-extrabold">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{message}</p>
        </CardContent>
      </Card>
    </main>
  )
}
