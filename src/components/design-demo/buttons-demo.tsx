import React, { useState } from 'react'
import AppButton from '../ui/AppButton'
import { Checkbox } from '@headlessui/react'

function ButtonsDemo() {
  const variants = ["primary", "secondary", "danger", "ghost", "outline"]

  const [isLoading, setisLoading] = useState(false)
  const [isDisabled, setIsDisabled] = useState(false)
    
  return (
    <div>
        <div className='flex flex-row'>
            <Checkbox checked={isLoading} onChange={() => setisLoading(!isLoading)} > Loading</Checkbox>
            <Checkbox checked={isDisabled} onChange={() => setIsDisabled(!isDisabled)} > Disabled</Checkbox>
        </div>

        <div className='grid'>
            {
                variants.map((v) => <AppButton key={v} variant={v as any} isLoading={isLoading} disabled={isDisabled}>{v}</AppButton>)
            }
        </div>
      
    </div>
  )
}

export default ButtonsDemo
