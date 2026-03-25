import React, { PropsWithChildren } from 'react'
interface AppCardProps extends PropsWithChildren {}
function AppCard({children} : AppCardProps) {
  return (
   <div className="max-w-sm rounded overflow-hidden shadow-lg">
   {children}
</div>
  )
}

export default AppCard
