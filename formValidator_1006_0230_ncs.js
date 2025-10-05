// 代码生成时间: 2025-10-06 02:30:21
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

// Define a schema for our form
const formSchema = new SimpleSchema({
    email: {
        type: String,
        label: "Email",
        regEx: SimpleSchema.RegEx.Email
    },
    name: {
        type: String,
        label: "Name"
    },
    age: {
        type: Number,
        label: "Age",
        min: 18
    }
});

// FormValidator class
class FormValidator {
    /**
     * Validate form data
     * @param {Object} formData - The data to validate
     * @returns {Object} - An object containing validation result and error messages
     */
    validate(formData) {
        const result = formSchema.validate(formData);
        if (result !== true) {
            // If validation fails, return the error messages
            return {
                isValid: false,
                errors: formSchema.namedContext().validationErrors()
            };
        }
        // If validation passes, return true
        return { isValid: true };
    }
}

// Example usage
const validator = new FormValidator();
const formData = {
    email: 'user@example.com',
    name: 'John Doe',
    age: 25
};

// Validate the form data
const validationResult = validator.validate(formData);
console.log(validationResult);
