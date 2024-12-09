import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getItineraryByUserId } from '../../api/callApi';
import { toggleItineraryShare, deleteItinerary } from '../../api/ApiItinerary';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical, faCalendarAlt, faClock, faGrip, faList, faSearch, faShare, faPencil, faTrash, faLock, faLockOpen } from '@fortawesome/free-solid-svg-icons';
import { toast, Toaster } from 'react-hot-toast';

const MyItinerary = () => {
  const [itineraryData, setItineraryData] = useState({
    myItineraries: [],
    sharedItineraries: []
  });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  });
  const [showOptions, setShowOptions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'oldest', 'longest', 'shortest'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' hoặc 'list'
  const [shareableStates, setShareableStates] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItinerary, setSelectedItinerary] = useState(null);
  const navigate = useNavigate();

  const fetchItineraries = async () => {
    try {
      setLoading(true);
      const response = await getItineraryByUserId();
      if (response.success) {
        setItineraryData({
          myItineraries: response.data.myItineraries,
          sharedItineraries: response.data.sharedItineraries
        });
        setPagination(response.pagination);
      }
    } catch (error) {
      console.error('Error fetching itineraries:', error);
      toast.error('Không thể tải danh sách lịch trình');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItineraries();
  }, []);

  useEffect(() => {
    const initialShareableStates = {};
    itineraryData.myItineraries.forEach(itinerary => {
      initialShareableStates[itinerary._id] = itinerary.SHAREABLE;
    });
    setShareableStates(initialShareableStates);
  }, [itineraryData.myItineraries]);

  const handleEdit = (id) => {
    navigate(`/itinerary/${id}`);
    setShowOptions(null);
  };

  const handleDelete = (id) => {
    setItineraryData(prev => ({
      ...prev,
      myItineraries: prev.myItineraries.filter(itinerary => itinerary._id !== id)
    }));
    setShowOptions(null);
  };

  const handleShare = async (itinerary) => {
    try {
      // Kiểm tra token trước khi gọi API
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Vui lòng đăng nhập để chia sẻ lịch trình');
        navigate('/login');
        return;
      }

      const response = await toggleItineraryShare(itinerary._id);
      
      if (response.success) {
        setShareableStates(prev => ({
          ...prev,
          [itinerary._id]: response.data.shareable
        }));

        toast.success(response.message || (response.data.shareable ? 'Đã bật chia sẻ' : 'Đã tắt chia sẻ'));

        if (response.data.shareable) {
          const shareUrl = `${window.location.origin}/shared-itinerary/${itinerary._id}`;
          
          try {
            if (navigator.share) {
              await navigator.share({
                title: `Lịch trình: ${itinerary.NAME}`,
                text: `Xem lịch trình du lịch của tôi: ${itinerary.NAME}`,
                url: shareUrl
              });
            } else {
              await navigator.clipboard.writeText(shareUrl);
              toast.success('Đã sao chép liên kết chia sẻ!');
            }
          } catch (shareError) {
            await navigator.clipboard.writeText(shareUrl);
            toast.success('Đã sao chép liên kết chia sẻ!');
          }
        }
      }
    } catch (error) {
      console.error('Error sharing:', error);
      
      // Xử lý các trường hợp lỗi cụ thể
      if (error.message.includes('đăng nhập')) {
        toast.error('Vui lòng đăng nhập để thực hiện chức năng này');
        navigate('/login');
      } else if (error.message.includes('không có quyền')) {
        toast.error('Bạn không có quyền thực hiện chức năng này');
      } else {
        toast.error(error.message || 'Không thể thay đổi trạng thái chia sẻ');
      }
    }
  };

  const filteredAndSortedItineraries = useMemo(() => {
    let result = [...itineraryData.myItineraries];
    
    // Lọc theo search term
    if (searchTerm) {
      result = result.filter(item => 
        item.NAME.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Sắp xếp
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.START_DATE) - new Date(a.START_DATE));
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.START_DATE) - new Date(b.START_DATE));
        break;
      case 'longest':
        result.sort((a, b) => 
          (new Date(b.END_DATE) - new Date(b.START_DATE)) - 
          (new Date(a.END_DATE) - new Date(a.START_DATE))
        );
        break;
      case 'shortest':
        result.sort((a, b) => 
          (new Date(a.END_DATE) - new Date(a.START_DATE)) - 
          (new Date(b.END_DATE) - new Date(b.START_DATE))
        );
        break;
      default:
        break;
    }
    
    return result;
  }, [itineraryData.myItineraries, searchTerm, sortBy]);

  const handleDeleteClick = (itinerary) => {
    setSelectedItinerary(itinerary);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await deleteItinerary(selectedItinerary._id);
      
      if (response.success) {
        toast.success('Đã xóa lịch trình thành công');
        // Refresh danh sách lịch trình
        fetchItineraries();
      } else {
        toast.error(response.message || 'Có lỗi xảy ra khi xóa lịch trình');
      }
      setShowDeleteModal(false);
      
    } catch (error) {
      // Xử lý các loại lỗi cụ thể
      const errorMessage = error.message || 'Có lỗi xảy ra khi xóa lịch trình';
      
      if (errorMessage.includes('không có quyền')) {
        toast.error('Bạn không có quyền xóa lịch trình này');
      } else if (errorMessage.includes('không tìm thấy')) {
        toast.error('Lịch trình không tồn tại hoặc đã bị xóa');
        // Refresh lại danh sách để cập nhật UI
        fetchItineraries();
      } else {
        toast.error(errorMessage);
      }
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-8">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            theme: {
              primary: '#4aed88',
            },
          },
        }}
      />
      
      <div className="space-y-6 mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Lịch Trình Của Bạn</h2>
          <div className="flex items-center space-x-2">
            <div className="bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors
                  ${viewMode === 'grid' 
                    ? 'bg-white text-gray-800 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'}`}
              >
                <FontAwesomeIcon icon={faGrip} className="mr-2" />
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors
                  ${viewMode === 'list' 
                    ? 'bg-white text-gray-800 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'}`}
              >
                <FontAwesomeIcon icon={faList} className="mr-2" />
                List
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Tìm kiếm lịch trình..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
            />
            <FontAwesomeIcon 
              icon={faSearch} 
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 cursor-pointer"
          >
            <option value="newest">Mới nhất</option>
            <option value="oldest">Cũ nhất</option>
            <option value="longest">Dài nhất</option>
            <option value="shortest">Ngắn nhất</option>
          </select>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>
            Hiển thị {filteredAndSortedItineraries.length} trong tổng số {pagination.total} lịch trình
          </span>
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="text-green-600 hover:text-green-700 font-medium"
            >
              Xóa tìm kiếm
            </button>
          )}
        </div>
      </div>

      {filteredAndSortedItineraries.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <FontAwesomeIcon icon={faCalendarAlt} className="h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500">
            {searchTerm 
              ? 'Không tìm thấy lịch trình phù hợp' 
              : 'Bạn chưa có lịch trình nào. Hãy tạo lịch trình đầu tiên!'}
          </p>
        </div>
      ) : (
        <div className={`space-y-6 ${viewMode === 'grid' ? 'grid-view' : 'list-view'}`}>
          <div className={`
            ${viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' 
              : 'space-y-4'}
            max-h-[calc(100vh-320px)] overflow-y-auto pr-2
            scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100
          `}>
            {filteredAndSortedItineraries.map((itinerary) => (
              <div 
                key={itinerary._id} 
                className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 
                  hover:border-green-200 hover:-translate-y-1"
              >
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-base font-semibold text-gray-800 line-clamp-2 flex-1 mr-2">
                      {itinerary.NAME}
                    </h3>
                    <div className="relative">
                      <button
                        onClick={() => setShowOptions(showOptions === itinerary._id ? null : itinerary._id)}
                        className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <FontAwesomeIcon icon={faEllipsisVertical} className="h-4 w-4 text-gray-500" />
                      </button>
                      {showOptions === itinerary._id && (
                        <div className="absolute right-0 mt-1 w-44 bg-white rounded-lg shadow-xl border border-gray-100 z-10
                          animate-fadeIn">
                          <button 
                            onClick={() => handleEdit(itinerary._id)} 
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                          >
                            <FontAwesomeIcon icon={faPencil} className="w-4 h-4 text-gray-500" />
                            <span>Chỉnh sửa</span>
                          </button>
                          
                          <button 
                            onClick={() => handleShare(itinerary)}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                          >
                            <FontAwesomeIcon 
                              icon={shareableStates[itinerary._id] ? faLockOpen : faLock} 
                              className="w-4 h-4" 
                            />
                            <span>
                              {shareableStates[itinerary._id] ? 'Tắt chia sẻ' : 'Bật chia sẻ'}
                            </span>
                          </button>
                          
                          <button 
                            onClick={() => handleDeleteClick(itinerary)} 
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2 border-t border-gray-100"
                          >
                            <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                            <span>Xóa lịch trình</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 space-y-2">
                    <div className="flex items-center text-gray-600 text-sm">
                      <FontAwesomeIcon icon={faCalendarAlt} className="h-3.5 w-3.5 mr-2" />
                      <span className="text-xs">
                        {new Date(itinerary.START_DATE).toLocaleDateString('vi-VN')} - 
                        {new Date(itinerary.END_DATE).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <FontAwesomeIcon icon={faClock} className="h-3.5 w-3.5 mr-2" />
                      <span className="text-xs">
                        {Math.ceil((new Date(itinerary.END_DATE) - new Date(itinerary.START_DATE)) / (1000 * 60 * 60 * 24))} ngày
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 flex space-x-2">
                    <button 
                      onClick={() => handleEdit(itinerary._id)} 
                      className="flex-1 py-1.5 text-green-600 hover:text-green-700 text-xs font-medium 
                        transition-colors text-center border border-green-600 rounded-lg hover:bg-green-50
                        flex items-center justify-center space-x-1"
                    >
                      <span>Xem chi tiết</span>
                      <span>→</span>
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShare(itinerary);
                      }}
                      className={`px-3 py-1.5 text-xs font-medium
                        transition-colors text-center border rounded-lg
                        ${shareableStates[itinerary._id] 
                          ? 'text-green-600 border-green-600 hover:bg-green-50' 
                          : 'text-gray-600 border-gray-300 hover:bg-gray-50'
                        }`}
                      title={shareableStates[itinerary._id] ? 'Đã bật chia sẻ' : 'Chưa bật chia sẻ'}
                    >
                      <FontAwesomeIcon 
                        icon={shareableStates[itinerary._id] ? faLockOpen : faLock} 
                      />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Xác nhận xóa */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Xác nhận xóa</h3>
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn xóa lịch trình "{selectedItinerary?.NAME}"? 
              Hành động này không thể hoàn tác.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyItinerary;