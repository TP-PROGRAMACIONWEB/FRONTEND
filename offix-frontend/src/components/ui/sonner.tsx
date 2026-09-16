"use client"

import type { ReactNode } from "react"
import {
  Toaster as Sonner,
  toast,
  type ExternalToast,
  type ToasterProps,
} from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const error_toast_duration = 5000
const success_toast_duration = 3000

type Toast_options = Omit<ExternalToast, "duration">

function show_error_toast(message: ReactNode, options?: Toast_options) {
  return toast.error(message, { ...options, duration: error_toast_duration })
}

function show_success_toast(message: ReactNode, options?: Toast_options) {
  return toast.success(message, { ...options, duration: success_toast_duration })
}

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      icons={{
        success: (
          <CircleCheckIcon className="size-4" />
        ),
        info: (
          <InfoIcon className="size-4" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4" />
        ),
        error: (
          <OctagonXIcon className="size-4" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin" />
        ),
      }}
      toastOptions={{
        classNames: {
          toast: "cn-toast",
        },
      }}
      {...props}
    />
  )
}

export { Toaster, show_error_toast, show_success_toast }
