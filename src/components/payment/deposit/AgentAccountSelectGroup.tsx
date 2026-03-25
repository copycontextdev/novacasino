import { CopyButton } from '@/components/ui/copy-button';
import { SabiAgentBankInfo } from '@/types/api.types';
import { Radio, RadioGroup } from '@headlessui/react' 
import { CheckCircleIcon, InboxIcon, Loader2 } from 'lucide-react'
import { useState } from 'react'
 
interface AgentAccountSelectGroupProps { 
      agentAccounts: SabiAgentBankInfo[]; 
      selectedAccountUuid: string; 
      onChange: (v: string) => void; 
      isLoading?: boolean;
}

export default function AgentAccountSelectGroup({agentAccounts, onChange, selectedAccountUuid, isLoading}: AgentAccountSelectGroupProps) {
 
    const selected = agentAccounts.find((a) => a.uuid === selectedAccountUuid) ?? null;
 
  return (
    <div className="w-full">
      <div className="mx-auto w-full max-w-md">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-3">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-sm text-on-surface-variant">Fetching agent accounts...</p>
          </div>
        ) : agentAccounts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 px-4 text-center space-y-3 bg-white/5 rounded-2xl border border-dashed border-white/10">
            <InboxIcon className="w-10 h-10 text-white/20" />
            <div>
              <p className="text-sm font-semibold text-white">No accounts available</p>
              <p className="text-xs text-on-surface-variant mt-1">Try another bank or check back later</p>
            </div>
          </div>
        ) : (
          <RadioGroup by="uuid" value={selected} onChange={(agent) => agent && onChange(agent.uuid)} aria-label="Agent account selection" className="space-y-2">
            {agentAccounts.map((agent) => (
              <Radio
                key={agent.uuid}
                value={agent}
                className="group relative flex cursor-pointer rounded-lg bg-white/5 px-4 py-4 text-white shadow-md transition focus:not-data-focus:outline-none data-checked:bg-white/10 data-focus:outline data-focus:outline-white"
              >
                <div className="flex w-full items-center justify-between">
                  <div className="text-sm/6">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-white">{agent.account_name}</p>
                      <CopyButton value={agent.account_number} />
                    </div>
                    <div className="flex flex-row gap-2 text-on-surface-variant">
                      <p>{agent.account_number}</p> 
                    </div>
                  </div>
                  <CheckCircleIcon className="size-6 text-primary opacity-0 transition group-data-checked:opacity-100" />
                </div>
              </Radio>
            ))}
          </RadioGroup>
        )}
      </div>
    </div>
  )
}
