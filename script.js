
// --- 1. System Database Setup (Using Browser LocalStorage) ---
let db = JSON.parse(localStorage.getItem('universityBookings'));
if (!db) {
    // Injecting mock data so the table isn't empty on first load
    db = [
        { lab: "Computer Science", equipment: "High-End Workstation", date: "2026-11-27", time: "09:00 AM - 11:00 AM", name: "Rahul S." },
        { lab: "Chemistry", equipment: "Fume Hood Station", date: "2026-11-27", time: "11:30 AM - 01:30 PM", name: "Anjali M." }
    ];
    localStorage.setItem('universityBookings', JSON.stringify(db));
}

const defaultTimeSlots = ["09:00 AM - 11:00 AM", "11:30 AM - 01:30 PM", "02:00 PM - 04:00 PM"];

const equipmentData = {
    "Computer Science": ["High-End Workstation", "VR Headset", "Server Rack Access"],
    "Chemistry": ["Fume Hood Station", "Spectrophotometer", "Centrifuge"],
    "Biology": ["Compound Microscope", "Autoclave", "Incubator"],
    "Physics": ["Oscilloscope", "Laser Kit", "Spectrometer"]
};

// --- 2. Booking Page Logic (booking.html) ---
const labTypeSelect = document.getElementById('labType');
const equipmentSelect = document.getElementById('equipment');
const dateInput = document.getElementById('bookingDate');
const timeSelect = document.getElementById('timeSlot');
const form = document.getElementById('bookingForm');

if (labTypeSelect) {
    // Populate equipment based on Lab selection
    labTypeSelect.addEventListener('change', function() {
        equipmentSelect.disabled = false;
        equipmentSelect.innerHTML = '<option value="" disabled selected>Select equipment...</option>';
        
        const selectedLab = labTypeSelect.value;
        equipmentData[selectedLab].forEach(item => {
            let opt = document.createElement('option');
            opt.value = item;
            opt.textContent = item;
            equipmentSelect.appendChild(opt);
        });
        checkAvailability(); // Reset time slots
    });

    // Check Availability when Equipment or Date changes
    function checkAvailability() {
        if (!equipmentSelect.value || !dateInput.value) {
            timeSelect.disabled = true;
            timeSelect.innerHTML = '<option value="" disabled selected>Select date & equipment first...</option>';
            return;
        }

        timeSelect.disabled = false;
        timeSelect.innerHTML = '<option value="" disabled selected>Select an available time...</option>';

        defaultTimeSlots.forEach(slot => {
            const isBooked = db.some(b => 
                b.equipment === equipmentSelect.value && 
                b.date === dateInput.value && 
                b.time === slot
            );

            let opt = document.createElement('option');
            opt.value = slot;
            if (isBooked) {
                opt.textContent = `${slot} (Booked)`;
                opt.disabled = true;
            } else {
                opt.textContent = `${slot} (Available)`;
            }
            timeSelect.appendChild(opt);
        });
    }

    equipmentSelect.addEventListener('change', checkAvailability);
    dateInput.addEventListener('change', checkAvailability);

    // Save Booking
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const newBooking = {
            lab: labTypeSelect.value,
            equipment: equipmentSelect.value,
            date: dateInput.value,
            time: timeSelect.value,
            name: document.getElementById('studentName').value
        };

        db.push(newBooking);
        localStorage.setItem('universityBookings', JSON.stringify(db)); // Save to browser storage

        document.getElementById('successMsg').classList.remove('hidden');
        form.reset();
        checkAvailability(); // Refresh dropdown
        
        setTimeout(() => document.getElementById('successMsg').classList.add('hidden'), 3000);
    });
}

// --- 3. Status Page Logic (status.html) ---
const tableBody = document.getElementById('tableBody');
if (tableBody) {
    db.forEach(booking => {
        let row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${booking.lab}</strong></td>
            <td>${booking.equipment}</td>
            <td>${booking.date} | ${booking.time}</td>
            <td>${booking.name}</td>
            <td><span class="badge">Reserved</span></td>
        `;
        tableBody.appendChild(row);
    });
}