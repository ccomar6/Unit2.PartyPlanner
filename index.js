const API_URL = 'https://fsa-crud-2aa9294fe819.herokuapp.com/api/2401-GHP-ET-WEB-FT-SF/events';

const state = {
    events: []
};

document.addEventListener('DOMContentLoaded', () => {
    const eventsList = document.querySelector('#events');
    const addEventForm = document.querySelector('#addEvent');
    addEventForm.addEventListener('submit', createEvent);

    async function render() {
        await getEvents();
        renderEvents();
    }

    async function getEvents() {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error(`Failed to fetch events: ${response.status} ${response.statusText}`);
            }
            const json = await response.json();
            state.events = json.data;
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    }

    async function createEvent(event) {
        event.preventDefault();

        const name = addEventForm.eventName.value;
        const description = addEventForm.description.value;
        const eventDate = new Date(addEventForm.eventDate.value).toISOString();  // Ensure date is in ISO format
        const location = addEventForm.location.value;

        const eventData = { name, description, date: eventDate, location, cohortId: 242 }; // Using ISO formatted date
        console.log('Event Data:', eventData);  // Log the event data to check its format

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(eventData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Server error: ${response.status} ${response.statusText} - ${errorText}`);
            }

            const json = await response.json();
            console.log('Response Data:', json);  // Log the response data
            render();
        } catch (error) {
            console.error('Error creating event:', error);
        }
    }

    async function deleteEvent(id) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Server error: ${response.status} ${response.statusText} - ${errorText}`);
            }

            render();
        } catch (error) {
            console.error('Error deleting event:', error);
        }
    }

    function renderEvents() {
        eventsList.innerHTML = '';
        if (state.events.length < 1) {
            const newListItem = document.createElement('li');
            newListItem.textContent = 'No events found';
            eventsList.append(newListItem);
        } else {
            state.events.forEach(eventObj => {
                const newListItem = document.createElement('li');
                newListItem.classList.add('event');

                const newHeading = document.createElement('h2');
                newHeading.textContent = eventObj.name;

                const newParagraph = document.createElement('p');
                newParagraph.textContent = eventObj.description;

                const eventDate = document.createElement('p');
                eventDate.textContent = new Date(eventObj.date).toLocaleString(); // Changed to eventObj.date

                const newLocation = document.createElement('p');
                newLocation.textContent = eventObj.location;

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.classList.add('delete');
                deleteButton.addEventListener('click', () => deleteEvent(eventObj.id));

                newListItem.append(newHeading, newParagraph, eventDate, newLocation, deleteButton);
                eventsList.append(newListItem);
            });
        }
    }

    render();
});
