var timeMarkersGlobal = []; // Global variable to store time markers
var currentMarkerIndex = -1; // Current position in the time markers array
console.log('Content script loaded.');

// Function to jump the video to a specified time
function seekToTime(seconds) {
    var videoElement = document.querySelector('video');
    if (videoElement) {
        videoElement.currentTime = seconds;
        console.log(`Video jumped to ${seconds} seconds.`);
    } else {
        console.log('Video element not found.');
    }
}

// Function to parse time markers from comment text
function parseTimeMarkers(commentText) {
    const timeMarkerRegex = /(\d+:\d+)\s*(\S+)/g;
    let match;
    let timeMarkers = [];

    while ((match = timeMarkerRegex.exec(commentText)) !== null) {
        const timeParts = match[1].split(':');
        const minutes = parseInt(timeParts[0], 10);
        const seconds = parseInt(timeParts[1], 10);
        const totalSeconds = (minutes * 60) + seconds;

        timeMarkers.push(totalSeconds);
    }

    return timeMarkers;
}

// Function to create a control button on the page
function createControlButton() {
    var button = document.createElement("button");
    button.innerHTML = "prev";
    button.style.position = "fixed";
    button.style.bottom = "10px";
    button.style.left = "10px";
    button.style.zIndex = 1000;

    button.addEventListener("click", function() {
        navigateTimeMarkers("left"); // Jump to 1 second
    });

    document.body.appendChild(button);

    var nextbutton = document.createElement("button");
    nextbutton.innerHTML = "next";
    nextbutton.style.position = "fixed";
    nextbutton.style.bottom = "10px";
    nextbutton.style.left = "110px";
    nextbutton.style.zIndex = 1000;

    nextbutton.addEventListener("click", function() {
        navigateTimeMarkers("right"); // Jump to 1 second
    });

    document.body.appendChild(nextbutton);

}

// Initialize the script
function init() {
    if (document.readyState === "complete" || document.readyState === "interactive") {
        createControlButton();
    } else {
        document.addEventListener('DOMContentLoaded', function() {
            createControlButton();
        });
    }
}

init();

// Function to copy text to clipboard
function copyToClipboard(text) {
    var textarea = document.createElement('textarea');
    textarea.textContent = text;
    document.body.appendChild(textarea);
    var selection = document.getSelection();
    var range = document.createRange();
    range.selectNode(textarea);
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand('copy');
    selection.removeAllRanges();
    document.body.removeChild(textarea);
}

// Function to add click listener to comments
function addClickListenerToComments() {
    var commentSelector = 'ytd-comment-renderer';
    var comments = document.querySelectorAll(commentSelector);

    comments.forEach(comment => {
        comment.addEventListener('click', function(event) {
            var commentText = comment.querySelector('#content-text').innerText;
            copyToClipboard(commentText);
            console.log('Comment copied to clipboard:', commentText);
            // Parse time markers and store in global variable
            timeMarkersGlobal = parseTimeMarkers(commentText);
            console.log('Time markers:', timeMarkersGlobal);
        });
    });
}

// Initialize the comment copy feature
function initCommentCopyFeature() {
    if (document.readyState === "complete" || document.readyState === "interactive") {
        addClickListenerToComments();
    } else {
        document.addEventListener('DOMContentLoaded', function() {
            addClickListenerToComments();
        });
    }
}

initCommentCopyFeature();


// Function to navigate through time markers
function navigateTimeMarkers(direction) {
    if (timeMarkersGlobal.length === 0) {
        return; // Do nothing if the array is empty
    }

    if (direction === 'right') {
        currentMarkerIndex++;
        if (currentMarkerIndex >= timeMarkersGlobal.length) {
            // If at the end of the array, go to the end of the video
            currentMarkerIndex = timeMarkersGlobal.length - 1;
            seekToEndOfVideo();
        } else {
            seekToTime(timeMarkersGlobal[currentMarkerIndex]);
        }
    } else if (direction === 'left') {
        currentMarkerIndex--;
        if (currentMarkerIndex < 0) {
            // If at the beginning of the array, go to the start of the video
            currentMarkerIndex = 0;
            seekToTime(0);
        } else {
            seekToTime(timeMarkersGlobal[currentMarkerIndex]);
        }
    }
}

function seekToEndOfVideo() {
    var videoElement = document.querySelector('video');
    if (videoElement) {
        videoElement.currentTime = videoElement.duration;
    }
}
