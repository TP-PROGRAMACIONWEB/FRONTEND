"use client"

import type { ReactNode } from "react"
import {
  AlertCircleIcon,
  CancelCircleIcon,
  CheckmarkCircle02Icon,
  InformationCircleIcon,
  Loading03Icon,
} from "hugeicons-react"
import {
  Toaster as Sonner,
  toast,
  type ExternalToast,
  type ToasterProps,
} from "sonner"

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
          <CheckmarkCircle02Icon className="size-4" />
        ),
        info: (
          <InformationCircleIcon className="size-4" />
        ),
        warning: (
          <AlertCircleIcon className="size-4" />
        ),
        error: (
          <CancelCircleIcon className="size-4" />
        ),
        loading: (
          <Loading03Icon className="size-4 animate-spin" />
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
