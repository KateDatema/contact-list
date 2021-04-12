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
const cancelButton = document.getElementById("cancel-button");
const contactList = document.getElementById("contact-list"); // A DIV element

// Build handler for the contact form submission
// As an onclick handler, this function by default takes an event object
// as an argument; we'll want to prevent the automatic refresh of the
// application due to form submission
// https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault
function handleFormSubmit(event) {
  // Prevent refresh
  event.preventDefault();
  // Check for user input; if no input, display alert
  // Otherwise move forward with contact processing
  if (nameInput.value && phoneInput.value) {
    // Process contact based on mode
    if (formMode === "Add") {
      // Build new contact object
      const newContact = {
        id: newContactId,
        name: nameInput.value,
        phone: phoneInput.value
      };
      // Add new contact to contacts array
      contacts.push(newContact);
      // Increment newContactId
      newContactId++;
    } else if (formMode === "Update") {
      // Build updated object
      const updatedContact = {
        id: contactToEdit.id,
        name: nameInput.value,
        phone: phoneInput.value
      };
      // Locate the selected contact in the contacts array
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex
      const contactIndex = contacts.findIndex((contact) => {
        // Return the index of the contact with the ID matching the selected contact ID
        return contact.id === contactToEdit.id;
      });
      // Swap old contact data in contacts array with new data
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice
      contacts.splice(contactIndex, 1, updatedContact);
      // Clear contactToEdit
      contactToEdit = null;
      // Update mode
      formMode = "Add";
    }
    // Clear form
    contactForm.reset();
    // If inputs are currently focused, unfocus them
    nameInput.blur();
    phoneInput.blur();
    // Refresh UI
    refreshMode();
    refreshContacts();
  } else {
    window.alert("Please enter a contact name and phone number.");
  }
}

// Build onclick handler for cancel button
function handleCancel() {
  // Reset contactToEdit
  contactToEdit = null;
  // Update form mode
  formMode = "Add";
}

// Add handlers to form
contactForm.onsubmit = handleFormSubmit;
cancelButton.onclick = handleCancel;

// Build an onclick handler for the update contact button
// Takes a contact ID as an argument
function handleUpdateContact(id) {
  // Find contact in contact list
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
  const contact = contacts.find((contact) => {
    // Return the contact with the ID matching the selected contact ID
    return contact.id === id;
  });
  // Update contactToEdit with contact data
  contactToEdit = contact;
  // Dump contact data into form
  nameInput.value = contact.name;
  phoneInput.value = contact.phone;
  // Update form mode
  formMode = "Update";
  // Refresh UI
  refreshMode();
  // Focus on name input for editing
  nameInput.focus();
}

// Build an onclick handler for the remove contact button
// Takes a contact ID as an argument
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
    // Refresh UI
    refreshContacts();
  }
}

// Build a function that will update the UI
// based on the current mode
function refreshMode() {
  // Update contact form labels
  const label = `${formMode} Contact`;
  formHeading.innerText = label;
  submitButton.innerText = label;
  // Show / hide cancel button
  if (formMode === "Add") {
    cancelButton.classList.add("hidden");
  } else if (formMode === "Update") {
    cancelButton.classList.remove("hidden");
  }
}

// Build a function that refreshes the contact list in the UI
function refreshContacts() {
  // Wipe out existing elements
  // (never fear; we're rebuilding it from scratch here)
  contactList.innerHTML = "";
  // If contacts exist, update UI with data from contact array
  // Otherwise display appropriate message
  if (contacts.length > 0) {
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
          class="contact-option-button"
          onclick="handleUpdateContact(${contact.id})"
        >
          [update]
        </button>
        <button 
          type="button"
          class="contact-option-button"
          onclick="handleRemoveContact(${contact.id})"
        >
          [remove]
        </button>
      `;
      // Add the element to the contact list DIV
      contactList.appendChild(contactElement);
    });
  } else {
    // Create a new element for contact list
    const listMessage = document.createElement("p");
    // Add class to contact element
    listMessage.classList.add("list-message");
    // Build content for message
    listMessage.innerText = "You have no contacts.";
    // Add the element to the contact list DIV
    contactList.appendChild(listMessage);
  }
}

// Update UI on load
refreshMode();
refreshContacts();
