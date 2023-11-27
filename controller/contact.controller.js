import { Contact } from "../model/contact.model.js";

export const identifyController = async (req, res) => {
    try {
        const { email, phoneNumber } = req.body;

        const existingContactEmails = await Contact.find({ email });
        const existingContactPhoneNumbers = await Contact.find({ phoneNumber });
        let response;
        if (!existingContactEmails.length && !existingContactPhoneNumbers.length) {
            //create primary contact
            const contact = await Contact.create({
                email,
                phoneNumber,
                linkPrecedence: "primary",
            });
            response = {
                primaryContactId: contact._id,
                emails: contact.email,
                phoneNumbers: contact.phoneNumber,
                secondaryContactIds: null,
            }

        } else if (!existingContactEmails.length && existingContactPhoneNumbers) {
            //create secondary contact
            let emails = [];
            let phoneNumbers = [];
            let secondaryContactIds = [];
            const randPhoneNumber = existingContactPhoneNumbers[0];
            const id = randPhoneNumber.linkPrecedence === 'primary' ? randPhoneNumber._id : randPhoneNumber.linkedId;

            const contact = await Contact.create({
                email,
                phoneNumber,
                linkPrecedence: "secondary",
                linkedId: id.toString(),
            });

            const contacts = await Contact.find({ linkedId: id });
            
            const primaryContact = await Contact.findById(id);
            emails.push(primaryContact.email);
            phoneNumbers.push(primaryContact.phoneNumber);

            contacts.forEach(contact => {
                emails.push(contact.email);
                phoneNumbers.push(contact.phoneNumber);
                secondaryContactIds.push(contact._id);
            });

            response = {
                primaryContactId: primaryContact._id,
                emails,
                phoneNumbers,
                secondaryContactIds,
            }

        } else if (existingContactEmails && !existingContactPhoneNumbers.length) {
            //create secondary contact
            let emails = [];
            let phoneNumbers = [];
            let secondaryContactIds = [];
            const randEmail = existingContactEmails[0];
            const id = randEmail.linkPrecedence === 'primary' ? randEmail._id : randEmail.linkedId;

            const contact = await Contact.create({
                email,
                phoneNumber,
                linkPrecedence: "secondary",
                linkedId: id.toString(),
            });

            const contacts = await Contact.find({ linkedId: id });

            const primaryContact = await Contact.findById(id);
            emails.push(primaryContact.email);
            phoneNumbers.push(primaryContact.phoneNumber);

            contacts.forEach(contact => {
                emails.push(contact.email);
                phoneNumbers.push(contact.phoneNumber);
                secondaryContactIds.push(contact._id);
            });

            response = {
                primaryContactId: primaryContact._id,
                emails,
                phoneNumbers,
                secondaryContactIds,
            }
        } else {
            let phoneNumberMatch = false;
            existingContactEmails.map((contact) => {
                if (contact.phoneNumber === phoneNumber) {
                    phoneNumberMatch = true;
                    return;
                }
            });
            if (!phoneNumberMatch) {
                //throwError
                throw new Error("An error occured, please try again later");
            }
            let emailMatch = false;
            existingContactPhoneNumbers.map((contact) => {
                if (contact.email === email) {
                    emailMatch = true;
                    return;
                }
            });
            if (!emailMatch) {
                //throwError
                throw new Error("An error occured, please try again later");
            }
            //create secondary contact
            let emails = [];
            let phoneNumbers = [];
            let secondaryContactIds = [];
            const randPhoneNumber = existingContactPhoneNumbers[0];
            const id = randPhoneNumber.linkPrecedence === 'primary' ? randPhoneNumber._id : randPhoneNumber.linkedId;

            const contact = await Contact.create({
                email,
                phoneNumber,
                linkPrecedence: "secondary",
                linkedId: id.toString(),
            });

            const contacts = await Contact.find({ linkedId: id });

            const primaryContact = await Contact.findById(id);
            emails.push(primaryContact.email);
            phoneNumbers.push(primaryContact.phoneNumber);

            contacts.forEach(contact => {
                emails.push(contact.email);
                phoneNumbers.push(contact.phoneNumber);
                secondaryContactIds.push(contact._id);
            });

            response = {
                primaryContactId: primaryContact._id,
                emails,
                phoneNumbers,
                secondaryContactIds,
            }
        }
        return res.status(200).send(response);
    } catch (error) {
        return res.status(404).send(error.message);
    }
}