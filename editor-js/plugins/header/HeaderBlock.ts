import Header from 'editorjs-header-with-anchor';

class CustomHeader extends Header {
  render() {
    const Header = super.render();
    const id = Header.getAttribute('data-anchor');
    if (id) {
      Header.setAttribute('id', id);
    }
    return Header;
  }
}
export default CustomHeader;
