import { env } from 'next-runtime-env'

export function use302Url() {

  return {
    href:
      env("NEXT_PUBLIC_REGION")
        ? `${env("NEXT_PUBLIC_OFFICIAL_WEBSITE_URL_CHINA")}`
        : `${env("NEXT_PUBLIC_OFFICIAL_WEBSITE_URL_GLOBAL")}`
  }
}
