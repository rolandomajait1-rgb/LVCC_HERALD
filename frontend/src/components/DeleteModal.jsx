import PropTypes from 'prop-types';

export default function DeleteModal({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">
          {title || 'Are you sure?'}
        </h3>
        <p className="text-gray-600 text-center mb-8 leading-relaxed">
          {message || 'Are you sure you want to delete this article? This action will permanently delete this article.'}
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={onConfirm}
            className="w-full bg-red-600 text-white py-4 rounded-full font-semibold hover:bg-red-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Delete
          </button>
          <button
            onClick={onClose}
            className="w-full bg-white text-gray-700 py-4 rounded-full font-semibold border-2 border-gray-300 hover:bg-gray-50 transition-all duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

DeleteModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string,
  message: PropTypes.string,
};
