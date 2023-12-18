var timeMarkersGlobal = []; // Global variable to store time markers
var currentMarkerIndex = -1; // Current position in the time markers array
var videoElement = null;
console.log('Content script loaded.');

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
    // print timeMarkers
    console.log('timeMarkers: ', timeMarkers);
    return timeMarkers;
}

// Function to attach click event listeners to comments
function addClickListenerToComments() {
    var commentSelector = 'ytd-comment-renderer';
    var comments = document.querySelectorAll(commentSelector);

    comments.forEach(comment => {
        comment.addEventListener('click', function (event) {
            var commentText = comment.querySelector('#content-text').innerText;
            console.log('Comment clicked:', commentText);
            // Parse time markers and store in console log
            timeMarkersGlobal = parseTimeMarkers(commentText);
            currentMarkerIndex = -1; // Reset to start
            console.log('Time markers:', timeMarkersGlobal);
        });
    });
}
function observeComments() {
    const commentSection = document.querySelector('ytd-comments'); // Update this selector based on current YouTube layout

    if (!commentSection) {
        console.log('Waiting for comment section to load...');
        setTimeout(observeComments, 1000); // Check again after 1 second
        return;
    }

    console.log('Comment section found. Setting up observer.');

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) {
                addClickListenerToComments();
            }
        });
    });

    observer.observe(commentSection, { childList: true, subtree: true });
}



function seekToTime(seconds) {
    if (!videoElement) {
        videoElement = document.querySelector('video');
        if (!videoElement) {
            console.log('Video element not found.');
            return;
        }
    }

    videoElement.currentTime = seconds;
    console.log(`Video jumped to ${seconds} seconds.`);
}


function navigateToPrevMarker() {
    if (timeMarkersGlobal.length === 0 || currentMarkerIndex <= 0) {
        console.log('No previous marker.');
        return;
    }

    currentMarkerIndex--;
    seekToTime(timeMarkersGlobal[currentMarkerIndex]);
}

function navigateToNextMarker() {
    if (timeMarkersGlobal.length === 0 || currentMarkerIndex >= timeMarkersGlobal.length - 1) {
        console.log('No next marker.');
        return;
    }

    currentMarkerIndex++;
    seekToTime(timeMarkersGlobal[currentMarkerIndex]);
}


function handleKeydown(event) {
    if (event.altKey && event.key === 'b') {
        navigateToPrevMarker();
    } else if (event.altKey && event.key === 'n') {
        navigateToNextMarker();
    }
}


document.addEventListener('keydown', handleKeydown);


var lastUrl = location.href;

function checkUrlChange() {
    var currentUrl = location.href;
    if (currentUrl !== lastUrl) {
        timeMarkersGlobal = [];
        currentMarkerIndex = -1;
        console.log('Page changed, markers reset.');
        lastUrl = currentUrl;
        observeComments();
    }
}


function init() {
    if (document.readyState === "complete" || document.readyState === "interactive") {
        observeComments();
        setInterval(checkUrlChange, 1000);
    } else {
        document.addEventListener('DOMContentLoaded', function () {
            observeComments();
            setInterval(checkUrlChange, 1000);
        });
    }
}

browser.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.action === "getTimestamps") {
            sendResponse({
                timestamps: timeMarkersGlobal,
                currentMarkerIndex: currentMarkerIndex
            });
        }
    }
);


browser.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.action === "getTimestamps") {
            sendResponse({
                timestamps: timeMarkersGlobal,
                currentMarkerIndex: currentMarkerIndex
            });
        } else if (request.action === "resetTimestamps") {
            timeMarkersGlobal = [];
            currentMarkerIndex = -1;
            sendResponse({ success: true });
            console.log('Timestamps and index reset.');
        }
    }
);

init();