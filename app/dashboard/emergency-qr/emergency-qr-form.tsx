"use client";

import { QRCodeSVG } from "qrcode.react";
import { Plus, Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

type Contact = { name: string; relationship: string; phone: string };
type Profile = {
	fullName: string;
	shareToken: string;
	age: number | null;
	bloodGroup: string;
	activeTrauma: string;
	allergies: string;
	medicalConditions: string;
	medications: string;
	notes: string;
	contacts: Contact[];
};

const blank: Profile = {
	fullName: "",
	shareToken: "",
	age: null,
	bloodGroup: "",
	activeTrauma: "",
	allergies: "",
	medicalConditions: "",
	medications: "",
	notes: "",
	contacts: [],
};

const inputClass = "mt-2 w-full rounded-xl border border-[#dce9e4] bg-[#fbfdfc] px-4 py-3 text-sm text-[#163c34] outline-none placeholder:text-[#a2b3ad] focus:border-[#2f7a62] focus:ring-2 focus:ring-[#2f7a62]/10";

function TextField({ label, value, onChange, placeholder, required = false }: { label: string; value: string; onChange: (value: string) => void; placeholder: string; required?: boolean }) {
	return <label className="block"><span className="text-sm font-semibold text-[#163c34]">{label}{required ? " *" : ""}</span><input required={required} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className={inputClass} /></label>;
}

export default function EmergencyQrForm() {
	const [profile, setProfile] = useState<Profile>(blank);
	const [status, setStatus] = useState("Loading your profile...");
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		fetch("/api/emergency-profile", { cache: "no-store" })
			.then(async (response) => { if (!response.ok) throw new Error(); return response.json(); })
			.then((data: Profile) => { setProfile({ ...blank, ...data }); setStatus(""); })
			.catch(() => setStatus("Could not load your profile. Refresh and try again."));
	}, []);

	const update = (key: keyof Profile, value: string) => setProfile((current) => ({ ...current, [key]: value }));
	const appOrigin = typeof window !== "undefined" ? (process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || window.location.origin) : "";
	const shareUrl = profile.shareToken && appOrigin ? `${appOrigin}/emergency/${profile.shareToken}` : "";

	async function save() {
		setSaving(true);
		setStatus("");
		try {
			const response = await fetch("/api/emergency-profile", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(profile) });
			const data = await response.json();
			if (!response.ok) throw new Error(data.error ?? "Could not save profile");
			setProfile({ ...blank, ...data });
			setStatus("Saved successfully.");
		} catch (error) {
			setStatus(error instanceof Error ? error.message : "Could not save profile");
		} finally {
			setSaving(false);
		}
	}

	function updateContact(index: number, key: keyof Contact, value: string) {
		setProfile((current) => ({ ...current, contacts: current.contacts.map((contact, contactIndex) => contactIndex === index ? { ...contact, [key]: value } : contact) }));
	}

	return <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
		<section className="rounded-2xl border border-[#dce9e4] bg-white p-6 shadow-sm sm:p-8">
			<div className="mb-7"><h2 className="text-xl font-semibold text-[#163c34]">Your emergency details</h2><p className="mt-1 text-sm leading-6 text-[#6f837c]">Only details entered here will be visible when someone scans your QR code.</p></div>
			<div className="grid gap-5 sm:grid-cols-2">
				<TextField label="Full name" value={profile.fullName} onChange={(value) => update("fullName", value)} placeholder="e.g. Mehul Kumar" required />
				<label className="block"><span className="text-sm font-semibold text-[#163c34]">Age</span><input type="number" min="0" max="130" value={profile.age ?? ""} onChange={(event) => setProfile((current) => ({ ...current, age: event.target.value ? Number(event.target.value) : null }))} placeholder="e.g. 28" className={inputClass} /></label>
				<label className="block"><span className="text-sm font-semibold text-[#163c34]">Blood group</span><select value={profile.bloodGroup} onChange={(event) => update("bloodGroup", event.target.value)} className={inputClass}><option value="">Select blood group</option>{["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((group) => <option key={group}>{group}</option>)}</select></label>
				<TextField label="Active trauma or injury" value={profile.activeTrauma} onChange={(value) => update("activeTrauma", value)} placeholder="e.g. Fractured left arm" />
				<TextField label="Allergies" value={profile.allergies} onChange={(value) => update("allergies", value)} placeholder="e.g. Penicillin, peanuts" />
				<TextField label="Medical conditions" value={profile.medicalConditions} onChange={(value) => update("medicalConditions", value)} placeholder="e.g. Asthma, diabetes" />
				<TextField label="Current medications" value={profile.medications} onChange={(value) => update("medications", value)} placeholder="e.g. Metformin 500mg" />
				<TextField label="Additional notes" value={profile.notes} onChange={(value) => update("notes", value)} placeholder="Anything responders should know" />
			</div>
			<div className="mt-8 border-t border-[#e5eeeb] pt-7"><div className="flex items-center justify-between gap-4"><div><h2 className="text-xl font-semibold text-[#163c34]">Emergency contacts</h2><p className="mt-1 text-sm text-[#6f837c]">People a responder can call for you.</p></div>{profile.contacts.length < 3 ? <button type="button" onClick={() => setProfile((current) => ({ ...current, contacts: [...current.contacts, { name: "", relationship: "", phone: "" }] }))} className="flex shrink-0 items-center gap-2 rounded-xl border border-[#b9d6ca] px-3 py-2 text-sm font-semibold text-[#2f7a62] hover:bg-[#f1f8f4]"><Plus size={16} />Add contact</button> : null}</div><div className="mt-4 space-y-3">{profile.contacts.map((contact, index) => <div key={`${index}-${contact.phone}`} className="grid gap-3 rounded-xl bg-[#f4f8f6] p-4 sm:grid-cols-[1fr_1fr_1fr_auto]"><input aria-label="Contact name" value={contact.name} onChange={(event) => updateContact(index, "name", event.target.value)} placeholder="Name" className="rounded-lg border border-[#dce9e4] bg-white px-3 py-2 text-sm outline-none focus:border-[#2f7a62]" /><input aria-label="Relationship" value={contact.relationship} onChange={(event) => updateContact(index, "relationship", event.target.value)} placeholder="Relationship" className="rounded-lg border border-[#dce9e4] bg-white px-3 py-2 text-sm outline-none focus:border-[#2f7a62]" /><input aria-label="Phone number" value={contact.phone} onChange={(event) => updateContact(index, "phone", event.target.value)} placeholder="Phone number" className="rounded-lg border border-[#dce9e4] bg-white px-3 py-2 text-sm outline-none focus:border-[#2f7a62]" /><button type="button" aria-label="Remove contact" onClick={() => setProfile((current) => ({ ...current, contacts: current.contacts.filter((_, contactIndex) => contactIndex !== index) }))} className="flex h-10 items-center justify-center rounded-lg px-2 text-[#c35447] hover:bg-white"><Trash2 size={17} /></button></div>)}</div></div>
			<div className="mt-8 flex flex-wrap items-center gap-4"><button type="button" onClick={save} disabled={saving || !profile.fullName} className="flex items-center gap-2 rounded-xl bg-[#2f7a62] px-5 py-3 text-sm font-semibold text-white hover:bg-[#255f4d] disabled:cursor-not-allowed disabled:opacity-50"><Save size={17} />{saving ? "Saving..." : "Save emergency profile"}</button>{status ? <span className="text-sm text-[#6f837c]">{status}</span> : null}</div>
		</section>
		<aside className="h-fit rounded-2xl border border-[#dce9e4] bg-[#163c34] p-6 text-white shadow-sm xl:sticky xl:top-8"><p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#9dcab7]">Scan preview</p><h2 className="mt-2 text-xl font-semibold">Your emergency QR</h2><p className="mt-2 text-sm leading-6 text-[#c2d5ce]">Anyone with the code can view the details you saved.</p><div className="mx-auto mt-7 flex aspect-square max-w-[240px] items-center justify-center rounded-2xl bg-white p-4">{shareUrl ? <QRCodeSVG value={shareUrl} size={208} level="M" includeMargin /> : <span className="text-center text-sm text-[#6f837c]">Loading QR code...</span>}</div>{shareUrl ? <a href={shareUrl} target="_blank" rel="noreferrer" className="mt-5 block text-center text-sm font-semibold text-[#a9ddc7] underline underline-offset-4">Open public profile</a> : null}</aside>
	</div>;
}
