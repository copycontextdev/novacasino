/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { X } from "lucide-react";
import type { NovaMemberProfile } from "@/types/api.types";

interface EditProfileModalProps {
  open: boolean;
  member: NovaMemberProfile;
  onClose: () => void;
  onSave: (b: { first_name?: string; last_name?: string; email?: string }) => void;
  isSubmitting: boolean;
}

const EditProfileModal = ({
  open,
  member,
  onClose,
  onSave,
  isSubmitting,
}: EditProfileModalProps) => {
  const [first, setFirst] = useState(member?.first_name ?? "");
  const [last, setLast] = useState(member?.last_name ?? "");
  const [email, setEmail] = useState(member?.email ?? "");

  useEffect(() => {
    if (open && member) {
      setFirst(member.first_name ?? "");
      setLast(member.last_name ?? "");
      setEmail(member.email ?? "");
    }
  }, [open, member]);

  if (!open) return null;

  return (
    <motion.div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 px-4">
      <div className="w-full max-w-md bg-surface-container rounded-3xl border border-white/10 p-6">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-headline font-extrabold">Edit profile</h2>
          <button type="button" onClick={onClose}>
            <X />
          </button>
        </div>
        <div className="space-y-3">
          <input className="w-full bg-surface-container-high rounded-2xl py-3 px-4 border border-white/5" value={first} onChange={(e) => setFirst(e.target.value)} placeholder="First name" />
          <input className="w-full bg-surface-container-high rounded-2xl py-3 px-4 border border-white/5" value={last} onChange={(e) => setLast(e.target.value)} placeholder="Last name" />
          <input className="w-full bg-surface-container-high rounded-2xl py-3 px-4 border border-white/5" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" />
        </div>
        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => onSave({ first_name: first, last_name: last, email })}
          className="w-full mt-4 py-4 rounded-full bg-gradient-to-r from-primary to-primary-dim text-on-primary font-extrabold"
        >
          Save
        </button>
      </div>
    </motion.div>
  );
};

export default EditProfileModal;
