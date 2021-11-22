import { Component } from 'react';
import { ToastContainer } from 'react-toastify';
import './App.css';
import SearchBar from 'components/SearchBar';
import ImageGallery from 'components/ImageGallery';
import Modal from './components/Modal';

class App extends Component {
  state = {
    query: '',
    showModal: false,
    modalImage: '',
  };

  showModal = modalImage => {
    this.setState({ showModal: true, modalImage });
  };

  closeModal = () => {
    this.setState({ showModal: false });
  };

  handleFormSubmit = query => {
    this.setState({ query });
  };

  render() {
    const { query, showModal, modalImage } = this.state;

    return (
      <div className="App">
        {showModal && (
          <Modal modalImage={modalImage} onClose={this.closeModal} />
        )}
        <SearchBar onSubmit={this.handleFormSubmit} />
        <ImageGallery query={query} onClick={this.showModal} />
        <ToastContainer autoClose={3000} />
      </div>
    );
  }
}

export default App;
