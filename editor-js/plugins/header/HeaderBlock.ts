import Header from 'editorjs-header-with-anchor';

class CustomHeader extends Header {
  render() {
    const Header = super.render();
    const text = Header.textContent;
    Header.setAttribute('id', text);
    return Header;
  }
}
export default CustomHeader;
