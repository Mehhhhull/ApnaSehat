import { auth, currentUser } from "@clerk/nextjs/server";
import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import connect from "@/lib/db";
import EmergencyProfile from "@/models/emergency-profile.models";

const newProfile = (fullName: string, clerkId: string) => ({
	clerkId,
	fullName,
	shareToken: randomBytes(18).toString("hex"),
	age: null,
	bloodGroup: "",
	activeTrauma: "",
	allergies: "",
	medicalConditions: "",
	medications: "",
	notes: "",
	contacts: [],
});

export async function GET() {
	const { userId } = await auth();
	if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const user = await currentUser();
	await connect();
	let profile = await EmergencyProfile.findOne({ clerkId: userId }).lean();

	if (!profile) {
		profile = await EmergencyProfile.create(
			newProfile(user?.fullName ?? "ApnaSehat member", userId)
		);
	}

	return NextResponse.json(profile);
}

export async function POST(request: Request) {
	const { userId } = await auth();
	if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const body = await request.json();
	const fullName = typeof body.fullName === "string" ? body.fullName.trim() : "";
	if (!fullName) {
		return NextResponse.json({ error: "Full name is required" }, { status: 400 });
	}

	const age = body.age === "" || body.age === null || body.age === undefined
		? null
		: Number(body.age);
	if (age !== null && (!Number.isInteger(age) || age < 0 || age > 130)) {
		return NextResponse.json({ error: "Age must be a whole number between 0 and 130" }, { status: 400 });
	}

	const contacts = Array.isArray(body.contacts) ? body.contacts : [];
	const cleanContacts = contacts.slice(0, 3).reduce(
		(result: { name: string; relationship: string; phone: string }[], contact: unknown) => {
			if (!contact || typeof contact !== "object") return result;
			const value = contact as Record<string, unknown>;
			if (typeof value.name !== "string" || !value.name.trim() || typeof value.phone !== "string" || !value.phone.trim()) return result;
			result.push({
				name: value.name.trim().slice(0, 80),
				relationship: typeof value.relationship === "string" ? value.relationship.trim().slice(0, 50) : "",
				phone: value.phone.trim().slice(0, 30),
			});
			return result;
		},
		[]
	);

	const fields = ["bloodGroup", "activeTrauma", "allergies", "medicalConditions", "medications", "notes"];
	const update: Record<string, unknown> = { fullName, age, contacts: cleanContacts };
	for (const field of fields) {
		update[field] = typeof body[field] === "string" ? body[field].trim().slice(0, 500) : "";
	}

	await connect();
	const profile = await EmergencyProfile.findOneAndUpdate(
		{ clerkId: userId },
		{ $set: update, $setOnInsert: { clerkId: userId, shareToken: randomBytes(18).toString("hex") } },
		{ upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
	).lean();

	return NextResponse.json(profile);
}
