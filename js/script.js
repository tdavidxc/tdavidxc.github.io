import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
//import { createClient } from '@supabase/supabase-js';


const supabaseUrl = 'https://nntrmdwbrsukpbcdledw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5udHJtZHdicnN1a3BiY2RsZWR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI1OTM1MDcsImV4cCI6MjAyODE2OTUwN30.TwTuNJrxB8B8haWAVdqLDyVsgkuip1omzJL7Q1Z3iWQ';
const supabase = createClient(supabaseUrl, supabaseAnonKey);
const resultsContainer = document.getElementById('results');

// Check if Supabase client is initialized
if (supabase) {
  console.log('Supabase client initialized successfully!');
} else {
  console.error('Supabase client initialization failed!');
}

// Function to handle people search
const handlePeopleSearch = async () => {
  console.log("person search attempt");
  const searchForm = document.getElementById('searchForm');
  if (searchForm) {
    searchForm.addEventListener('submit', async (event) => {
      event.preventDefault(); // Prevent default form submission

      const nameInput = document.getElementById('name');
      const licenseInput = document.getElementById('license');
      const messageContainer = document.getElementById('message');

      const name = nameInput.value.trim();
      const license = licenseInput.value.trim();

      // Clear previous search results and messages
      resultsContainer.innerHTML = '';
      messageContainer.innerHTML = '';

      if (!name && !license) {
        messageContainer.textContent = 'Error: Please enter at least one search term.';
        return; // Exit if both fields are empty
      } else if (name && license) {
        messageContainer.textContent = 'Error: Please enter only one search term.';
        return; // Exit if both fields are filled
      }

      // DOING THE ACTUAL QUERY
      let query = supabase.from('People').select();
      if (name) {
        query = query.or(`Name.ilike.*${name}*`);
      }
      if (license) {
        query = query.or(`LicenseNumber.ilike.*${license}*`);
      }
      const { data, error } = await query;

      if (error) {
        console.error(error);
        messageContainer.textContent = 'Error code:1 occurred during search.';
      } else if (!data || data.length === 0) {
        messageContainer.textContent = 'No results found.';
      } else {
        messageContainer.textContent = 'Search successful.';

        console.log("data retrieved: \n"+data)

        // Create div elements for each person
        data.forEach(person => {
          const personDiv = document.createElement('div');
          personDiv.classList.add('person-result');

          // Populate div with person data
          const personInfo = `
            <p><strong>Name:</strong> ${person.Name}</p>
            <p><strong>Address:</strong> ${person.Address}</p>
            <p><strong>DOB:</strong> ${person.DOB}</p>
            <p><strong>License Number:</strong> ${person.LicenseNumber}</p>
            <p><strong>Expiry Date:</strong> ${person.ExpiryDate}</p>
          `;
          personDiv.innerHTML = personInfo;

          // Append person div to results container
          resultsContainer.appendChild(personDiv);
        });
      }
    });
  }
};

// Function to handle vehicle search
const handleVehicleSearch = async () => {
  console.log("vehicle search attempt");
  const vehicleSearchForm = document.getElementById('vehicleSearchForm');
  if (vehicleSearchForm) {
    vehicleSearchForm.addEventListener('submit', async (event) => {
      event.preventDefault(); 

      const regoInput = document.getElementById('rego');
      const messageContainer = document.getElementById('message');

      if (!regoInput || !messageContainer) {
        console.log("Invalid input or message container.");
        return;
      }

      const rego = regoInput.value.trim();

      // Clear previous search results and messages
      resultsContainer.innerHTML = '';
      messageContainer.innerHTML = '';

      if (!rego) {
        messageContainer.textContent = 'Error: Please enter a vehicle registration number.';
        return; // Exit if the field is empty
      }

      // DOING THE ACTUAL QUERY
      console.log("rego: " + rego);
      let query = supabase.from('Vehicles').select();
      if (rego) {
        query = query.or(`VehicleID.ilike.*${rego}*`);
      }
      const { data, error } = await query;
      console.log("data: " + data);

      if (error) {
        console.error(error);
        messageContainer.textContent = 'Error occurred during search.';
      } else if (!data || data.length === 0) {
        messageContainer.textContent = 'No results found.';
      } else {
        messageContainer.textContent = 'Search successful.';

        // Create div elements for each vehicle
        data.forEach(vehicle => {
          const vehicleDiv = document.createElement('div');
          vehicleDiv.classList.add('vehicle-result');

         
          const vehicleInfo = `
            <p><strong>Vehicle ID:</strong> ${vehicle.VehicleID}</p>
            <p><strong>Make:</strong> ${vehicle.Make}</p>
            <p><strong>Model:</strong> ${vehicle.Model}</p>
            <p><strong>Colour:</strong> ${vehicle.Colour}</p>
            <p><strong>Owner ID:</strong> ${vehicle.OwnerID}</p>
          `;
          vehicleDiv.innerHTML = vehicleInfo;

          // Append vehicle div to results container
          resultsContainer.appendChild(vehicleDiv);
        });
      }
    });
  } else {
    console.log("vehicleSearchForm is invalid");
  }
};



// Function to handle adding a vehicle
const handleAddVehicle = async () => {
  console.log("Attempt to add a vehicle");
  const addVehicleForm = document.getElementById('addVehicleForm');
  
  if (addVehicleForm) {
    addVehicleForm.addEventListener('submit', async (event) => {
      event.preventDefault(); 
      const regoInput = document.getElementById('rego');
      const makeInput = document.getElementById('make');
      const modelInput = document.getElementById('model');
      const colourInput = document.getElementById('colour');
      const ownerInput = document.getElementById('owner');
      
      const name1 = ownerInput.value.trim();

      const messageContainer = document.getElementById('message');

      // Check if any input field is empty
      if (!regoInput || !makeInput || !modelInput || !colourInput || !name1) {
        if (!regoInput) console.log("regoInput is empty");
        if (!makeInput) console.log("makeInput is empty");
        if (!modelInput) console.log("modelInput is empty");
        if (!colourInput) console.log("colourInput is empty");
        if (!name1) console.log("name1 is empty");
        
        console.log(`${regoInput.value} ${makeInput.value} ${modelInput.value} ${colourInput.value} ${ownerInput.value}`);
        document.getElementById('message').textContent = 'Error: Please fill in all fields.';
        console.log("One of the fields is empty");
        return;
      }

      // Clear previous search results and messages
      resultsContainer.innerHTML = '';
      messageContainer.innerHTML = '';

      // Check if the owner exists in the People table
      console.log("Checking if owner exists in the People table: " + ownerInput.value.trim());
      let query = supabase.from('People').select('PersonID').eq('Name', name1);
      const { data: [personid], error: ownerError } = await query;

      if (ownerError) {
        console.error("Error occurred while checking the owner: " + ownerError.message);
        document.getElementById('message').textContent = 'Error: An error occurred while checking the owner.';
      } else {
        if (!personid || personid.length === 0) {
          console.log("Owner not found.");
          document.getElementById('message').textContent = 'Error: Owner not found.';
          
          // Display form to add owner
          const ownerForm = document.getElementById('addOwnerForm');
          ownerForm.style.display = 'block';

          
          const addOwnerButton = document.getElementById('addOwnerButton');
          addOwnerButton.addEventListener('click', async (event) => {
            event.preventDefault();
            const ownerID = document.getElementById('personid');
            const nameInput = document.getElementById('name');
            const addressInput = document.getElementById('address');
            const dobInput = document.getElementById('dob');
            const licenseInput = document.getElementById('license');
            const expireInput = document.getElementById('expire');

            // Check if any input field is empty
            if (!ownerID.value || !nameInput.value || !addressInput.value || !dobInput.value || !licenseInput.value || !expireInput.value) {
              console.log(`${ownerID.value} ${nameInput.value} ${addressInput.value} ${dobInput.value} ${licenseInput.value} ${expireInput.value}`);
              document.getElementById('message').textContent = 'Error: Please fill in all fields.';
              return;
            }

            // Add owner to the People table
            console.log(`PersonID: ${ownerID.value}, Name: ${nameInput.value}, Address: ${addressInput.value}, DOB: ${dobInput.value}, LicenseNumber: ${licenseInput.value}, ExpiryDate: ${expireInput.value}`);
            
            const { error: newOwnerError } = await supabase
              .from('People')
              .insert([
                {
                  PersonID: ownerID.value,
                  Name: nameInput.value,
                  Address: addressInput.value,
                  DOB: dobInput.value,
                  LicenseNumber: licenseInput.value,
                  ExpiryDate: expireInput.value,
                },
              ]);

            if (newOwnerError) {
              console.error("Unable to add new owner: ", newOwnerError);
              console.log("Sent data: ", `${ownerID.value} ${nameInput.value} ${addressInput.value} ${dobInput.value} ${licenseInput.value} ${expireInput.value}`);
              
              document.getElementById('message').textContent = 'Error: An error occurred while adding the owner.';
            } else {
              // If owner added successfully, hide the owner form and continue adding the vehicle
              ownerForm.style.display = 'none';
              // Owner added successfully, proceed to add the vehicle
              const { error: addVehicleError } = await supabase
              .from('Vehicles')
              .insert([
                {
                  VehicleID: regoInput.value,
                  Make: makeInput.value,
                  Model: modelInput.value,
                  Colour: colourInput.value,
                  OwnerID: ownerID.value, 
                },
              ]);

          if (addVehicleError) {
            console.error("Error occurred while adding the vehicle: ", addVehicleError);
            document.getElementById('message').textContent = 'Error: An error occurred while adding the vehicle.';
          } else {
            document.getElementById('message').textContent = 'Vehicle added successfully';
          }

              // document.getElementById('message').textContent = 'Owner added successfully.';
            }
          });
        } else {
          // Owner exists, proceed to add the vehicle
          const personsid = personid['PersonID'];
          console.log("Owner found for"+name1+", id: ", personsid);
          // DOING THE ACTUAL QUERY to add the vehicle
          console.log("VehicleID: " + regoInput.value + ", Make: " + makeInput.value + ", Model: " + modelInput.value + ", Colour: " + colourInput.value + ", OwnerID: " + personid.value);
          const { error: addVehicleError } = await supabase
            .from('Vehicles')
            .insert([
              {
                VehicleID: regoInput.value,
                Make: makeInput.value,
                Model: modelInput.value,
                Colour: colourInput.value,
                OwnerID: personsid, 
              },
            ]);

          if (addVehicleError) {
            console.error("Error occurred while adding the vehicle: ", addVehicleError);
            document.getElementById('message').textContent = 'Error: An error occurred while adding the vehicle.';
          } else {
            document.getElementById('message').textContent = 'Vehicle added successfully';
          }
        }
      }
    });
  }
};

//adding functionality for dark mode
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const body = document.body;

let isDarkMode = localStorage.getItem('dark-mode') === 'true'; // Check for stored preference from prev page

if (isDarkMode) {
  body.classList.add('dark-mode');
  themeToggleBtn.textContent = 'Light Mode';
} else {
  body.classList.remove('dark-mode');
  themeToggleBtn.textContent = 'Dark Mode';
}

themeToggleBtn.addEventListener('click', () => {
  body.classList.toggle('dark-mode');
  isDarkMode = !isDarkMode; // Update preference based on toggle
  localStorage.setItem('dark-mode', isDarkMode); // Store preference in local storage
  if (body.classList.contains('dark-mode')) {
    themeToggleBtn.textContent = 'Light Mode';
  } else {
    themeToggleBtn.textContent = 'Dark Mode';
  }
});


// Call the functions to handle people search and vehicle search and add Vehicle
handlePeopleSearch();
handleVehicleSearch();
handleAddVehicle();