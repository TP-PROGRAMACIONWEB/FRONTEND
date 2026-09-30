import type { ReactNode } from "react"
import Image from "next/image"

type Application_header_props = {
  children?: ReactNode
}

export function Application_header({ children }: Application_header_props) {
  return (
    <header className="flex w-full items-center justify-between gap-4 bg-foreground px-5 py-4 sm:px-6">
      <div className="flex items-center gap-3">
        <Image
          alt="OFFIX"
          className="h-8 w-auto"
          height={32}
          priority
          src="/logos/logo-simple-blanco.png"
          width={32}
        />
        <span className="font-heading text-xl font-extrabold tracking-wide text-background">OFFIX</span>
      </div>
      {children}
    </header>
  )
}
