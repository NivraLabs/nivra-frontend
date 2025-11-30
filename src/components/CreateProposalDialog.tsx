import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useNavigate } from "react-router-dom";

type Props = {
  onCreate?: (payload: {
    title: string;
    description: string;
    cid: string;
  }) => void;
};

export function FaucetButton() {
  const navigate = useNavigate();

  return (
    <button className="btn btn-primary" onClick={() => navigate("/faucet")}>
      NVR Faucet
    </button>
  );
}

export default function CreateProposalDialog({ onCreate }: Props) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [cid, setCid] = useState<string | null>(null);

  async function mockUpload() {
    setUploading(true);
    await new Promise((r) => setTimeout(r, 700));
    const fakeCid = "bafy" + Math.random().toString(36).slice(2, 9);
    setCid(fakeCid);
    setUploading(false);
    return fakeCid;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    let usedCid = cid;
    if (!usedCid) {
      usedCid = await mockUpload();
    }
    onCreate?.({ title, description, cid: usedCid });
    setTitle("");
    setDescription("");
    setCid(null);
    setOpen(false);
  }

  return <FaucetButton />;
}
