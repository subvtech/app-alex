import LinkTool from '@editorjs/link';

/* class CustomLinkTool extends LinkTool {
  async onPaste(e) {
    e.preventDefault();
    const pastedLink = e.clipboardData.getData('text/plain');

    try {
      // Send a POST request to the server endpoint
      const response = await fetch('/api/fetch-link-data', {
        method: 'POST', // Use POST method
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: pastedLink }), // Send the link URL in the request body
      });

      if (response.ok) {
        const data = await response.json();
        this.showPopup(data);
      } else {
        console.error('Error fetching link data');
      }
    } catch (error) {
      console.error('Error fetching link data:', error);
    }
  }
} */
class CustomLinkTool extends LinkTool {
  render() {
    // Call the original render method
    const linkToolUI = super.render();

    // Add your custom UI elements here
    const customDropdown = document.createElement('select');
    customDropdown.innerHTML = `
        <option value="tutorial">Tutorial</option>
        <option value="video">Video</option>
        <option value="article">Article</option>
      `;

    // Append the custom dropdown to the link tool UI
    linkToolUI.appendChild(customDropdown);

    return linkToolUI;
  }

  save(blockContent) {
    // Get the custom dropdown value
    const customDropdownValue = blockContent.querySelector('select').value;

    // Get the default link tool data
    const linkToolData = super.save();

    // Add the custom dropdown value to the link tool data
    linkToolData.type = customDropdownValue;

    return linkToolData;
  }
}
export default CustomLinkTool;
