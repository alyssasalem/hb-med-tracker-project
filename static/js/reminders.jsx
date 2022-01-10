'use strict';

var today = new Date()

//edit to be usable in react?
function getReminders() {
  // Get medications info from server
  fetch("/get-reminders")
    .then((response) => response.json())
    .then((data) => {
      console.log(data.meds);
      console.log(data.doses);
      createDoseDivs(data.meds, data.doses);
    });
  }


const createDoseDivs = (meds, doses) => {
  const medElement = document.querySelector('#current-reminders');
  for (const med of meds){
    let doseHTML = ``;
    let medDoses = [];
    console.log(doses[med['med_id']]);
    if (doses[med['med_id']].length !== 0){
      medDoses = doses[med['med_id']];
      for (const dose of medDoses) {
        // Takes last four chars off string to eliminate timezone shenanigans. 
        // Make a point to point this out within demo, suggest other options.
        doseHTML += `<br>${dose['time'].slice(0, dose['time'].length - 4)}: Take ${dose['dosage_amt']+dose['dosage_type']}. Notes: ${dose['notes']} 
                    <a href='/delete-dose/${dose['dose_id']}'> Delete from Reminders</a>`;
      }
    } else {
      doseHTML = `No reminders found.`;
    }
    medElement.insertAdjacentHTML('beforeend', `<br>
    <div>
      <section class="reminder-med">${med['name']} </section>
      <section class="reminder-dose"> ${doseHTML}</section>
    </div>`);
  }


    let medOptions = ``;
    for (const med of meds) {
    medOptions += `<option value="${med['med_id']}">${med['name']}</option>`
    }

    
    document.querySelector('#new-reminder').insertAdjacentHTML('beforeend',`
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

    <p>First time and date you'd like to be reminded (NOTE: depending on the frequency you've chosen for this medication, this will schedule every subsequent reminder based on this time/day of week/day of month/etc!):</p>
    <input type="datetime-local" name="time" min="${today.getFullYear()}-${("0" + (today.getMonth() + 1)).slice(-2)}-${("0" + (today.getDate())).slice(-2)}T${("0" + (today.getHours())).slice(-2)}:${("0" + (today.getMinutes())).slice(-2)}" 
    max="2050-01-01T00:00">

    <p>Notes on the medication: </p>
    <input type='text' name='notes'/>
    <p>
    <input type="submit"> </submit>
    </form>
    `);

};



const navBar = () => {
document.querySelector('#reminders-nav').insertAdjacentHTML('beforeend', `
<section id='back-to-acct-info'>
<p></p>
    <a href='/profile'> Back to account info. </a>
</section>`);  
};




getReminders();
navBar();


function ReminderTest() {
  function checkReminders() {
    alert('If there are any reminders set, they\'ve sent!');
    fetch("/test-reminders")
    .then((response) => response.json())
    .then((data) => {
      console.log(data.success);
    });

  }

  return (
    <button type="button" onClick={checkReminders}>
      Reminder Test
    </button>
  );
}

ReactDOM.render(<ReminderTest />, document.querySelector('#reminder-test'));
