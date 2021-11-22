import PropTypes from 'prop-types';

function ImageGalleryItem({ images, onClick }) {
  return images.map(image => (
    <li className="ImageGalleryItem" key={image.id + image.tags}>
      <img
        onClick={() => onClick(image)}
        src={image.webformatURL}
        alt={image.tags}
        className="ImageGalleryItemImage"
      />
    </li>
  ));
}

ImageGalleryItem.propTypes = {
  images: PropTypes.arrayOf(PropTypes.object),
};

export default ImageGalleryItem;
