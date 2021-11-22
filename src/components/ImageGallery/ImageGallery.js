import { Component } from 'react';
import PropTypes from 'prop-types';
import Loader from 'react-loader-spinner';
import ImageGalleryItem from './ImageGalleryItem';
import Button from '../Button';
import fetchImages from '../../services/fetchImages';

class ImageGallery extends Component {
  static propTypes = {
    query: PropTypes.string,
    onClick: PropTypes.func,
  };

  state = {
    images: [],
    error: null,
    pages: 0,
    page: 1,
    status: 'idle',
  };

  async componentDidUpdate(prevProps, prevState) {
    const prevQuery = prevProps.query;
    const nextQuery = this.props.query;
    const prevPage = prevState.page;
    const nextPage = this.state.page;

    if (prevQuery !== nextQuery) {
      this.resetPage();
      this.setState({ status: 'pending' });
      await fetchImages(nextQuery, 1)
        .then(images => {
          // console.log(images);
          if (images.totalHits === 0) {
            throw new Error(`There are no pictures with such "${nextQuery}"`);
          }
          const totalPages = Math.ceil(images.totalHits / 12);
          this.setState({
            images: [...images.hits],
            status: 'resolved',
            pages: totalPages,
          });
        })
        .catch(error => {
          // console.log(error);
          this.setState({ error, status: 'rejected' });
        });

      this.autoScroll();
    }

    if (prevPage !== nextPage && nextPage > 1) {
      this.setState({ status: 'more-pending' });
      await fetchImages(nextQuery, nextPage)
        .then(images => {
          this.setState(prevState => ({
            images: [...prevState.images, ...images.hits],
            status: 'resolved',
          }));
        })
        .catch(error => this.setState({ error, status: 'rejected' }));
      this.autoScroll();
    }
  }

  loadMoreHandler = () => {
    this.setState(prevState => {
      return { page: prevState.page + 1 };
    });
  };

  autoScroll = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  };

  resetPage = () => {
    this.setState({ page: 1 });
  };

  render() {
    const { images, error, status, page, pages } = this.state;

    if (status === 'idle') {
      return <h1>Please, enter something</h1>;
    }

    if (status === 'pending') {
      return (
        <Loader type="TailSpin" color="#3f51b5" height={180} width={180} />
      );
    }

    if (status === 'more-pending') {
      return (
        <>
          <ul className="ImageGallery">
            <ImageGalleryItem images={images} onClick={this.props.onClick} />
          </ul>
          <Loader type="TailSpin" color="#3f51b5" height={180} width={180} />
        </>
      );
    }

    if (status === 'resolved') {
      return (
        <>
          <ul className="ImageGallery">
            <ImageGalleryItem images={images} onClick={this.props.onClick} />
          </ul>
          {pages > page ? <Button onClick={this.loadMoreHandler} /> : <></>}
        </>
      );
    }

    if (status === 'rejected') {
      return <h2>{error.message}</h2>;
    }
  }
}

ImageGallery.propTypes = {
  images: PropTypes.arrayOf(PropTypes.object),
};

export default ImageGallery;
