import { ClipLoader } from "react-spinners";
const ConfirmationOngoingModal = ({
  isOpen,
  onClose,
  onConfirm,
  booking,
  confirmLoading,
}) => {
  if (!isOpen || !booking) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
        <h3 className="text-lg font-semibold mb-4">
          Confirm Booking Completion
        </h3>
        <p>
          Are you sure you want to mark this booking as{" "}
          <strong>On-Going</strong>?
        </p>

        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="text-gray-600 cursor-pointer hover:text-black"
          >
            Cancel
          </button>
          {confirmLoading ? (
            <button
              onClick={onConfirm}
              className="bg-[#E60000] cursor-pointer items-center flex text-white px-8 py-2 rounded-md"
            >
              <ClipLoader size={20} color="#FFFFFF" />
            </button>
          ) : (
            <button
              onClick={onConfirm}
              className="bg-[#E60000] cursor-pointer text-white px-8 py-2 rounded-md"
            >
              Confirm
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfirmationOngoingModal;
