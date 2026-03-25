import { CopyButton } from '@/components/ui/copy-button';
import { SabiAgentBankInfo } from '@/types/api.types';
import { Radio, RadioGroup } from '@headlessui/react' 
import { CheckCircleIcon } from 'lucide-react'
import { useState } from 'react'
 
interface AgentAccountSelectGroupProps { 
      agentAccounts: SabiAgentBankInfo[]; 
      selectedAccountUuid: string; 
      onChange: (v: string) => void; 
}

export default function AgentAccountSelectGroup({agentAccounts, onChange, selectedAccountUuid}: AgentAccountSelectGroupProps) {
 
    const selected = agentAccounts.find((a) => a.uuid === selectedAccountUuid);
 
  return (
    <div className="w-full">
      <div className="mx-auto w-full max-w-md ">
        <RadioGroup by="uuid" value={selected} onChange={(agent) => onChange(agent.uuid)} aria-label="Server size" className="space-y-2">
          {agentAccounts.map((agent) => (
            <Radio
              key={agent.uuid}
              value={agent}
              className="group relative flex cursor-pointer rounded-lg bg-white/5 px-2 py-4 text-white shadow-md transition focus:not-data-focus:outline-none data-checked:bg-white/10 data-focus:outline data-focus:outline-white"
            >
              <div className="flex w-full items-center justify-between">
                <div className="text-sm/6">
                  <p className="font-semibold text-white">{agent.account_name}</p>
                  <div className="flex flex-row gap-2 text-white">
                    <div>{agent.account_number} <CopyButton>
                        {agent.account_number}
                        </CopyButton></div> 
                  </div>
                </div>
                <CheckCircleIcon className="size-6 fill-yellow opacity-0 transition group-data-checked:opacity-100" />
              </div>
            </Radio>
          ))}
        </RadioGroup>
      </div>
    </div>
  )
}
