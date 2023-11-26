import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
    {
        phoneNumber: { type: String, required: true },
        email: { type: String, required: true },
        linkedId: { type: String },
        linkPrecedence: { type: String },
        deletedAt: { type: Date },
    },
    {
        timestamps: true
    }
);

export const Contact = mongoose.model("contact", contactSchema);