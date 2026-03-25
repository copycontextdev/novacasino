import { CopyButton } from '@/components/ui/copy-button';
import { formatBalance } from '@/lib/format';
import { SabiAmount, SabiDepositOrder } from '@/types/api.types';
import React from 'react'
 

interface DepositSelectionCardProps {
  amount?: SabiAmount;  
    bank_name?: string;
    account_name?: string;
    account_number?: string;
}


function DepositSelectionCard({
    account_name, account_number, amount, bank_name
}: DepositSelectionCardProps) {

    if(!amount || !bank_name || !account_name || !account_number){
        return null;
    }
  return (
    <div>
       <div className="space-y-3 text-sm mb-4 shadow-md">
          <p>
            <span className="text-on-surface-variant">Amount:</span>{" "}
            <span className="font-bold text-primary">{formatBalance(amount)}</span>
          </p>
          <p>
            <span className="text-on-surface-variant">Bank:</span> {bank_name}
          </p>
           <p>
            <span className="text-on-surface-variant">Account:</span> {account_name}
          </p>
          <div>
             <p>
            <span className="text-on-surface-variant">Account:</span> {account_number}
          </p>
          <CopyButton>
            {account_number}
          </CopyButton>
          </div>
        </div>
    </div>
  )
}

export default DepositSelectionCard
