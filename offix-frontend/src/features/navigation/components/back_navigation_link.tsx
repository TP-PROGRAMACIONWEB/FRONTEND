import { ArrowLeft01Icon } from "hugeicons-react"
import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"

type Back_navigation_link_props = {
  href: string
  label: string
}

export function Back_navigation_link({ href, label }: Back_navigation_link_props) {
  return (
    <Link
      className={buttonVariants({
        variant: "ghost",
        className: "h-11 w-full text-foreground/70 hover:text-foreground",
      })}
      href={href}
    >
      <ArrowLeft01Icon aria-hidden="true" data-icon="inline-start" />
      {label}
    </Link>
  )
}
