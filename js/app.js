;(function() {

  "use strict";

  //
  // Variables
  //

  var data = localStorage.getItem("data");
  var form = document.querySelector("form");


  //
  // Functions
  //

  /**
   * Populate the form with existing values
   */
  function populateForm(data) {
    // Bail if the data doesn't exist
    if (!data) return;

    // Parse the JSON data
    data = JSON.parse(data);

    // Add each value to the DOM
    for (var field in data) {
      switch (field) {
        case "superheroes":
          data[field].forEach(function(superhero) {
            document.querySelector("[name='" + superhero + "']").checked = true;
          });
          break;
        case "tos":
          var savedValue = data[field];
          var field = Array.prototype.slice.call(document.querySelectorAll("[name='" + field + "']")).filter(function(field) {
            return field.value === savedValue;
          })[0];
          field.checked = true;
          break;
        default:
          document.querySelector("[name='" + field + "']").value = data[field];
      }
    }
  }

  /**
   * Add an item to a JSON object in local storage
   * (c) 2019 Chris Ferdinandi, MIT License, https://gomakethings.com
   */
  function addToLocalStorageObject(name, key, value) {
    // Get the existing data
    var existing = localStorage.getItem(name);

    // If no existing data, create an object literal
    // Otherwise, convert the localStorage string into an object literal
    existing = existing ? JSON.parse(existing) : {};

    // Add new data to localStorage object
    existing[key] = value;

    // Save back to localStorage
    localStorage.setItem(name, JSON.stringify(existing));
  }

  /**
   * Save a form field's value to local storage
   */
  function saveData(event) {
    // Get the current field's name attribute
    var fieldName = event.target.getAttribute("name");

    // Create a variable to store the current field's value
    var value = (event.target.type === "checkbox") ? [] : "";

    // Bail if the field's name attribute is falsy
    if (!fieldName) return;

    switch (event.target.type) {
      // If a radio, ONLY get the checked value
      case "radio":
        value += document.querySelector("[name='" + fieldName + "']:checked").value;
        break;
      // If a checkbox, get ALL checked values and store as an array
      case "checkbox":
        var checked = Array.prototype.slice.call(
          event.target.closest("div").querySelectorAll(":checked")
        );
        checked.forEach(function(checkbox) {
          value.push(checkbox.getAttribute("name"));
        });
        break;
      // Else, just store the value as a string
      default:
        value = event.target.value;
    }

    // Save the field's value to local storage
    fieldName = (Array.isArray(value)) ? "superheroes" : fieldName;
    addToLocalStorageObject("data", fieldName, value);
  }

  /**
   * Remove the `data` key from local storage
   */
  function clearData(event) {
    localStorage.removeItem("data");
  }


  //
  // Init
  //

  // Populate the form with existing values
  populateForm(data);

  // Save form values when input event fires
  form.addEventListener("input", saveData, false);

  // Clear saved values when user submits form
  form.addEventListener("submit", clearData, false);

})();
