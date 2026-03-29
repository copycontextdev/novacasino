import UIDemo from '@/components/design-demo/ui-demo'
import React from 'react'
import { useNavigate } from 'react-router-dom';

function UiPlayground() {
      const navigate = useNavigate();
    
  return (
    <div className='flex'>
        <div className='flex flex-row'>
            <button onClick={() => navigate('/')}>Back</button>
        </div>
        <UIDemo />
      
    </div>
  )
}

export default UiPlayground
