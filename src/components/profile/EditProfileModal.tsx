import React, { useState, useEffect } from "react";
import type { NovaMemberProfile } from "@/types/api.types";
import AppModal from "@/components/ui/AppModal";

interface EditProfileModalProps {
  open: boolean;
  member: NovaMemberProfile;
  onClose: () => void;
  onSave: (b: { first_name?: string; last_name?: string; email?: string }) => void;
  isSubmitting: boolean;
}

const EditProfileModal = ({ open, member, onClose, onSave, isSubmitting }: EditProfileModalProps) => {
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

  return (
    <AppModal open={open} onClose={onClose} title="Edit profile" isLoading={isSubmitting}>
      <div className="flex flex-col gap-3">
        <input
          className="w-full bg-surface-container-high rounded-2xl py-3 px-4 border border-white/5"
          value={first}
          onChange={(e) => setFirst(e.target.value)}
          placeholder="First name"
        />
        <input
          className="w-full bg-surface-container-high rounded-2xl py-3 px-4 border border-white/5"
          value={last}
          onChange={(e) => setLast(e.target.value)}
          placeholder="Last name"
        />
        <input
          className="w-full bg-surface-container-high rounded-2xl py-3 px-4 border border-white/5"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          type="email"
        />
        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => onSave({ first_name: first, last_name: last, email })}
          className="w-full mt-1 py-4 rounded-full bg-gradient-to-r from-primary to-primary-dim text-on-primary font-extrabold disabled:opacity-50"
        >
          {isSubmitting ? "Saving…" : "Save"}
        </button>
      </div>
    </AppModal>
  );
};

export default EditProfileModal;
