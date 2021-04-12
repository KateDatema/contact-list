// Declare variables
let contacts = [
  // Seed with sample contact object
  {
    id: 0,
    name: "SlothWerks",
    phone: "6162586179"
  }
]; // An array of objects
let newContactId = 1; // We'll use this to add ID's to our contacts
// TODO: Implement unique UUID v4 ID's
let formMode = "Add"; // "Add", "Update"
let contactToEdit = null;

// Create references to HTML elements
const contactForm = document.getElementById("contact-form");
const formHeading = document.getElementById("form-heading");
const nameInput = document.getElementById("name-input");
const phoneInput = document.getElementById("phone-input");
const submitButton = document.getElementById("submit-button");
const contactList = document.getElementById("contact-list"); // A DIV element

// Build an onclick handler for the form submission
// As an onclick handler, this function by default takes an event object
// as an argument; we'll want to prevent the automatic refresh of the
// application due to form submission
// https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault
function handleFormSubmit(event) {
  // Prevent refresh
  event.preventDefault();
  // Check for user input; if input exists, build a new contact object
  // and add it to the contacts array
  if (nameInput.value && phoneInput.value) {
    const newContact = {
      id: newContactId,
      name: nameInput.value,
      phone: phoneInput.value
    };
    contacts.push(newContact);
    // Increment newContactId
    newContactId++;
    // Clear form
    contactForm.reset();
    // Refresh contacts in the UI
    refreshContacts();
  } else {
    window.alert("Please enter a contact name and phone number.");
  }
}

// Add handler to form
contactForm.onsubmit = handleFormSubmit;

// Build an onclick handler for the remove contact button
function handleRemoveContact(id) {
  // Find contact in contact list
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
  const contact = contacts.find((contact) => {
    // Return the contact with the ID matching the selected contact ID
    return contact.id === id;
  });
  if (confirm(`Are you sure you want to remove ${contact.name} from your contact list?`)) {
    // Build new contact list using filter
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
    const newContacts = contacts.filter((contact) => {
      // If the contact ID does *not* match the selected ID,
      // add it to a new contacts array
      return contact.id !== id;
    });
    // Update the contacts array
    contacts = newContacts;
    // Refresh contacts in the UI
    refreshContacts();
  }
}

// Build a function that will update the UI
// based on the current mode
function updateMode() {
  // Update contact form labels
  const label = `${formMode} Contact`;
  formHeading.innerText = label;
  submitButton.innerText = label;
}

// Build a function that refreshes the contact list in the UI
function refreshContacts() {
  // Wipe out existing elements
  // (never fear; we're rebuilding it from scratch here)
  contactList.innerHTML = "";
  // Loop through the contacts array and add a contact to
  // the contact list for each object stored
  contacts.forEach(function (contact) {
    // Create a new element for contact
    const contactElement = document.createElement("div");
    // Add class to contact element
    contactElement.classList.add("contact");
    // Add ID to contact element
    contactElement.id = contact.id;
    // Build HTML for contact
    contactElement.innerHTML = `
      <a class="contact-link" href="tel:+1${contact.phone}">${contact.name}</a>
      <button 
        type="button"
        class="update-contact-button"
      >
        [update]
      </button>
      <button 
        type="button"
        class="remove-contact-button"
        onClick="handleRemoveContact(${contact.id})"
      >
        [remove]
      </button>
    `;
    // Add the element to the contact list DIV
    contactList.appendChild(contactElement);
  });
}

// Update UI on load
updateMode();
refreshContacts();
