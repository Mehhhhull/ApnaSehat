import { notFound } from "next/navigation";
import connect from "@/lib/database";
import EmergencyProfile from "@/models/emergency-profile.models";

type EmergencyContact = { name: string; relationship?: string; phone: string };

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function EmergencySharePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  await connect();
  const profile = await EmergencyProfile.findOne({ shareToken: token }).lean();

  if (!profile) notFound();

  const details = [
    ["Active trauma or injury", profile.activeTrauma],
    ["Allergies", profile.allergies],
    ["Medical conditions", profile.medicalConditions],
    ["Current medications", profile.medications],
    ["Additional notes", profile.notes],
  ];

  return (
    <main className="min-h-screen bg-[#eef3f1] px-5 py-8 text-[#163c34] sm:px-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#163c34] text-xl font-semibold text-white">a</div>
          <div><div className="font-semibold">ApnaSehat</div><div className="text-xs text-[#6f837c]">Emergency health profile</div></div>
        </div>
        <section className="rounded-2xl border border-[#dce9e4] bg-white p-6 shadow-sm sm:p-8">
          <div className="border-b border-[#e5eeeb] pb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#c35447]">Emergency information</p>
            <h1 className="mt-2 text-3xl font-semibold">{profile.fullName}</h1>
            {profile.age !== null && profile.age !== undefined ? <p className="mt-2 text-sm text-[#6f837c]">Age: <strong className="text-[#163c34]">{profile.age}</strong></p> : null}
            {profile.bloodGroup ? <p className="mt-2 text-sm text-[#6f837c]">Blood group: <strong className="text-[#163c34]">{profile.bloodGroup}</strong></p> : null}
          </div>
          <div className="grid gap-5 py-6 sm:grid-cols-2">
            {details.map(([label, value]) => value ? <div key={label}><h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6f837c]">{label}</h2><p className="mt-2 text-[15px] leading-6">{value}</p></div> : null)}
          </div>
          {profile.contacts.length ? <div className="border-t border-[#e5eeeb] pt-6"><h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6f837c]">Emergency contacts</h2><div className="mt-3 space-y-3">{profile.contacts.map((contact: EmergencyContact) => <div key={`${contact.name}-${contact.phone}`} className="flex items-center justify-between gap-4 rounded-xl bg-[#f4f8f6] p-4"><div><p className="font-semibold">{contact.name}</p><p className="text-sm text-[#6f837c]">{contact.relationship || "Emergency contact"}</p></div><a className="font-semibold text-[#2f7a62]" href={`tel:${contact.phone}`}>{contact.phone}</a></div>)}</div></div> : null}
        </section>
        <p className="mt-5 text-center text-xs text-[#6f837c]">If this is an emergency, contact local emergency services.</p>
      </div>
    </main>
  );
}
