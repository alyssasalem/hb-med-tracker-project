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
    <div>
      <section class='med-table'>
        ${med['name']} 
      </section>
      <br>
      <section class='med-table'>
        ${med['dosage_amt']}${med['dosage_type']} ${med['frequency']}/${med['per_time']} 
      </section>
      <br>
      <section class='med-table'>
        ${med['notes']} 
      </section>
      <br>
    </div>
    <a href='/delete-med/${med['med_id']}'> Delete Medication from User's Account (Will delete all dose history associated with this medication)</a><p>-----</p>`);
  }
  };

// form to add new med:
const medForm = "" +
"<form id='new-medication'>" +
    "<p>Medication\'s Name: </p>" +
  "<input type='text' name='med-name'/>" +
"</form>";



document.querySelector('#med-page-nav').innerHTML = '<a href="/profile"> Back to Account Info </a>';

document.querySelector('#new-med-form').insertAdjacentHTML('beforeend',`
<form id='new-medication' action='/new-med' method='POST'>
  <p>Medication\'s Name: </p>
  <input type='text' name='name'/>
  <p>Medication\'s unit of measurement (choose "unit" if none apply): </p>
  <input type='number' name='dosage-amt' min='1' value='1'>
  <select name='dosage-type'>
    <option value="mg">Milligram</option>
    <option value="g">Gram</option>
    <option value="ml">Milliliter</option>
    <option value="l">Liter</option>
    <option value="cc">Cubic centimeter</option>
    <option value="unit">Unit</option>
  </select>


  <p>Medication\'s Dosage Frequency: </p>
  <input type='number' name='frequency' min='1' value='1'>
  <select name='per-time'>
    <option value="hour">Hourly</option>
    <option value="day">Daily</option>
    <option value="week">Weekly</option>
    <option value="monthly">Monthly</option>
  </select>

  <p>Notes on the medication: </p>
  <input type='text' name='notes'/>
  <p>
  <input type="submit"> </submit>
</form>
`);