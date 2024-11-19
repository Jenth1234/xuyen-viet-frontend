import React, { useState, useEffect, useRef } from "react";
import { useLocation, useParams } from "react-router-dom";
import ActivityModal from "./modal/ActivityModal";
import UpdateActivity from "./modal/UpdateActivityModal";
import UpdateItineraryModal from "./modal/UpdateItineraryModal"; // update
import { getItinerary, updateActivity } from "../../api/callApi";
import { getPlaceById } from "../../api/ApiPlace";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Test from "./test";
import {
  faInfoCircle,
  faCalendarAlt,
  faDollarSign,
  faEdit,
  faMapMarkerAlt,
  faGlassCheers,
  faClock,
  faDownload,
  faMapMarkedAlt, 
  faCoins,        
  faShare,
  faChevronRight,
  faPlane,
  faUser,
  faTicketAlt,
  faHotel,
  faKey,
  faPlus,
  faCamera,
  faSave,
  faCalendarDay,
  faPlaneDeparture,
  
} from "@fortawesome/free-solid-svg-icons";
import bgItinerary from "../../style/img/lienkhuong2.jpg";
import html2canvas from "html2canvas";
import { getInvoiceByUser } from "../../api/ApiInvoice";
import ProgressBar from "./ProgressBar";
import { Alert } from "antd";

const getCurrentStep = (pathname) => {
  switch (pathname) {
    case "/suggest-itinerary":
      return 1;
    case "/suggest-place":
      return 2;
    case "/create-itinerary":
      return 3;
    default:
      return 4; // Mặc định là bước 4 cho trang chi tiết lịch trình
  }
};
const DetailPage = () => {
  const location = useLocation();
  const currentStep = getCurrentStep(location.pathname);
  const { itineraryId } = useParams();
  const { state } = location;
  const viewOnly = state?.viewOnly || false;
  const fromNotification = state?.fromNotification || false;
  const {
    activities = [],
    startDate: initialStartDate = "",
    endDate: initialEndDate = "",
    selectedPlaces,
  } = state || {};

  const [days, setDays] = useState(0);
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null); // Trạng thái lưu địa điểm đã chọn
  const [invoices, setInvoices] = useState([]);
  const [activitiesState, setActivitiesState] = useState(activities);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentActivity, setCurrentActivity] = useState(null);
  const [currentDayIndex, setCurrentDayIndex] = useState(null);
  const [isItineraryEditing, setIsItineraryEditing] = useState(false); // State cho modal chỉnh sửa hành trình
  const [itinerary, setItinerary] = useState({});
  const dayRefs = useRef([]);
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [totalCost, setTotalCost] = useState("0");
  const [dateArray, setDateArray] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const itineraryRef = useRef(); // Tạo ref để tham chiếu đến phần tử cần chụp
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dayRoutes, setDayRoutes] = useState(routes); // Lưu trữ các lộ trình của ngày
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getItinerary(itineraryId);
        const activitiesData = response.ACTIVITIES || [];
        if (response) {
          setItinerary(response);
          setStartDate(response.START_DATE);
          setEndDate(response.END_DATE);
          const startDateObj = new Date(response.START_DATE);
          const endDateObj = new Date(response.END_DATE);
          const dayCount =
            Math.ceil((endDateObj - startDateObj) / (1000 * 60 * 60 * 24)) + 1;

          setDateArray(
            Array.from({ length: dayCount }, (_, index) => {
              const currentDate = new Date(startDateObj);
              currentDate.setDate(currentDate.getDate() + index);
              return currentDate.toISOString().split("T")[0];
            })
          );

          // Khởi tạo mảng hoạt động cho mỗi ngày
          const activitiesByDay = Array.from({ length: dayCount }, () => []);

          // Phân loại hoạt động vào ngày tương ứng dựa trên STARTTIME
          activitiesData.forEach((activity) => {
            const startTime = new Date(activity.STARTTIME);
            const dayIndex = Math.floor(
              (startTime - startDateObj) / (1000 * 60 * 60 * 24)
            );
            if (dayIndex >= 0 && dayIndex < dayCount) {
              activitiesByDay[dayIndex].push(activity);
            }
          });

          setActivitiesState(activitiesByDay);
          setDays(dayCount);
          setTotalCost(calculateTotalCost(activitiesByDay));
          if (fromNotification && itineraryRef.current) {
            itineraryRef.current.scrollIntoView({ behavior: 'smooth' });
          }
        } else {
          console.error("No data found.");
        }
      } catch (error) {
        console.error("API call error:", error);
      }
    };
    if (itineraryId) {
      fetchData();
    }


  }, [itineraryId,fromNotification]);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        // Fetch data cho các địa điểm bằng ID
        const placesData = await Promise.all(
          selectedPlaces.map((id) => getPlaceById(id))
        );
        // Trích xuất dữ liệu từ phản hồi và cập nhật vào state
        setPlaces(placesData.map((place) => place.data)); // Dữ liệu địa điểm nằm trong `data`
      } catch (error) {
        console.error("Error fetching places:", error);
      }
    };

    fetchPlaces();
  }, [selectedPlaces]); // Khi `selectedPlaces` thay đổi, sẽ gọi lại fetchPlaces
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        // Lấy dữ liệu hóa đơn mà không cần userId
        const data = await getInvoiceByUser();
        console.log(data);
        setInvoices(data);
      } catch (error) {
        console.error("Không thể lấy dữ liệu hóa đơn.", error);
      }
    };

    fetchInvoices();
  }, []); // Chạy lần đầu tiên khi component mount

  // Hàm tính toán lộ trình giữa các địa điểm

  console.log("du lieu",places);
  const getRouteForDay = async (places) => {
    // Lọc các địa điểm hợp lệ (có đủ các trường NAME, ADDRESS, URLADDRESS)
    const validPlaces = [];
    const invalidPlaces = [];

    places.forEach((place, index) => {
        if (place && place.NAME && place.ADDRESS && place.URLADDRESS) {
            validPlaces.push(place);
        } else {
            let reason = "";
            if (!place) {
                reason = "Địa điểm bị null hoặc undefined";
            } else {
                if (!place.NAME) reason += "NAME bị thiếu. ";
                if (!place.ADDRESS) reason += "ADDRESS bị thiếu. ";
                if (!place.URLADDRESS) reason += "URLADDRESS bị thiếu. ";
            }
            invalidPlaces.push({ place, index, reason });
        }
    });

    // Nếu không đủ địa điểm hợp lệ, bỏ qua
    if (validPlaces.length < 2) {
        return [];
    }

    // Hàm gọi API Geocoding cho từng địa chỉ
    const getCoordinatesForAddress = async (address) => {
        const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}`;
        const geocodeResponse = await fetch(geocodeUrl);
        const geocodeData = await geocodeResponse.json();

        if (!geocodeData || geocodeData.features.length === 0) {
            return null;
        }
        return geocodeData.features[0].center.join(',');
    };

    try {
        // Nhóm các địa điểm theo từng ngày
        const routeDetails = [];
        let dayIndex = 1;
        let lastPlace = null;

        for (let i = 0; i < validPlaces.length - 1; i++) {
            const fromPlace = validPlaces[i];
            const toPlace = validPlaces[i + 1];
            
            if (!fromPlace || !toPlace) continue;

            // Kiểm tra điều kiện toName không bắt đầu từ fromName
            const fromName = fromPlace.NAME || "Không rõ";
            const toName = toPlace.NAME || "Không rõ";
            if (toName.startsWith(fromName)) {
                continue; // Bỏ qua nếu toName bắt đầu từ fromName
            }

            const coordinates = await Promise.all([getCoordinatesForAddress(fromPlace.ADDRESS), getCoordinatesForAddress(toPlace.ADDRESS)]);
            const validCoordinates = coordinates.filter(coord => coord !== null).join(';');

            if (validCoordinates) {
                const directionsUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${validCoordinates}?access_token=${process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}&overview=full`;
                const response = await fetch(directionsUrl);
                const data = await response.json();

                if (data.routes && data.routes.length > 0) {
                    const route = data.routes[0];
                    const getImagesForPlace = async (place) => {
                        const images = place.IMAGES?.NORMAL || [];
                        return images.length > 0 ? images[0] : "https://via.placeholder.com/150";
                    };

                    const fromImage = await getImagesForPlace(fromPlace);
                    const toImage = await getImagesForPlace(toPlace);

                    // Kiểm tra xem địa điểm đã có trong ngày trước chưa
                    if (!lastPlace || (lastPlace.from !== fromName || lastPlace.to !== toName)) {
                        // Thêm vào routeDetails
                        routeDetails.push({
                            from: fromName,
                            to: toName,
                            distance: (route.distance / 1000).toFixed(2),
                            duration: (route.duration / 60).toFixed(2),
                            fromImage,
                            toImage,
                            day: dayIndex,
                        });

                        lastPlace = { from: fromName, to: toName };

                        // Tăng dayIndex khi chuyển sang ngày mới
                        if (i + 2 < validPlaces.length) {
                            dayIndex++;
                        }
                    }
                }
            }
        }

        // Loại bỏ các tuyến không hợp lệ (null) và sắp xếp theo ngày
        const validRouteDetails = routeDetails.filter((route) => route !== null);

        return validRouteDetails;
    } catch (err) {
        return [];
    }
};




console.log(routes)
  // Hàm tính lịch trình hợp lý cho mỗi ngày
  const calculateOptimizedItinerary = async () => {
    setLoading(true);
    const allRoutes = [];
  
    // Kiểm tra nếu không có places hoặc places.length = 0
    if (!places || places.length === 0) {
      setRoutes([]);
      setLoading(false);
      return;
    }
  
    // Chia thành nhóm mỗi ngày 2 địa điểm nhưng không liên kết với nhóm trước đó
    for (let i = 0; i < places.length; i++) {
      const dayPlaces = places.slice(i, i + 2);  // Lấy 2 địa điểm cho mỗi ngày
      
      // Kiểm tra nếu dayPlaces có đủ dữ liệu
      if (dayPlaces.length > 0) {
        // Tính toán lộ trình cho nhóm địa điểm
        const routeDetails = await getRouteForDay(dayPlaces);
  
        // Kiểm tra nếu có lộ trình hợp lệ
        if (routeDetails && routeDetails.length > 0) {
          allRoutes.push({
            day: i + 1,
            route: routeDetails,
            activities: activitiesState[i] || [], 
          });
        }
  
        // Đảm bảo không bị bỏ qua ngày cuối nếu chỉ có một địa điểm trong nhóm
        if (dayPlaces.length === 1) {
          i++; 
        }
      }
    }
  
    setRoutes(allRoutes);
    setLoading(false);
  };


  // Hàm xử lý khi kéo và thả
  const handleOnDragEnd = (result) => {
    const { destination, source } = result;

    // Nếu thả ra ngoài khu vực hợp lệ, không làm gì
    if (!destination || source.index === destination.index) {
      return;
    }

    // Tiến hành xử lý thay đổi
    const items = Array.from(routes);
    const [reorderedItem] = items.splice(source.index, 1); // Xóa item đang kéo
    items.splice(destination.index, 0, reorderedItem); // Chèn vào vị trí mới

    setRoutes(items); // Cập nhật lại trạng thái với danh sách mới
  };

  useEffect(() => {
    const initializeRoutes = async () => {
      if (places && places.length > 0) {
        await calculateOptimizedItinerary();
      } else {
        setRoutes([]);
        setLoading(false);
      }
    };
  
    initializeRoutes();
  }, [places]);

  if (loading) {
    return <div>Đang gợi ý lộ trình tối ưu cho bạn...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const handleSaveAndShare = (event) => {
    event.preventDefault(); // Ngăn không cho form tự động refresh trang khi submit

    console.log("1111");

    // Lưu dữ liệu
    const newItinerary = {
      /* thông tin hoạt động */
    };
    handleSaveItinerary(newItinerary); // Giả sử bạn đã có hàm để lưu hoạt động

    // Hiển thị hộp thoại xác nhận
    setShowConfirmation(true);
  };
  const handleSaveItinerary = (itinerary) => {
    // Thực hiện lưu dữ liệu (ví dụ gọi API hoặc xử lý dữ liệu)
    console.log("Dữ liệu đã được lưu:", itinerary);
    alert("thêm thành công lịch trình");
  };

  // Tính toán tổng chi phí của tất cả các hoạt động trong hành trình
  const calculateTotalCost = (activitiesByDay) => {
    if (!Array.isArray(activitiesByDay)) return "0";
    const total = activitiesByDay.reduce((total, day) => {
      return (
        total +
        (day.reduce(
          (dayTotal, activity) => dayTotal + (parseFloat(activity.COST) || 0),
          0
        ) || 0)
      );
    }, 0);
    return total.toLocaleString();
  };
  // Cuộn đến ngày cụ thể trong danh sách hành trình khi người dùng nhấp vào ngày.
  const handleScrollToDay = (index) => {
    dayRefs.current[index]?.scrollIntoView({ behavior: "smooth" });
  };
  // Mở modal để thêm hoạt động mới cho ngày cụ thể.
  const handleAddActivity = (dayIndex) => {
    const selectedDate = dateArray[dayIndex]; // Lấy ngày từ dateArray theo dayIndex
    setSelectedDay(selectedDate); // Cập nhật ngày đã chọn (có thể là ngày tháng năm)
    console.log("Opening modal for day:", selectedDate); // Kiểm tra ngày chọn
    setIsModalOpen(true); // Mở modal
  };

  const handleEditItinerary = () => {
    setIsItineraryEditing(true);
    setItinerary(itineraryId);
  };
  // Lưu hoạt động mới được thêm vào danh sách các hoạt động cho ngày cụ thể.
  const handleSaveActivity = (newActivity) => {
    setActivitiesState((prev) => {
      const updatedActivities = [...prev];
      if (!updatedActivities[currentDayIndex]) {
        updatedActivities[currentDayIndex] = [];
      }
      updatedActivities[currentDayIndex].push(newActivity);
      setTotalCost(calculateTotalCost(updatedActivities)); // Cập nhật tổng chi phí
      return updatedActivities;
    });
    setIsModalOpen(false);
  };

  // closeModal
  const closeModal = () => setIsModalOpen(false);
  // Mở modal để chỉnh sửa một hoạt động hiện có
  const handleEditActivity = (activity, dayIndex) => {
    setCurrentActivity(activity);
    setCurrentDayIndex(dayIndex);
    setIsEditing(true);
  };

  // Cập nhật hoạt động hiện tại với dữ liệu mới
  const handleUpdate = async (updatedData) => {
    try {
      const updatedActivity = await updateActivity(
        currentActivity._id,
        updatedData
      );
      setActivitiesState((prev) => {
        const updatedActivities = [...prev];
        const activityIndex = updatedActivities[currentDayIndex].findIndex(
          (act) => act._id === currentActivity._id
        );
        if (activityIndex !== -1) {
          updatedActivities[currentDayIndex][activityIndex] = updatedActivity; // Cập nhật hoạt động
          setTotalCost(calculateTotalCost(updatedActivities)); // Cập nhật tổng chi phí
        }
        return updatedActivities;
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating activity:", error);
    }
  };

  // Hàm mở modal khi chọn địa điểm
  const handleAddPlaceToActivity = (place) => {
    setSelectedPlace(place); // Lưu địa điểm đã chọn
    console.log(place);
    setIsModalOpen(true); // Mở modal
  };

  const handleConfirmShare = () => {
    // Thực hiện hành động chia sẻ dữ liệu ở đây (ví dụ gửi yêu cầu tới API)
    console.log("Dữ liệu đã được chia sẻ!");

    // Đóng modal
    setShowConfirmation(false);
  };

  const handleCancelShare = () => {
    // Hủy chia sẻ và đóng modal
    console.log("Chia sẻ bị hủy!");

    // Đóng modal
    setShowConfirmation(false);
  };

  const handleCapture = () => {
    html2canvas(itineraryRef.current).then((canvas) => {
      // Chuyển canvas thành hình ảnh
      const imgURL = canvas.toDataURL("image/png"); // Định dạng PNG
      // Tạo liên kết tải xuống tệp hình ảnh
      const link = document.createElement("a");
      link.href = imgURL;
      link.download = "itinerary.png"; // Tên tệp hình ảnh
      link.click();
    });
  };
  return (
    <div ref={itineraryRef} className="itinerary">
      <ProgressBar className="as" currentStep={currentStep} />
      {/* <Test/> */}
      <div>
 
  <div className="grid grid-cols-3 gap-4">
    {/* Sort days that have routes first */}
    {routes
      .sort((a, b) =>
        a.route && a.route.length > 0 && !(b.route && b.route.length > 0)
          ? -1
          : 1
      )
      .map((dayRoute, dayIndex) => (
        <div key={dayRoute.day} className="bg-white rounded-lg shadow-lg p-4">
          <h2 className="text-xl font-semibold text-blue-600 mb-4 text-center">
            Ngày {dayRoute.day}: {dateArray[dayIndex]}
          </h2>
          <div>
            {/* Display route details */}
            {dayRoute.route && dayRoute.route.length > 0 ? (
              dayRoute.route.map((route, index) => (
                <div
                  key={`route-${dayIndex}-${index}`}
                  className="route-item mb-4 p-4 bg-blue-50 rounded-lg border border-gray-200"
                >
                  {/* Display images and times for each place */}
                  <div className="flex items-center mb-2">
                    {route.fromImage && (
                      <div className="flex items-center mb-2">
                        <img
                          src={route.fromImage}
                          alt={route.from}
                          className="w-16 h-16 object-cover rounded-md mr-2"
                        />
                        <p className="text-sm font-medium text-blue-600">
                          Sáng: {route.from}
                        </p>
                      </div>
                    )}

                    {route.toImage && (
                      <div className="flex items-center mb-2">
                        <img
                          src={route.toImage}
                          alt={route.to}
                          className="w-16 h-16 object-cover rounded-md mr-2"
                        />
                        <p className="text-sm font-medium text-blue-600">
                          - Chiều: {route.to}
                        </p>
                      </div>
                    )}
                  </div>

                  <p className="text-sm text-gray-500">
                    {route.distance} km, {route.duration} phút
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">Chưa có lộ trình cho ngày này.</p>
            )}
          </div>
        </div>
      ))}
  </div>
</div>




      <div className="max-w-7xl mx-auto mt-24 flex">
      <aside className="w-1/5 p-6 bg-white rounded-xl shadow-lg sticky top-20 h-screen overflow-y-auto mb-5">
  {/* Header */}
  <h2 className="text-xl font-bold mb-6 flex items-center text-gray-800">
    <FontAwesomeIcon icon={faMapMarkedAlt} className="mr-3 text-blue-600 text-xl" />
    Tóm tắt hành trình
  </h2>

  {/* Days List */}
  <ul className="space-y-3 mb-6">
    {Array.from({ length: days }).map((_, index) => (
      <li
        key={index}
        onClick={() => handleScrollToDay(index)}
        className="cursor-pointer rounded-lg hover:bg-blue-50 transition-all duration-200 group"
      >
        <div className="flex items-center p-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 group-hover:bg-blue-200">
            <span className="text-sm font-semibold text-blue-600">
              {index + 1}
            </span>
          </div>
          <span className="ml-3 font-medium text-gray-700 group-hover:text-blue-600">
            Ngày {index + 1}
          </span>
          <FontAwesomeIcon 
            icon={faChevronRight} 
            className="ml-auto text-gray-400 group-hover:text-blue-600" 
          />
        </div>
      </li>
    ))}
  </ul>

  {/* Total Cost Card */}
  <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white shadow-md">
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-lg font-semibold flex items-center">
        <FontAwesomeIcon icon={faDollarSign} className="mr-2" />
        Tổng chi phí
      </h3>
      <FontAwesomeIcon icon={faCoins} className="text-yellow-300 text-xl" />
    </div>
    <p className="text-2xl font-bold mb-2">
      {new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(totalCost)}
    </p>
    <div className="text-sm text-blue-100 flex items-center">
      <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
      Chi phí dự kiến cho toàn bộ hành trình
    </div>
  </div>

  {/* Quick Actions */}
  <div className="mt-6 space-y-3">
    <button className="w-full p-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all duration-200 flex items-center justify-center text-gray-700 font-medium">
      <FontAwesomeIcon icon={faDownload} className="mr-2" />
      Tải xuống PDF
    </button>
    <button className="w-full p-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all duration-200 flex items-center justify-center text-gray-700 font-medium">
      <FontAwesomeIcon icon={faShare} className="mr-2" />
      Chia sẻ
    </button>
  </div>

  {/* Custom Scrollbar */}
  <style jsx>{`
    aside::-webkit-scrollbar {
      width: 6px;
    }
    aside::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 3px;
    }
    aside::-webkit-scrollbar-thumb {
      background: #cbd5e0;
      border-radius: 3px;
    }
    aside::-webkit-scrollbar-thumb:hover {
      background: #a0aec0;
    }
  `}</style>
</aside>

<div className="relative w-3/4 space-y-8">
  {/* Header Banner */}
  <div className="relative w-full h-96">
    <img
      src={bgItinerary}
      alt="Background"
      className="w-full h-80 object-cover rounded-xl shadow-lg"
    />
   <div className="absolute bottom-0 left-1/2 w-2/3 bg-white bg-opacity-95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl transform -translate-x-1/2 border border-gray-200">
  {/* Title Section */}
  <div className="flex items-center justify-between mb-6">
    <h1 className="text-3xl font-bold text-gray-800 flex items-center">
      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
        <FontAwesomeIcon icon={faMapMarkerAlt} className="text-blue-600 text-xl" />
      </div>
      <span className="relative">
        {itinerary.NAME || "Chưa có tên"}
        <div className="absolute -bottom-2 left-0 w-full h-1 bg-blue-600 rounded-full opacity-20"></div>
      </span>
    </h1>
    <div className="flex items-center space-x-2">
      <button
        onClick={handleEditItinerary}
        className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md flex items-center transition-all duration-200 group"
      >
        <FontAwesomeIcon 
          icon={faEdit} 
          className="mr-2 transform group-hover:scale-110 transition-transform duration-200" 
        />
        Chỉnh sửa
      </button>
    </div>
  </div>

  {/* Info Grid */}
  <div className="grid grid-cols-2 gap-6">
    {/* Days Count */}
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
      <div className="flex items-center">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
          <FontAwesomeIcon icon={faCalendarAlt} className="text-blue-600" />
        </div>
        <div>
          <p className="text-sm text-gray-500 font-medium">Số ngày</p>
          <p className="text-lg font-semibold text-gray-800">
            {days || "Không có thông tin"}
          </p>
        </div>
      </div>
    </div>

    {/* Date Range */}
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
      <div className="flex items-center">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
          <FontAwesomeIcon icon={faClock} className="text-blue-600" />
        </div>
        <div>
          <p className="text-sm text-gray-500 font-medium">Thời gian</p>
          <p className="text-lg font-semibold text-gray-800">
            {startDate ? (
              <>
                {new Date(startDate).toLocaleDateString('vi-VN', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                })}
                {" - "}
                {new Date(endDate).toLocaleDateString('vi-VN', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                })}
              </>
            ) : (
              "Chưa xác định"
            )}
          </p>
        </div>
      </div>
    </div>
  </div>

  {/* Additional Info or Stats (Optional) */}
  <div className="mt-6 pt-6 border-t border-gray-200">
    <div className="flex items-center justify-between text-sm text-gray-500">
      <div className="flex items-center">
        <FontAwesomeIcon icon={faMapMarkedAlt} className="mr-2 text-blue-500" />
        <span>{itinerary.PLACES || 0} địa điểm</span>
      </div>
      <div className="flex items-center">
        <FontAwesomeIcon icon={faDollarSign} className="mr-2 text-green-500" />
        <span>Dự kiến: {new Intl.NumberFormat('vi-VN').format(totalCost)} VND</span>
      </div>
    </div>
  </div>
</div>
  </div>

  {/* Places Selection */}
  <div className="bg-white rounded-xl shadow-lg p-6">
    <h3 className="text-xl font-bold mb-6 flex items-center text-gray-800">
      <FontAwesomeIcon icon={faMapMarkedAlt} className="mr-3 text-blue-600" />
      Chọn địa điểm
    </h3>
    
    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {places.length > 0 ? (
        places.map((place, index) => (
          <li
            key={place._id || index}
            onClick={() => handleAddPlaceToActivity(place)}
            className="cursor-pointer group rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
          >
            <div className="relative">
              <img
                src={place.IMAGES.NORMAL[0]}
                alt={place.NAME}
                className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            
            <div className="p-4 bg-white">
              <h4 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                {place.NAME}
              </h4>
              {place.DESCRIPTION && (
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                  {place.DESCRIPTION}
                </p>
              )}
            </div>
          </li>
        ))
      ) : (
        <li className="col-span-full text-center py-8 text-gray-500">
          Không có địa điểm nào.
        </li>
      )}
    </ul>
  </div>

  {/* Booking Suggestions */}
  <div className="grid grid-cols-2 gap-6">
    {/* Flight Booking */}
    {invoices.length > 0 ? (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center text-gray-800">
          <FontAwesomeIcon icon={faPlane} className="mr-3 text-blue-600" />
          Danh sách hóa đơn
        </h2>
        <ul className="space-y-4">
          {invoices.map((invoice, index) => (
            <li key={index} className="p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <p className="flex items-center text-gray-700">
                  <FontAwesomeIcon icon={faUser} className="mr-2 text-blue-500" />
                  {invoice.FIRST_NAME} {invoice.MIDDLE_NAME}
                </p>
                <p className="flex items-center text-gray-700">
                  <FontAwesomeIcon icon={faPlaneDeparture} className="mr-2 text-blue-500" />
                  {invoice.AIRLINECODE}
                </p>
                <p className="flex items-center text-gray-700">
                  <FontAwesomeIcon icon={faClock} className="mr-2 text-blue-500" />
                  Đến: {invoice.ARRIVALTIME}
                </p>
                <p className="flex items-center text-gray-700">
                  <FontAwesomeIcon icon={faClock} className="mr-2 text-blue-500" />
                  Đi: {invoice.DEPARTURETIME}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    ) : (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <FontAwesomeIcon icon={faPlane} className="mr-3 text-blue-600" />
            Đặt vé máy bay
          </h3>
        </div>
        <p className="text-gray-600 mb-4">
          Đặt vé máy bay ngay để có chuyến đi thuận tiện nhất!
        </p>
        <button className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition-colors duration-200 flex items-center justify-center">
          <FontAwesomeIcon icon={faTicketAlt} className="mr-2" />
          Đặt vé ngay
        </button>
      </div>
    )}

    {/* Hotel Booking */}
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800 flex items-center">
          <FontAwesomeIcon icon={faHotel} className="mr-3 text-blue-600" />
          Đặt phòng khách sạn
        </h3>
      </div>
      <p className="text-gray-600 mb-4">
        Đặt phòng khách sạn để có nơi nghỉ ngơi thoải mái!
      </p>
      <button className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition-colors duration-200 flex items-center justify-center">
        <FontAwesomeIcon icon={faKey} className="mr-2" />
        Đặt phòng ngay
      </button>
    </div>
  </div>

  {/* Activities Timeline */}
  {Array.from({ length: days }).map((_, dayIndex) => (
    <div
      key={dayIndex}
      ref={(el) => (dayRefs.current[dayIndex] = el)}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <h2 className="text-2xl font-bold mb-6 flex items-center text-gray-800">
        <FontAwesomeIcon icon={faCalendarDay} className="mr-3 text-blue-600" />
        Ngày {dayIndex + 1}: {dateArray[dayIndex]}
      </h2>

      <div className="space-y-6">
        {activitiesState[dayIndex] && activitiesState[dayIndex].length > 0 ? (
          activitiesState[dayIndex].map((activity, idx) => (
            <div
              key={activity._id || idx}
              className="bg-gray-50 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-start space-x-6">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <FontAwesomeIcon icon={faClock} className="text-blue-600" />
                    </div>
                    <div className="mt-2 text-sm font-medium text-gray-600">
                      {new Date(activity.STARTTIME).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>

                  <div className="flex-1">
                    <h4 className="text-xl font-semibold text-gray-800 mb-2">
                      {activity.NAME}
                    </h4>
                    <p className="flex items-center text-gray-600 mb-2">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                      {activity.LOCATION}
                    </p>
                    <p className="flex items-center text-gray-600">
                      <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
                      {activity.DESCRIPTION}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <div className="text-lg font-bold text-blue-600">
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND'
                    }).format(activity.COST)}
                  </div>
                  <button
                    onClick={() => handleEditActivity(activity._id)}
                    className="mt-4 py-2 px-4 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg shadow-md transition-colors duration-200 flex items-center"
                  >
                    <FontAwesomeIcon icon={faEdit} className="mr-2" />
                    Chỉnh sửa
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-4">
            Chưa có hoạt động nào cho ngày này
          </p>
        )}

        <button
          onClick={() => handleAddActivity(dayIndex)}
          className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md transition-colors duration-200 flex items-center justify-center"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Thêm hoạt động
        </button>
      </div>
    </div>
  ))}

  {/* Action Buttons */}
  <div className="flex justify-end space-x-4">
    <button
      onClick={handleCapture}
      className="py-3 px-6 bg-gray-600 hover:bg-gray-700 text-white rounded-lg shadow-md transition-colors duration-200 flex items-center"
    >
      <FontAwesomeIcon icon={faCamera} className="mr-2" />
      Lưu ảnh
    </button>
    <button
      type="submit"
      onClick={handleSaveAndShare}
      className="py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition-colors duration-200 flex items-center"
    >
      <FontAwesomeIcon icon={faSave} className="mr-2" />
      Lưu
    </button>
  </div>
</div>

        {isItineraryEditing && (
          <UpdateItineraryModal
            isOpen={isItineraryEditing}
            onClose={() => setIsItineraryEditing(false)}
            itinerary={itinerary} // Truyền thông tin hành trình vào modal
            itineraryId={itineraryId} // Truyền ID vào modal
          />
        )}

        {isModalOpen && (
          <ActivityModal
            onClose={closeModal}
            onSave={handleSaveActivity}
            dayIndex={currentDayIndex} // Đảm bảo dayIndex được truyền
            selectedDate={selectedDay} // Truyền selectedDate vào modal
            place={selectedPlace} // Truyền địa điểm đã chọn, không phải danh sách places
          />
        )}

        {isEditing && (
          <UpdateActivity
            isOpen={isEditing}
            onClose={() => setIsEditing(false)}
            onUpdate={handleUpdate}
            activity={currentActivity}
            dayIndex={currentDayIndex}
          />
        )}
        {showConfirmation && (
          <div className="modal">
            <div className="modal-content">
              <p>Bạn có muốn chia sẻ lịch trình này không?</p>
              <button className="btn btn-primary" onClick={handleConfirmShare}>
                Có, chia sẻ
              </button>
              <button className="btn btn-secondary" onClick={handleCancelShare}>
                Không, hủy
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailPage;
