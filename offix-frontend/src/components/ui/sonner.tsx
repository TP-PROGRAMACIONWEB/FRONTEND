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
  return toast.error(message, {
    ...options,
    duration: error_toast_duration,
    position: "top-right",
    style: {
      background: "#EF4444",
      color: "#F0F4EF",
      border: "1px solid #B91C1C",
      ...options?.style,
    },
  })
}

function show_success_toast(message: ReactNode, options?: Toast_options) {
  return toast.success(message, {
    ...options,
    duration: success_toast_duration,
    position: "top-right",
    style: {
      background: "#10B981",
      color: "#F0F4EF",
      border: "1px solid #047857",
      ...options?.style,
    },
  })
}

function show_info_toast(message: ReactNode, options?: Toast_options) {
  return toast.info(message, {
    ...options,
    duration: success_toast_duration,
    position: "top-right",
    style: {
      background: "#3B82F6",
      color: "#F0F4EF",
      border: "1px solid #1D4ED8",
      ...options?.style,
    },
  })
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

export { Toaster, show_error_toast, show_success_toast, show_info_toast }
