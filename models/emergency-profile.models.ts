import { Schema, model, models } from "mongoose";

const EmergencyContactSchema = new Schema(
	{
		name: { type: String, required: true, trim: true, maxlength: 80 },
		relationship: { type: String, trim: true, maxlength: 50 },
		phone: { type: String, required: true, trim: true, maxlength: 30 },
	},
	{ _id: false }
);

const EmergencyProfileSchema = new Schema(
	{
		clerkId: { type: String, required: true, unique: true, index: true },
		shareToken: { type: String, required: true, unique: true, index: true },
		fullName: { type: String, required: true, trim: true, maxlength: 100 },
		age: { type: Number, min: 0, max: 130 },
		bloodGroup: { type: String, trim: true, maxlength: 10 },
		activeTrauma: { type: String, trim: true, maxlength: 500 },
		allergies: { type: String, trim: true, maxlength: 500 },
		medicalConditions: { type: String, trim: true, maxlength: 500 },
		medications: { type: String, trim: true, maxlength: 500 },
		notes: { type: String, trim: true, maxlength: 500 },
		contacts: { type: [EmergencyContactSchema], default: [], maxlength: 3 },
	},
	{ timestamps: true }
);

const EmergencyProfile =
	models.EmergencyProfile || model("EmergencyProfile", EmergencyProfileSchema);

export default EmergencyProfile;
