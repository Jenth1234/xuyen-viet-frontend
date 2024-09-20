import React, { useState } from 'react';
import Modal from 'react-modal'; // Đảm bảo cài đặt react-modal

Modal.setAppElement('#root');

const UpdateActivity = ({ isOpen, onClose, activity, onUpdate }) => {
  const [formData, setFormData] = useState({
    NAME: activity.NAME,
    LOCATION: activity.LOCATION,
    DESCRIPTION: activity.DESCRIPTION,
    COST: activity.COST,
    STARTTIME: activity.STARTTIME || '', // Thêm trường thời gian xuất phát
    ENDTIME: activity.ENDTIME || '',     // Thêm trường thời gian về
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData); // Gọi hàm cập nhật khi gửi form
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Chỉnh sửa hoạt động"
    >
      <h2 className="text-lg font-semibold">Chỉnh sửa hoạt động</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Tên hoạt động:
          <input
            type="text"
            name="NAME"
            value={formData.NAME}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Địa điểm:
          <input
            type="text"
            name="LOCATION"
            value={formData.LOCATION}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Mô tả:
          <textarea
            name="DESCRIPTION"
            value={formData.DESCRIPTION}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Giá:
          <input
            type="number"
            name="COST"
            value={formData.COST}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Thời gian xuất phát:
          <input
            type="time"
            name="STARTTIME"
            value={formData.STARTTIME}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Thời gian về:
          <input
            type="time"
            name="ENDTIME"
            value={formData.ENDTIME}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit" className="bg-green-500 text-white px-3 py-1 rounded">
          Lưu
        </button>
        <button type="button" onClick={onClose} className="ml-2 bg-red-500 text-white px-3 py-1 rounded">
          Hủy
        </button>
      </form>
    </Modal>
  );
};

export default UpdateActivity;
