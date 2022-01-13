'use strict';

function getUserMeds() {
// Get medications info from server
  fetch("/med-look-up")
    .then((response) => response.json())
    .then((data) => {
      createDivsForMeds(data.meds);
    });
}

const medArray = getUserMeds();
console.log(medArray);

const createDivsForMeds = (medArray) => {
    
  const medElement = document.querySelector('#users-meds');

  console.log(medArray);
  for (const med of medArray) {
    medElement.insertAdjacentHTML('beforeend', `
    <div class="med-container">
      <span class='med-table'>
        ${med['name']} 
      </span>
      <br>
      <span class='med-table'>
        ${med['dosage_amt']}${med['dosage_type']} ${med['frequency']}/${med['per_time']} 
      </span>
      <br>
      <span class='med-table'>
        ${med['notes']} 
      </span>
      <br>
      <form method='get' action='/delete-med/${med['med_id']}'> <button class="btn" type="submit">Delete</button></form>
    </div>
    
   `);
  }
  };


document.querySelector('#new-med-form').insertAdjacentHTML('beforeend',`
<div class='new-med-container'>
<form id='new-medication' action='/new-med' method='POST'>
  <p>Medication\'s Name: </p>
  <input class='form-input' type='text' name='name'/><br></br>
  <p>Medication\'s unit of measurement (choose "unit" if none apply): </p>
  <input class='form-input inline' type='number' name='dosage-amt' min='1' value='1'>
  <select class='form-input inline' name='dosage-type'>
    <option value="mg">Milligram</option>
    <option value="g">Gram</option>
    <option value="ml">Milliliter</option>
    <option value="l">Liter</option>
    <option value="cc">Cubic centimeter</option>
    <option value="unit">Unit</option>
  </select>
  <p></p>
  <p>Medication\'s Dosage Frequency: </p>
  <input class='form-input inline' type='number' name='frequency' min='1' value='1'>
  <select class='form-input inline' name='per-time'>
    <option value="once">Once</option>
    <option value="hour">Hourly</option>
    <option value="day">Daily</option>
    <option value="week">Weekly</option>
    <option value="month">Monthly</option>
  </select>
  <p></p>
  <p>Notes on the medication: </p>
  <input class='form-input' type='text' name='notes'/>
  <p>
  <input class='btn' type="submit"> </submit></p>
</form>
</div>
`);