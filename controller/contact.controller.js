import { Contact } from "../model/contact.model.js";

export const identifyController = async (req, res) => {
    try {
        const { email, phoneNumber } = req.body;

        const existingContactEmail = await Contact.findOne({ email }).lean();
        const existingContactPhoneNumber = await Contact.findOne({ phoneNumber }).lean();

        let response;

        if (existingContactEmail) {
            if (existingContactEmail.phoneNumber === phoneNumber) {
                //secondary
                const secondaryContact = await Contact.create({
                    email,
                    phoneNumber,
                    linkPrecedence: "secondary",
                    linkedId: existingContactEmail._id,
                });
                const createdContact = await Contact.findById(secondaryContact._id).lean();
                response = {
                    email: createdContact.email,
                    phoneNumber: createdContact.phoneNumber,
                    primaryContactId: existingContactEmail._id,
                    secondaryContactId: createdContact._id,
                }
            } else {
                //error
                throw new Error("An error occured, please try again later");
            }
        } else if (existingContactPhoneNumber) {
            //error
            throw new Error("An error occured, please try again later");
        } else {
            // primary
            const primaryContact = await Contact.create({
                email,
                phoneNumber,
                linkPrecedence: "primary",
            });

            const createdContact = await Contact.findById(primaryContact._id).lean();
            response = {
                email: createdContact.email,
                phoneNumber: createdContact.phoneNumber,
                primaryContactId: createdContact._id,
                secondaryContactId: null,
            }
        }
        return res.status(200).send(response);
    } catch (error) {
        return res.status(404).send(error.message);
    }
}