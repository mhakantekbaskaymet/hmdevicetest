'use strict';

// --------------------- THEME MANIPULATION ---------------------

const themes = {
  retro: document.querySelector('.retro'),
  navyBlue: document.querySelector('.navy-blue'),
};

for (const theme in themes) {
  themes[theme].addEventListener('click', function () {
    changeTheme(themes[theme].className);
  });
}

const initializeTheme = () => {
  const savedTheme = localStorage.getItem('currentTheme');
  if (savedTheme) changeTheme(savedTheme);
};

const changeTheme = function (themeName) {
  // naming needs to be changed so we can access
  // themes that exist in themes.css
  const themeCSS = 'theme--' + themeName;

  document.body.classList.remove(
    'theme--' + localStorage.getItem('currentTheme')
  );
  document.body.classList.add(themeCSS);
  localStorage.setItem('currentTheme', themeName);
};

initializeTheme();

// ------------------- HANDLING KEY PRESS -------------------

const handleKeyPress = function (e) {
  console.log(e);

  e.preventDefault();

  // Edge case mentioned in https://github.com/Mostafa-Abbasi/KeyboardTester/issues/4
  // Detect AltGr key press (Alt + Control pressed simultaneously)
  const isAltGr = e.key === 'AltGraph';

  // Ignore the left Control key if AltGr is pressed
  if (isAltGr) {
    document
      .querySelector('.' + 'controlleft')
      .classList.remove('key-pressing-simulation');

    document
      .querySelector('.' + 'controlleft')
      .classList.remove('key--pressed');
  }

  const keyElement = document.querySelector('.' + e.code.toLowerCase());

  if (e.type === 'keydown') {
    keyElement.classList.add('key-pressing-simulation');
  } else if (e.type === 'keyup') {
    keyElement.classList.remove('key-pressing-simulation');
  }

  if (!keyElement.classList.contains('key--pressed')) {
    keyElement.classList.add('key--pressed');
  }

  // Handle special Meta/OS key case
  if (e.key === 'Meta' || e.key === 'OS') {
    keyElement.classList.remove('key-pressing-simulation');
  }
};

document.addEventListener('keydown', handleKeyPress);
document.addEventListener('keyup', handleKeyPress);

// --------------------- CHANGING LAYOUT ---------------------

const slider = document.getElementById('layoutSlider');
const output = document.querySelector('.slider-value');

const fullSizeLayout = document.querySelector('.full-size-layout');
const TKLLayout = document.querySelector('.tkl-layout');

const themeAndLayout = document.querySelector('.theme-and-layout');
const keyboard = document.querySelector('.keyboard');
// related to tkl
const numpad = document.querySelector('.numpad');
// related to 75% layout configuration
const regions = document.querySelectorAll('.region');
const functionRegion = document.querySelector('.function');
const controlRegion = document.querySelector('.system-control');
const navigationRegion = document.querySelector('.navigation');
const fourthRow = document.querySelector('.fourth-row');
const fifthRow = document.querySelector('.fifth-row');

// deleted keys in 75%
const btnScrollLock = document.querySelector('.scrolllock');
const btnInsert = document.querySelector('.insert');
const btnContextMenu = document.querySelector('.contextmenu');

// remapped keys in 75%
const btnDelete = document.querySelector('.delete');
const btnHome = document.querySelector('.home');
const btnEnd = document.querySelector('.end');
const btnPgUp = document.querySelector('.pageup');
const btnPgDn = document.querySelector('.pagedown');

// Function to update the layout based on slider value
function updateLayout() {
  const sliderValue = parseInt(slider.value);

  // Update output text based on slider position
  switch (sliderValue) {
    case 1:
      output.textContent = 'Full';
      changeToFullSize();
      break;
    case 2:
      output.textContent = 'TKL';
      changeToTKL();
      break;
    case 3:
      output.textContent = '75%';
      changeTo75();
      break;
    default:
      break;
  }
}

const changeToFullSize = function () {
  undo75();
  undoTKL();
  themeAndLayout.style.maxWidth = '120rem';
  keyboard.classList.add('full-size');
};

const undoTKL = function () {
  keyboard.classList.remove('tkl');
  numpad.classList.remove('hidden--step1');
  numpad.classList.remove('hidden--step2');
};

const changeToTKL = function () {
  return new Promise(resolve => {
    undo75();

    numpad.classList.add('hidden--step1');
    themeAndLayout.style.maxWidth = '98rem';
    // timeout added for smooth transition between applying --step1 & --step2
    setTimeout(function () {
      keyboard.classList.remove('full-size');

      keyboard.classList.add('tkl');
      numpad.classList.add('hidden--step2');
      resolve(); // Resolving the promise when transition is complete
    }, 150);
  });
};

const updateStylesFor75 = is75Percent => {
  const paddingValue = is75Percent ? '0.15rem' : '0.5rem';
  const displayValue = is75Percent ? 'none' : 'flex';
  const transformValue = is75Percent ? '-66.7%' : '0%';

  keyboard.classList.toggle('seventy-five-percent', is75Percent);
  regions.forEach(region => (region.style.padding = paddingValue));

  functionRegion.style.gridTemplateColumns = is75Percent
    ? '2fr 0 repeat(4, 2fr) 0 repeat(4, 2fr) 0 repeat(4,2fr)'
    : '2fr 2fr repeat(4, 2fr) 1fr repeat(4, 2fr) 1fr repeat(4,2fr)';
  functionRegion.style.width = is75Percent ? '86.7%' : '100%';

  controlRegion.style.width = is75Percent ? '95%' : '100%';
  controlRegion.style.transform = `translateX(${transformValue})`;
  btnScrollLock.style.display = displayValue;
  btnInsert.style.display = displayValue;
  btnContextMenu.style.display = displayValue;

  const btnDeleteTransform = is75Percent
    ? 'translateY(-106%)'
    : 'translateY(0%)';
  btnDelete.style.gridColumn = is75Percent ? 3 : 1;
  btnDelete.style.gridRow = is75Percent ? 1 : 2;
  btnDelete.style.transform = btnDeleteTransform;

  btnHome.style.gridColumn = is75Percent ? 3 : 2;
  btnHome.style.gridRow = is75Percent ? 1 : 1;

  btnEnd.style.gridColumn = is75Percent ? 3 : 2;
  btnEnd.style.gridRow = is75Percent ? 2 : 2;

  btnPgUp.style.gridColumn = is75Percent ? 3 : 3;
  btnPgUp.style.gridRow = is75Percent ? 3 : 1;

  btnPgDn.style.gridColumn = is75Percent ? 3 : 3;
  btnPgDn.style.gridRow = is75Percent ? 4 : 2;

  navigationRegion.style.transform = `translateX(${transformValue})`;

  fourthRow.style.gridTemplateColumns = is75Percent
    ? '2.29fr repeat(10, 1fr) 1.75fr 1.04fr'
    : '2.29fr repeat(10, 1fr) 2.79fr';

  const fifthRowColumns = is75Percent
    ? 'repeat(3, 1.29fr) 6.36fr repeat(3, 1fr) 2.15fr'
    : 'repeat(3, 1.29fr) 6.36fr repeat(4, 1.29fr)';
  fifthRow.style.gridTemplateColumns = fifthRowColumns;
};

const undo75 = () => {
  updateStylesFor75(false);
};

const changeTo75 = async () => {
  await changeToTKL(); // Wait for the transition in changeToTKL() to complete
  themeAndLayout.style.maxWidth = '85rem';
  updateStylesFor75(true);
};

// Event listener for slider change
slider.addEventListener('input', updateLayout);

// Initial layout update based on default slider value
updateLayout();

// --------------------- DEVICE TESTING FUNCTIONS ---------------------

function showTestArea(areaId) {
  console.log('showTestArea called with:', areaId);
  console.log('Hiding all test areas and showing:', areaId);

  const testAreas = document.querySelectorAll('.test-area');
  testAreas.forEach(area => area.style.display = 'none');
  document.getElementById(areaId).style.display = 'block';
  // Hide the theme-and-layout section
  const themeAndLayoutSection = document.querySelector('.theme-and-layout');
  if (themeAndLayoutSection) {
    console.log('Hiding theme-and-layout section');
    themeAndLayoutSection.style.display = 'none';
  } else {
    console.log('theme-and-layout section not found');
  }
  // Hide the keyboard section
  const keyboardSection = document.querySelector('.keyboard');
  if (keyboardSection) {
    console.log('Hiding keyboard section');
    keyboardSection.style.display = 'none';
  } else {
    console.log('Keyboard section not found');
  }
}

let cameraStream = null;

function testCamera() {
  showTestArea('cameraTest');
  
  // Set up the stop button
  const stopButton = document.getElementById('stopCameraBtn');
  if (stopButton) {
    // Remove existing event listeners by cloning the node
    const newButton = stopButton.cloneNode(true);
    stopButton.parentNode.replaceChild(newButton, stopButton);
    
    // Add the stop event listener
    newButton.addEventListener('click', stopCameraTest);
  }
  
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      cameraStream = stream;
      const video = document.createElement('video');
      video.srcObject = stream;
      video.autoplay = true;
      video.style.width = '100%';
      const cameraOutput = document.getElementById('cameraOutput');
      cameraOutput.innerHTML = '';
      cameraOutput.appendChild(video);
    })
    .catch(error => {
      alert('Camera access denied or not available.');
      console.error('Camera error:', error);
    });
}

function stopCameraTest() {
  // Stop the camera stream
  if (cameraStream) {
    cameraStream.getTracks().forEach(track => track.stop());
    cameraStream = null;
    
    // Clear the camera output
    const cameraOutput = document.getElementById('cameraOutput');
    if (cameraOutput) {
      cameraOutput.innerHTML = '<p>Camera test stopped.</p>';
    }
    
    // Change the stop button to a restart button
    const stopButton = document.getElementById('stopCameraBtn');
    if (stopButton) {
      stopButton.textContent = 'Start Again';
      stopButton.classList.remove('stop-button');
      stopButton.classList.add('restart-button');
      
      // Remove existing event listeners by cloning the node
      const newButton = stopButton.cloneNode(true);
      stopButton.parentNode.replaceChild(newButton, stopButton);
      
      // Add new event listener for restart
      newButton.addEventListener('click', function() {
        // Reset the button appearance before starting camera again
        this.textContent = 'Stop Camera Test';
        this.classList.remove('restart-button');
        this.classList.add('stop-button');
        
        // Start the camera test again
        testCamera();
      });
    }
  }
}

let microphoneStream = null;
let audioContext = null;
let analyser = null;
let animationFrameId = null;

function testMicrophone() {
  showTestArea('microphoneTest');
  
  // Create the bar elements for visualization
  createVisualizerBars();
  
  // Reset UI text
  const micLevelText = document.querySelector('.mic-level-text');
  if (micLevelText) {
    micLevelText.textContent = 'Speak into your microphone...';
  }
  
  // Reset button to Stop Mic Test
  const micButton = document.getElementById('stopMicButton');
  if (micButton) {
    micButton.textContent = 'Stop Mic Test';
    micButton.classList.remove('restart-button');
    micButton.classList.add('stop-button');
    
    // Remove existing event listeners by cloning the node
    const newButton = micButton.cloneNode(true);
    micButton.parentNode.replaceChild(newButton, micButton);
    
    // Add the stop event listener
    newButton.addEventListener('click', stopMicrophoneTest);
  }
  
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      microphoneStream = stream;
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      microphone.connect(analyser);
      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      function visualize() {
        analyser.getByteFrequencyData(dataArray);
        const sum = dataArray.reduce((a, b) => a + b, 0);
        const average = sum / bufferLength;
        
        // Update the level text
        const levelValue = document.querySelector('.level-value');
        if (levelValue) {
          levelValue.textContent = average.toFixed(2);
        }
        
        // Update the visualization bars
        updateVisualizerBars(dataArray);
        
        // Continue the animation
        animationFrameId = requestAnimationFrame(visualize);
      }
      
      // Start the visualization
      visualize();
    })
    .catch(error => {
      alert('Microphone access denied or not available.');
      console.error('Microphone error:', error);
    });
}

function createVisualizerBars() {
  const container = document.querySelector('.mic-bar-container');
  if (!container) return;
  
  // Clear existing bars
  container.innerHTML = '';
  
  // Create bars
  const numBars = 32;
  for (let i = 0; i < numBars; i++) {
    const bar = document.createElement('div');
    bar.classList.add('mic-bar');
    bar.style.height = '5px'; // Initial height
    container.appendChild(bar);
  }
}

function updateVisualizerBars(dataArray) {
  const bars = document.querySelectorAll('.mic-bar');
  if (!bars.length) return;
  
  const step = Math.floor(dataArray.length / bars.length);
  
  for (let i = 0; i < bars.length; i++) {
    const value = dataArray[i * step];
    const height = (value / 255) * 100;
    bars[i].style.height = height + '%';
    
    // Change color based on intensity
    const intensity = Math.min(255, value * 1.5);
    const hue = 120 - (intensity / 255 * 120); // From green to red
    bars[i].style.backgroundColor = `hsl(${hue}, 80%, 50%)`;
  }
}

function stopMicrophoneTest() {
  // Stop the animation
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
  
  // Stop the microphone stream
  if (microphoneStream) {
    microphoneStream.getTracks().forEach(track => track.stop());
    microphoneStream = null;
  }
  
  // Close audio context
  if (audioContext) {
    audioContext.close().then(() => {
      audioContext = null;
      analyser = null;
    });
  }
  
  // Reset visualization
  const levelValue = document.querySelector('.level-value');
  if (levelValue) {
    levelValue.textContent = '0';
  }
  
  const bars = document.querySelectorAll('.mic-bar');
  bars.forEach(bar => {
    bar.style.height = '5px';
    bar.style.backgroundColor = 'var(--color-primary)';
  });
  
  // Update UI to show microphone test is stopped
  const micLevelText = document.querySelector('.mic-level-text');
  if (micLevelText) {
    micLevelText.textContent = 'Microphone test stopped. Click "Test Microphone" to start again.';
  }
  
  // Change the stop button to a restart button
  const stopButton = document.getElementById('stopMicButton');
  if (stopButton) {
    stopButton.textContent = 'Start Again';
    stopButton.classList.remove('stop-button');
    stopButton.classList.add('restart-button');
    stopButton.removeEventListener('click', stopMicrophoneTest);
    stopButton.addEventListener('click', testMicrophone);
  }
}

// Audio context and control variables for speaker test
let audioCtx = null;
let currentAudio = null;
let gainNode = null;
let currentChannel = null;

function testSpeaker() {
  showTestArea('speakerTest');
  
  // Initialize audio context if not already created
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    gainNode = audioCtx.createGain();
    gainNode.connect(audioCtx.destination);
  }
  
  // Set up volume control
  const volumeSlider = document.getElementById('volumeSlider');
  const volumeValue = document.getElementById('volumeValue');
  
  volumeSlider.addEventListener('input', function() {
    const volume = parseFloat(this.value);
    volumeValue.textContent = Math.round(volume * 100) + '%';
    
    if (gainNode) {
      gainNode.gain.value = volume;
    }
  });
  
  // Set initial volume
  if (gainNode) {
    gainNode.gain.value = parseFloat(volumeSlider.value);
  }
  
  // Set up speaker channel buttons
  setupChannelButton('leftSpeakerBtn', 'left');
  setupChannelButton('rightSpeakerBtn', 'right');
  setupChannelButton('bothSpeakersBtn', 'both');
  
  // Set up stop button
  const stopButton = document.getElementById('stopSpeakerBtn');
  if (stopButton) {
    stopButton.addEventListener('click', stopAudio);
  }
}

function setupChannelButton(buttonId, channel) {
  const button = document.getElementById(buttonId);
  if (!button) return;
  
  // Remove existing event listeners by cloning
  const newButton = button.cloneNode(true);
  button.parentNode.replaceChild(newButton, button);
  
  newButton.addEventListener('click', function() {
    // Stop any currently playing audio
    stopAudio();
    
    // Remove active class from all buttons
    document.querySelectorAll('.channel-button').forEach(btn => {
      btn.classList.remove('active');
    });
    
    // Add active class to this button
    this.classList.add('active');
    
    // Play audio in the selected channel
    playAudioInChannel(channel);
    
    // Show stop button
    const stopButton = document.getElementById('stopSpeakerBtn');
    if (stopButton) {
      stopButton.style.display = 'block';
    }
  });
}

function playAudioInChannel(channel) {
  if (!audioCtx) return;
  
  currentChannel = channel;
  
  // Create a stereo panner node for channel control
  const pannerNode = audioCtx.createStereoPanner();
  
  // Set the panner value based on channel
  switch (channel) {
    case 'left':
      pannerNode.pan.value = -1; // Full left
      break;
    case 'right':
      pannerNode.pan.value = 1; // Full right
      break;
    case 'both':
    default:
      pannerNode.pan.value = 0; // Center (both speakers)
      break;
  }
  
  // Create an oscillator for the test tone
  const oscillator = audioCtx.createOscillator();
  oscillator.type = 'sine';
  oscillator.frequency.value = 440; // A4 note
  
  // Connect oscillator -> panner -> gain -> destination
  oscillator.connect(pannerNode);
  pannerNode.connect(gainNode);
  
  // Start the oscillator
  oscillator.start();
  currentAudio = oscillator;
  
  // Update UI
  updateChannelVisualizer(channel);
  
  // Update status text
  const playingStatus = document.getElementById('playingStatus');
  if (playingStatus) {
    playingStatus.textContent = `Playing in ${channel === 'both' ? 'both speakers' : channel + ' speaker'}`;
  }
}

function updateChannelVisualizer(channel) {
  // Get channel bar elements
  const leftBar = document.querySelector('.left-channel .channel-bar');
  const rightBar = document.querySelector('.right-channel .channel-bar');
  
  // Reset classes
  leftBar.classList.remove('active');
  rightBar.classList.remove('active');
  
  // Activate appropriate bars based on channel
  if (channel === 'left' || channel === 'both') {
    leftBar.classList.add('active');
  }
  
  if (channel === 'right' || channel === 'both') {
    rightBar.classList.add('active');
  }
}

function stopAudio() {
  // Stop the oscillator if it exists
  if (currentAudio) {
    currentAudio.stop();
    currentAudio = null;
  }
  
  // Reset UI
  document.querySelectorAll('.channel-button').forEach(btn => {
    btn.classList.remove('active');
  });
  
  document.querySelectorAll('.channel-bar').forEach(bar => {
    bar.classList.remove('active');
  });
  
  const playingStatus = document.getElementById('playingStatus');
  if (playingStatus) {
    playingStatus.textContent = 'Not playing';
  }
  
  // Hide stop button
  const stopButton = document.getElementById('stopSpeakerBtn');
  if (stopButton) {
    stopButton.style.display = 'none';
  }
  
  currentChannel = null;
}

function testKeyboard() {
  // Hide all test areas
  const testAreas = document.querySelectorAll('.test-area');
  testAreas.forEach(area => area.style.display = 'none');
  
  // Show the theme-and-layout section
  const themeAndLayoutSection = document.querySelector('.theme-and-layout');
  if (themeAndLayoutSection) {
    themeAndLayoutSection.style.display = '';
  }
  
  // Show the keyboard section with original styling
  const keyboardSection = document.querySelector('.keyboard');
  if (keyboardSection) {
    keyboardSection.style.display = '';
  }
  
  console.log('Keyboard test initiated');
}
