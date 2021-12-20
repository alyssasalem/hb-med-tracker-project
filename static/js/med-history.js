'use strict';

function getUserMedHist() {
  // Get medications info from server
  fetch("/get-med-history")
    .then((response) => response.json())
    .then((data) => {
      console.log(data.meds);
      console.log(data.doses);
      createDoseHistoryDivs(data.meds, data.doses);
      
    });
  }





// const createMedNameSections = (meds) => {
//     const medElement = document.querySelector('#users-meds');

//     for (const med of meds){
//         medElement.insertAdjacentHTML('beforeend', `<br><section class="med-name">${med['name']} </section>`);
//     }
// };  

const createDoseHistoryDivs = (meds, doses) => {
  
  const medElement = document.querySelector('#users-meds');

  for (const med of meds){
    let doseHTML = ``;
    let medDoses = [];
    console.log(doses[med['med_id']]);
    if (doses[med['med_id']].length !== 0){
      medDoses = doses[med['med_id']];
      for (const dose of medDoses) {
        doseHTML += `<br>${dose['time']}: Took ${dose['dosage_amt']+dose['dosage_type']}. Notes: ${dose['notes']} `;
      }
      console.log(doseHTML);
    } else {
      doseHTML = `No history found.`;
    }

    medElement.insertAdjacentHTML('beforeend', `<br>
    <div>
      <section class="hist-med">${med['name']} </section>
      <section class="hist-dose"> ${doseHTML}</section>
    </div>`);
  }


  let medOptions = ``;
  for (const med of meds) {
    medOptions += `<option value="${med['med_id']}">${med['name']}</option>`
  }

  
document.querySelector('#new-dose-form').insertAdjacentHTML('beforeend',`
<form id='new-dose' action='/new-dose' method='POST'>
  <p>Medication\'s Name: </p>
  <select name='med-id'>
    ${medOptions}
  </select>
  
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

  <p>Time and date medication was taken:</p>
  <input type="datetime-local" name="time">

  <p>Notes on the medication: </p>
  <input type='text' name='notes'/>
  <p>
  <input type="submit"> </submit>
</form>
`);

};

const navBar = () => {

  document.querySelector('#hist-page-nav').insertAdjacentHTML('beforeend', `
  <section id='back-to-acct-info'>
  <p></p>
    <a href='/profile'> Back to account info. </a>
  </section>`);  
};

// Form to add new histories.



getUserMedHist();
navBar();