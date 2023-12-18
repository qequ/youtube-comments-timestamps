document.addEventListener('DOMContentLoaded', function () {
    browser.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        browser.tabs.sendMessage(tabs[0].id, { action: "getTimestamps" }, function (response) {
            if (response && response.timestamps) {
                currentMarkerIndex = response.currentMarkerIndex; // Get the current marker index
                displayTimestamps(response.timestamps);
            } else {
                console.error('No response or timestamps received');
            }
        });
    });
});

var currentMarkerIndex = -1; // Add this line to define currentMarkerIndex

function displayTimestamps(timestamps) {
    var list = document.getElementById('timestampList');
    list.innerHTML = ''; // Clear the list

    timestamps.forEach(function (timestamp, index) {
        var li = document.createElement('li');
        li.textContent = `Timestamp: ${formatTimestamp(timestamp)}`;

        // Highlight the current timestamp
        if (index === currentMarkerIndex) {
            li.style.color = 'red'; // Change the color as per your preference
        }

        list.appendChild(li);
    });
}


function formatTimestamp(seconds) {
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = seconds % 60;
    return minutes.toString().padStart(2, '0') + ':' + remainingSeconds.toString().padStart(2, '0');
}



document.getElementById('resetButton').addEventListener('click', function () {
    // Send a message to the active tab to reset timestamps
    browser.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        browser.tabs.sendMessage(tabs[0].id, { action: "resetTimestamps" }, function (response) {
            if (response && response.success) {
                console.log('Timestamps reset successfully.');
                displayTimestamps([]);
            } else {
                console.error('Failed to reset timestamps');
            }
        });
    });
});
