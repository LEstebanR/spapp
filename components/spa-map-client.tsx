"use client"

import dynamic from "next/dynamic"

export default dynamic(() => import("@/components/spa-map"), { ssr: false })
