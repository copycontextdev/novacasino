import { CopyButton } from '@/components/ui/copy-button';
import { formatBalance } from '@/lib/format';
import { SabiAmount, SabiDepositOrder } from '@/types/api.types';
import { DepositOrderPreviewInfo } from '@/types/app.types';
import React from 'react'
 

interface DepositOrderPreviewCardProps  extends DepositOrderPreviewInfo {}


function DepositOrderPreviewCard({
    account_name, account_number, amount, bank_name
}: DepositOrderPreviewCardProps) {

    if(!amount || !bank_name || !account_name || !account_number){
        return null;
    }
  return ( 
       <div className="space-y-3 text-sm mb-4 shadow-md py-2 rounded">
        <div className='flex flex-row gap-4 items-center'>
          <p>
            <span className="text-on-surface-variant">Amount:</span>{" "}
            <span className="font-bold text-primary">{formatBalance(amount)}</span>
          </p>
          <p>
            <span className="text-on-surface-variant">Bank:</span> {bank_name}
          </p>
          </div>
           <p>
            <span className="text-on-surface-variant">Acc:</span> {account_name}
          </p>
             <p>
            <span className="text-on-surface-variant">Acc. #:</span> {account_number}   <CopyButton>
            {account_number}
          </CopyButton>
          </p>
         
        </div> 
  )
}

export default DepositOrderPreviewCard
