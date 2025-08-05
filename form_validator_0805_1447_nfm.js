// 代码生成时间: 2025-08-05 14:47:13
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import SimpleSchema from 'simpl-schema';

// Define a schema for form validation
const formSchema = new SimpleSchema({
  name: {
    type: String,
    label: 'Full Name',
    max: 50,
  },
  email: {
    type: String,
    label: 'Email Address',
    regEx: SimpleSchema.RegEx.Email,
  },
  age: {
    type: Number,
    label: 'Age',
    min: 18,
    max: 99,
  },
  // Add more fields as needed
});

// Validated method for form submission
const submitForm = new ValidatedMethod({
  name: 'submitForm',
  validate: formSchema,
  run({ formData }) {
    // Logic to handle form submission goes here
    console.log('Form submitted with data:', formData);
    // For example, save to database, send email, etc.
  },
});

// Helper function to validate form data
function validateFormData(formData) {
  const validationContext = new SimpleSchema(formSchema).newContext();
  validationContext.validate(formData);
  if (validationContext.isValid()) {
    return true;
  } else {
    // Handle validation errors
    throw new Meteor.Error('validation-error', validationContext.keyErrorMessage('short'));
  }
}

// Template for the form
Template.registerHelper('form', function() {
  return {
    onSubmit(event) {
      event.preventDefault();
      const formData = {
        name: event.target.name.value,
        email: event.target.email.value,
        age: event.target.age.value,
      };
      try {
        if (validateFormData(formData)) {
          submitForm.call(formData);
        } else {
          throw new Meteor.Error('invalid-form-data', 'Invalid form data');
        }
      } catch (error) {
        // Handle errors
        console.error('Form submission error:', error);
      }
    },
  };
});

// Export the submitForm method for testing purposes
export { submitForm };
