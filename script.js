const consoleLogData = {};

function goToConsole(tag) {
  const element = document.querySelector(tag);
  if (element) {
    console.log(`Error found on tag: ${tag}`);
    console.log(element);
  } else {
    console.log(`Tag ${tag} not found.`);
  }
}

const checkAccessibility = async () => {
  const url = $('#url').val();

  try {
    const response = await $.ajax({
      url: 'proxy.php',
      method: 'POST',
      data: { url },
    });

    const htmlDocument = document.implementation.createHTMLDocument();
    htmlDocument.documentElement.innerHTML = response;

    const violations = await getViolations(htmlDocument);

    renderDisabilities(violations);
  } catch (error) {
    console.error('An error occurred while performing the accessibility check:', error);
  }
};

const getViolations = async (htmlDocument) => {
  // Your custom implementation to analyze the HTML document and extract violations
  // Replace this with your own logic to determine violations disability-wise
  // Example structure of violations:
  const violations = [
    // Visual
    { disability: 'Visual', guideline: '1.3.2', help: 'Ensure that text can be resized without assistive technology up to 200% without loss of content or functionality.', target: 'text' },
    { disability: 'Visual', guideline: '1.3.3', help: 'Ensure that text is not justified (aligned to both the left and right margins).', target: 'text' },
    { disability: 'Visual', guideline: '1.3.4', help: 'Ensure that text spacing can be adjusted to at least 1.5 times the default spacing.', target: 'text' },
    { disability: 'Visual', guideline: '1.4.14', help: 'Ensure that color is not used as the only visual means of conveying information, indicating an action, or prompting a response.', target: 'element' },
    { disability: 'Visual', guideline: '1.4.15', help: 'Provide a way to disable animations that can cause motion sickness or distract users.', target: 'element' },
    { disability: 'Visual', guideline: '1.4.16', help: 'Ensure that text is presented in a way that can be read without requiring the user to scroll horizontally.', target: 'text' },
    { disability: 'Visual', guideline: '1.4.17', help: 'Provide a way to adjust the text spacing to at least 1.5 times the default spacing.', target: 'text' },
    { disability: 'Visual', guideline: '1.4.18', help: 'Ensure that information conveyed by color differences is also available in text or other visual indicators.', target: 'element' },
    { disability: 'Visual', guideline: '1.4.19', help: 'Provide a way to bypass blocks of content that are repeated on multiple pages.', target: 'element' },
    { disability: 'Visual', guideline: '1.4.20', help: 'Ensure that images of text have sufficient contrast when used as a substitute for rendered text.', target: 'img' },
  
    // Auditory
    { disability: 'Auditory', guideline: '1.2.10', help: 'Provide a way to control audio playback speed without changing pitch.', target: 'audio' },
    { disability: 'Auditory', guideline: '1.2.11', help: 'Provide a way to control audio volume independently for foreground speech and background sounds.', target: 'audio' },
    { disability: 'Auditory', guideline: '1.2.12', help: 'Ensure that audio tracks that include spoken content have transcripts available.', target: 'audio' },
    { disability: 'Auditory', guideline: '1.2.13', help: 'Provide a way to turn off all audio that plays automatically on a web page.', target: 'audio' },
    { disability: 'Auditory', guideline: '1.4.21', help: 'Ensure that audio is not played automatically when a page is loaded or refreshed.', target: 'audio' },
    { disability: 'Auditory', guideline: '1.4.22', help: 'Provide a way to visually indicate when audio is playing and when it has stopped or been paused.', target: 'audio' },
    { disability: 'Auditory', guideline: '1.4.23', help: 'Provide a way to adjust the volume of audio content that is essential for understanding the page.', target: 'audio' },
    { disability: 'Auditory', guideline: '1.4.24', help: 'Ensure that background sounds are adjustable or can be turned off.', target: 'audio' },
    { disability: 'Auditory', guideline: '1.4.25', help: 'Provide a way to disable background audio that plays automatically.', target: 'audio' },
    { disability: 'Auditory', guideline: '1.4.26', help: 'Ensure that audio does not play automatically when a page is loaded or refreshed.', target: 'audio' },
  
    // Motor
    { disability: 'Motor', guideline: '2.1.4', help: 'Ensure that all functionality can be operated using either the mouse or the keyboard.', target: 'element' },
    { disability: 'Motor', guideline: '2.1.5', help: 'Provide a way to bypass repetitive blocks of content.', target: 'element' },
    { disability: 'Motor', guideline: '2.1.6', help: 'Provide keyboard shortcuts to important elements and functionality.', target: 'element' },
    { disability: 'Motor', guideline: '2.3.2', help: 'Ensure that interactions do not require precise timing.', target: 'element' },
    { disability: 'Motor', guideline: '2.3.3', help: 'Ensure that interactions can be completed within a reasonable time.', target: 'element' },
    { disability: 'Motor', guideline: '2.4.9', help: 'Provide a way to disable any shaking, blinking, or flashing content that can cause seizures or physical reactions.', target: 'element' },
    { disability: 'Motor', guideline: '2.4.10', help: 'Provide a way to pause, stop, or hide any moving, blinking, or scrolling content that can cause distractions.', target: 'element' },
    { disability: 'Motor', guideline: '2.4.11', help: 'Ensure that users have enough time to read and interact with content.', target: 'element' },
    { disability: 'Motor', guideline: '2.4.12', help: 'Provide a way to navigate through blocks of content that are repeated on multiple pages.', target: 'element' },
    { disability: 'Motor', guideline: '2.4.13', help: 'Ensure that interactions with the same functionality can be performed consistently.', target: 'element' },
  
    // Cognitive
    { disability: 'Cognitive', guideline: '3.1.2', help: 'Ensure that information is presented in a clear and organized manner.', target: 'element' },
    { disability: 'Cognitive', guideline: '3.1.3', help: 'Ensure that instructions for understanding and using content are provided.', target: 'element' },
    { disability: 'Cognitive', guideline: '3.2.4', help: 'Ensure that content does not blink more than three times in one second.', target: 'element' },
    { disability: 'Cognitive', guideline: '3.2.5', help: 'Provide a way to pause, stop, or hide any auto-updating content that can cause distractions.', target: 'element' },
    { disability: 'Cognitive', guideline: '3.3.6', help: 'Ensure that content is organized in a logical and consistent manner.', target: 'element' },
    { disability: 'Cognitive', guideline: '3.3.7', help: 'Provide a way to navigate to different sections of a web page easily.', target: 'element' },
    { disability: 'Cognitive', guideline: '3.3.8', help: 'Ensure that important content is not hidden or difficult to find.', target: 'element' },
    { disability: 'Cognitive', guideline: '3.3.9', help: 'Provide a way to locate and correct mistakes made during form input.', target: 'element' },
    { disability: 'Cognitive', guideline: '3.3.10', help: 'Ensure that user interfaces are clear, consistent, and predictable.', target: 'element' },
    { disability: 'Cognitive', guideline: '3.3.11', help: 'Provide a way to customize the appearance and behavior of the website.', target: 'element' },
  ];
  
  // Total number of violations for each disability category
  const visualViolations = violations.filter(v => v.disability === 'Visual').length;
  const auditoryViolations = violations.filter(v => v.disability === 'Auditory').length;
  const motorViolations = violations.filter(v => v.disability === 'Motor').length;
  const cognitiveViolations = violations.filter(v => v.disability === 'Cognitive').length;
  

  return violations;
};

const renderDisabilities = (violations) => {
  const disabilitiesContainer = document.getElementById('disabilities');
  const disabilities = ['Visual', 'Auditory', 'Motor', 'Cognitive'];
  disabilitiesContainer.innerHTML = '';

  disabilities.forEach(disability => {
    const btn = document.createElement('button');
    btn.classList.add('btn', 'btn-primary', 'disability-btn');
    btn.innerText = disability;
    btn.addEventListener('click', () => showViolations(disability, violations));
    disabilitiesContainer.appendChild(btn);
  });
};


const showViolations = (selectedDisability, violations) => {
  const violationsContainer = document.getElementById('violations');
  violationsContainer.innerHTML = '';

  const selectedViolations = violations.filter(violation => violation.disability === selectedDisability);

  if (selectedViolations.length === 0) {
    const noViolationElement = document.createElement('div');
    noViolationElement.textContent = 'No violations found for this disability.';
    violationsContainer.appendChild(noViolationElement);
  } else {
    selectedViolations.forEach(violation => {
      const violationElement = document.createElement('div');
      violationElement.classList.add('violation');

      const guidelineElement = document.createElement('p');
      guidelineElement.classList.add('guideline');
      guidelineElement.textContent = `Guideline violated: WCAG 2.2 - ${violation.guideline}`;
      violationElement.appendChild(guidelineElement);

      const solutionElement = document.createElement('p');
      solutionElement.classList.add('solution');
      solutionElement.textContent = `Solution/Hint: ${violation.help}`;
      violationElement.appendChild(solutionElement);

      const tagElement = document.createElement('p');
      tagElement.classList.add('tag');
      tagElement.textContent = `Tag: <${violation.target}>`;
      violationElement.appendChild(tagElement);

      tagElement.addEventListener('click', () => {
        const element = document.querySelector(violation.target);
        if (element) {
          element.classList.add('highlighted');
        }
      });
      
      violationsContainer.appendChild(violationElement);
    });

  }
};

const getTagDescription = (target) => {
  switch (target) {
    case 'img':
      return 'Image';
    case 'video':
      return 'Video';
    case 'button':
      return 'Button';
    case 'nav':
      return 'Navigation';
    // Add more cases for other tags as needed
    default:
      return target;
  }
};
const printCode = (target) => {
  // Your custom logic to display the relevant code based on the target/tag clicked
  console.log(`Code for element with tag '${target}'`);
};

$(document).ready(() => {
  $('#url-form').on('submit', (event) => {
    event.preventDefault();
    checkAccessibility();
  });
});

// Override console.log to capture data
console.log = (message, ...args) => {
  const target = args.length > 0 ? args[args.length - 1] : '';
  consoleLogData[target] = consoleLogData[target] || [];
  consoleLogData[target].push(message);
};
