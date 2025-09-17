import * as React from "react"

import { Loader2, Lock, User } from "lucide-react"

export const Icons = {
  spinner: Loader2,
  lock: Lock,
  user: User,
  google: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...props}>
      <path
        d="M12 11.989h11.51c.064.352.117.704.117 1.179C23.627 18.5 19.8 22 12.018 22 5.393 22 0 16.837 0 10.999 0 5.162 5.393 0 12.018 0c3.243 0 5.95 1.149 7.97 3.02l-3.241 3.086c-.856-.822-2.357-1.778-4.73-1.778-4.07 0-7.39 3.375-7.39 7.671 0 4.294 3.32 7.669 7.39 7.669 4.713 0 6.479-3.221 6.76-5.269h-6.78v-4.41Z"
        fill="currentColor"
      />
    </svg>
  ),
}
