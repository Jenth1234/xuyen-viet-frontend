import React, { useState, useEffect, useRef } from "react";
import { useLocation, useParams } from "react-router-dom";
import ActivityModal from "./modal/ActivityModal";
import UpdateActivity from "./modal/UpdateActivityModal";
import UpdateItineraryModal from "./modal/UpdateItineraryModal"; // update
import { getItinerary, updateActivity,createActivity,createBulkActivities } from "../../api/callApi";
import { getPlaceById } from "../../api/ApiPlace";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Test from "./test";

import {
  faRoute,
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
import MapAside from './MapAside';
import { toast } from 'react-toastify'; 
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
  const [pendingChanges, setPendingChanges] = useState({
    newActivities: [], // Các hoạt động mới chưa lưu
    updatedActivities: [], // Các hoạt động đã chỉnh sửa
    deletedActivities: [] // Các hoạt động đã xóa
  });
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
  const [isMapOpen, setIsMapOpen] = useState(false);
const [processedPlaces, setProcessedPlaces] = useState([]);

  
  const [error, setError] = useState(null);
const [isApplyingRoute, setIsApplyingRoute] = useState(false);

  
// 1. Effect cho việc fetch dữ liệu chính
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
        const dayCount = Math.ceil((endDateObj - startDateObj) / (1000 * 60 * 60 * 24)) + 1;

        // Khởi tạo dateArray
        const dates = Array.from({ length: dayCount }, (_, index) => {
          const currentDate = new Date(startDateObj);
          currentDate.setDate(currentDate.getDate() + index);
          return currentDate.toISOString().split("T")[0];
        });
        setDateArray(dates);

        // Khởi tạo activitiesState với mảng rỗng cho mỗi ngày
        const initialActivitiesState = Array(dayCount).fill().map(() => []);

        // Phân loại hoạt động vào ngày tương ứng
        activitiesData.forEach((activity) => {
          const activityDate = new Date(activity.STARTTIME);
          const dayIndex = Math.floor((activityDate - startDateObj) / (1000 * 60 * 60 * 24));
          if (dayIndex >= 0 && dayIndex < dayCount) {
            initialActivitiesState[dayIndex].push(activity);
          }
        });

        setActivitiesState(initialActivitiesState);
        setDays(dayCount);
        setTotalCost(calculateTotalCost(initialActivitiesState));
      }
    } catch (error) {
      console.error("API call error:", error);
      toast.error("Có lỗi xảy ra khi tải dữ liệu!");
    }
  };

  if (itineraryId) {
    fetchData();
  }
}, [itineraryId]);
  // 2. Effect cho việc fetch places
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        setLoading(true);
        console.log('Selected Places received:', selectedPlaces);
  
        if (!selectedPlaces || !Array.isArray(selectedPlaces)) {
          console.log('No places to fetch or invalid data');
          setPlaces([]);
          return;
        }
  
        const placeIds = selectedPlaces
          .filter(place => place && (place.id || place._id))
          .map(place => place.id || place._id);
  
        console.log('Place IDs to fetch:', placeIds);
  
        const placesData = await Promise.all(
          placeIds.map(async (id) => {
            try {
              const response = await getPlaceById(id);
          
              const placeData = response.data;
              console.log('Place data received:', placeData);
              return placeData;
            } catch (error) {
              console.error(`Error fetching place with ID ${id}:`, error);
              return null;
            }
          })
        );
  
        // Transform và validate data
        const validPlaces = placesData
          .filter(place => place !== null)
          .map(place => ({
            _id: place._id,
            NAME: place.NAME || 'Unnamed Place',
            ADDRESS: place.ADDRESS || 'No Address',
            DESCRIPTION: place.DESCRIPTIONPLACE || '',
            CATEGORY: place.CATEGORY || 'Unknown',
            IMAGES: {
              NORMAL: place.IMAGES?.NORMAL || [],
              PANORAMA: place.IMAGES?.PANORAMA || []
            }
          }));
  
        console.log('Processed places:', validPlaces);
        setPlaces(validPlaces);
  
      } catch (error) {
        console.error("Error in fetchPlaces:", error);
        toast.error("Có lỗi khi tải dữ liệu địa điểm");
      } finally {
        setLoading(false);
      }
    };
  
    if (selectedPlaces && selectedPlaces.length > 0) {
      fetchPlaces();
    }
  }, [selectedPlaces]);
  
  // Render places
  function renderPlaces() {
    const placesList = document.createElement('ul');
    placesList.className = 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6';
  
    if (places.length === 0) {
      const emptyMessage = document.createElement('li');
      emptyMessage.className = 'col-span-full text-center py-8 text-gray-500';
      emptyMessage.textContent = 'Không có địa điểm nào.';
      placesList.appendChild(emptyMessage);
      return placesList;
    }
  
    places.forEach((place, index) => {
      const placeItem = document.createElement('li');
      placeItem.className = 'cursor-pointer group rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300';
      placeItem.onclick = () => handleAddPlaceToActivity(place);
  
      // Image container
      const imageContainer = document.createElement('div');
      imageContainer.className = 'relative';
  
      const image = document.createElement('img');
      image.src = place.IMAGES?.NORMAL?.[0] || 'https://via.placeholder.com/300x200';
      image.alt = place.NAME;
      image.className = 'w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500';
      image.onerror = (e) => {
        e.target.src = 'https://via.placeholder.com/300x200';
      };
  
      // Content container
      const contentContainer = document.createElement('div');
      contentContainer.className = 'p-4 bg-white';
  
      const title = document.createElement('h4');
      title.className = 'text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors';
      title.textContent = place.NAME;
  
      const description = document.createElement('p');
      description.className = 'text-sm text-gray-600 mt-2 line-clamp-2';
      description.textContent = place.DESCRIPTION || '';
  
      // Append elements
      imageContainer.appendChild(image);
      contentContainer.appendChild(title);
      if (place.DESCRIPTION) {
        contentContainer.appendChild(description);
      }
  
      placeItem.appendChild(imageContainer);
      placeItem.appendChild(contentContainer);
      placesList.appendChild(placeItem);
    });
  
    return placesList;
  }
  
  // Update DOM
  const container = document.querySelector('#places-container');
  if (container) {
    container.innerHTML = ''; // Clear existing content
    if (loading) {
      const loadingDiv = document.createElement('div');
      loadingDiv.className = 'text-center py-8';
      loadingDiv.textContent = 'Đang tải dữ liệu...';
      container.appendChild(loadingDiv);
    } else {
      container.appendChild(renderPlaces());
    }
  }
  
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
  }, []); 
  // 4. Effect cho scroll khi từ notification
  useEffect(() => {
    if (fromNotification && itineraryRef.current) {
      itineraryRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [fromNotification]);

  // Hàm tính toán lộ trình giữa các địa điểm

  console.log("du lieu",places);
  const [startingPlaces, setStartingPlaces] = useState(Array(days).fill(null)); // Trạng thái cho địa điểm xuất phát mỗi ngày

  // Hàm xử lý khi người dùng chọn địa điểm xuất phát
  const handleSelectStartingPlace = (dayIndex, place) => {
    const updatedStartingPlaces = [...startingPlaces];
    updatedStartingPlaces[dayIndex] = place; // Cập nhật địa điểm xuất phát cho ngày tương ứng
    setStartingPlaces(updatedStartingPlaces);
  };

  // Cập nhật hàm getRouteForDay để sử dụng địa điểm xuất phát
  const getRouteForDay = async (places) => {
    console.log("Starting getRouteForDay with places:", places);
    
    // Kiểm tra nếu places không phải array hoặc rỗng
    if (!Array.isArray(places) || places.length === 0) {
      console.log("Places is not an array or empty");
      return [];
    }
  
    // Lọc và validate places
    const validPlaces = places.filter(place => {
      const isValid = place && 
                      place.NAME && 
                      place.ADDRESS 
               
      
      if (!isValid) {
        console.log("Invalid place:", place);
        console.log("Missing fields:", {
          name: !place?.NAME,
          address: !place?.ADDRESS,
        
        });
      }
      
      return isValid;
    });
  
    console.log("Valid places after filtering:", validPlaces);
  
    if (validPlaces.length < 2) {
      console.log("Not enough valid places");
      return [];
    }
  
    // Hàm lấy coordinates với error handling
    const getCoordinatesForAddress = async (address) => {
      try {
        console.log("Getting coordinates for address:", address);
        const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}`;
        const geocodeResponse = await fetch(geocodeUrl);
        const geocodeData = await geocodeResponse.json();
  
        if (!geocodeData || !geocodeData.features || geocodeData.features.length === 0) {
          console.log("No coordinates found for address:", address);
          return null;
        }
  
        const coordinates = geocodeData.features[0].center.join(',');
        console.log("Found coordinates:", coordinates);
        return coordinates;
      } catch (error) {
        console.error("Error getting coordinates:", error);
        return null;
      }
    };
  
    try {
      const routeDetails = [];
      let dayIndex = 1;
  
      // Process pairs of places
      for (let i = 0; i < validPlaces.length - 1; i += 2) {
        const fromPlace = startingPlaces[dayIndex - 1] || validPlaces[i]; // Nếu không có địa điểm xuất phát, sử dụng địa điểm đầu tiên
        const toPlace = validPlaces[i + 1];
        
        console.log(`Processing pair ${i/2 + 1}:`, {
          from: fromPlace.NAME,
          to: toPlace.NAME
        });
  
        // Get coordinates
        const [fromCoords, toCoords] = await Promise.all([
          getCoordinatesForAddress(fromPlace.ADDRESS),
          getCoordinatesForAddress(toPlace.ADDRESS)
        ]);
  
        if (!fromCoords || !toCoords) {
          console.log("Missing coordinates for one or both places");
          continue;
        }
  
        // Get route from Mapbox
        const directionsUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${fromCoords};${toCoords}?access_token=${process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}&overview=full`;
        const response = await fetch(directionsUrl);
        const data = await response.json();
  
        if (!data.routes || data.routes.length === 0) {
          console.log("No route found between places");
          continue;
        }
  
        const route = data.routes[0];
        
        // Get images
        const fromImage = fromPlace.IMAGES?.NORMAL?.[0] || "https://via.placeholder.com/150";
        const toImage = toPlace.IMAGES?.NORMAL?.[0] || "https://via.placeholder.com/150";
  
        // Add route details
        routeDetails.push({
          day: dayIndex,
          date: new Date(startDate).toLocaleDateString('vi-VN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          route: [{
            from: fromPlace.NAME,
            to: toPlace.NAME,
            distance: (route.distance / 1000).toFixed(2),
            duration: (route.duration / 60).toFixed(0),
            fromImage,
            toImage
          }]
        });
  
        dayIndex++;
      }
  
      console.log("Final route details:", routeDetails);
      return routeDetails;
  
    } catch (error) {
      console.error("Error in getRouteForDay:", error);
      return [];
    }
  };
  
  // Sử dụng hàm
  useEffect(() => {
    const processRoutes = async () => {
      if (places && places.length > 0) {
        console.log("Processing routes for places:", places);
        const routes = await getRouteForDay(places);
        console.log("Generated routes:", routes);
        setRoutes(routes);
      }
    };
  
    processRoutes();
  }, [places, startDate]);

console.log(routes)
  // Hàm tính lịch trình hợp lý cho mỗi ngày
  const calculateOptimizedItinerary = async () => {
    setLoading(true);
    const allRoutes = [];
  
    if (!places || places.length === 0) {
      setRoutes([]);
      setLoading(false);
      return;
    }
  
    // Tính số ngày dựa trên số lượng địa điểm
    const numberOfDays = Math.ceil(places.length / 2);
  
    // Chia thành các cặp địa điểm cho mỗi ngày
    for (let i = 0; i < numberOfDays; i++) {
      const startIndex = i * 2;
      const dayPlaces = places.slice(startIndex, startIndex + 2);
      const currentDate = dateArray[i];
  
      if (dayPlaces.length > 0) {
        try {
          const routeDetails = await getRouteForDay(dayPlaces);
  
          allRoutes.push({
            day: i + 1, // Luôn bắt đầu từ 1
            date: currentDate,
            route: routeDetails,
            activities: activitiesState[i] || []
          });
  
        } catch (error) {
          console.error(`Error calculating route for day ${i + 1}:`, error);
          allRoutes.push({
            day: i + 1,
            date: currentDate,
            route: [],
            activities: activitiesState[i] || []
          });
        }
      }
    }
  
    // Thêm các ngày còn lại không có lộ trình
    dateArray.forEach((date, index) => {
      if (!allRoutes.some(route => route.date === date)) {
        allRoutes.push({
          day: index + 1, // Luôn bắt đầu từ 1
          date: date,
          route: [],
          activities: []
        });
      }
    });
  
    // Sắp xếp lại routes theo số thứ tự ngày
    const sortedRoutes = allRoutes.sort((a, b) => a.day - b.day);
  
    console.log("Final routes:", sortedRoutes);
    setRoutes(sortedRoutes);
    setLoading(false);
  };
  
  

// Hàm xử lý áp dụng lộ trình tự động
// Thêm hàm xử lý áp dụng lộ trình
const handleApplyRoute = async () => {
  try {
    setIsApplyingRoute(true);
    
    if (!places || places.length === 0) {
      toast.warning('Không có địa điểm nào để áp dụng');
      return;
    }

    // Tính toán số hoạt động mỗi ngày
    const placesPerDay = Math.ceil(places.length / days);
    
    // Tạo mảng hoạt động mới cho mỗi ngày
    const newActivities = Array.from({ length: days }, () => []);
    const pendingActivities = []; // Mảng lưu các hoạt động mới cần thêm vào pendingChanges
    
    // Phân bổ các địa điểm vào các ngày
    places.forEach((place, index) => {
      const dayIndex = Math.floor(index / placesPerDay);
      
      if (dayIndex < days) {
        const startTime = new Date(dateArray[dayIndex]);
        startTime.setHours(9 + (index % placesPerDay) * 2, 0, 0);

        // Tạo endTime (2 tiếng sau startTime)
        const endTime = new Date(startTime);
        endTime.setHours(endTime.getHours() + 2);

        const newActivity = {
          _id: `temp_${Date.now()}_${Math.random()}`, // Thêm ID tạm thời
          NAME: place.NAME,
          LOCATION: place.ADDRESS || place.LOCATION,
          DESCRIPTION: place.DESCRIPTION || '',
          STARTTIME: startTime.toISOString(),
          ENDTIME: endTime.toISOString(),
          COST: 0,
          DATE: dateArray[dayIndex],
          COORDINATES: place.URLADDRESS || place.coordinates,
          IMAGES: place.IMAGES || [],
          isTemp: true // Đánh dấu là hoạt động tạm thời
        };

        newActivities[dayIndex].push(newActivity);
        
        // Thêm vào mảng pendingActivities với dayIndex
        pendingActivities.push({
          ...newActivity,
          dayIndex
        });
      }
    });

    // Cập nhật activitiesState
    setActivitiesState(newActivities);
    
    // Cập nhật pendingChanges
    setPendingChanges(prev => ({
      ...prev,
      newActivities: [...prev.newActivities, ...pendingActivities]
    }));

    // Cập nhật tổng chi phí
    setTotalCost(calculateTotalCost(newActivities));
    
    console.log('New activities added:', pendingActivities);
    console.log('Updated pendingChanges:', {
      ...pendingChanges,
      newActivities: [...pendingChanges.newActivities, ...pendingActivities]
    });
    
    toast.success('Đã áp dụng lộ trình thành công! Nhớ bấm "Lưu" để lưu lại các thay đổi.');
  } catch (error) {
    console.error('Error applying route:', error);
    toast.error('Có lỗi khi áp dụng lộ trình');
  } finally {
    setIsApplyingRoute(false);
  }
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
  useEffect(() => {
    if (places && places.length > 0) {
      console.log('Available places for route:', places);
    }
  }, [places]);
  if (loading) {
    return <div>Đang gợi ý lộ trình tối ưu cho bạn...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }
  const handlePlaceClick = (place) => {
    setSelectedPlace(place);
    setIsMapOpen(true);
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
 // Thêm hàm handleAddActivity và handleSaveActivity
 const handleAddActivity = (dayIndex) => {
  console.log("Opening modal for day:", dayIndex);
  setCurrentDayIndex(dayIndex);
  setSelectedDay(dateArray[dayIndex]);
  setIsModalOpen(true);
};


  const handleEditItinerary = () => {
    setIsItineraryEditing(true);
    setItinerary(itineraryId);
  };
  // Lưu hoạt động mới được thêm vào danh sách các hoạt động cho ngày cụ thể.
  const handleSaveAndShare = async () => {
    console.log('=== Starting Save Process ===');
    console.log('Pending changes:', pendingChanges);
  
    try {
      toast.info('Đang lưu thay đổi...');
  
      // Lưu nhiều hoạt động cùng lúc
      if (pendingChanges.newActivities.length > 0) {
        // Chuẩn bị dữ liệu cho tất cả hoạt động
        const activitiesData = {
          itineraryId: itineraryId,
          activities: pendingChanges.newActivities.map(activity => ({
            LOCATION: activity.LOCATION,
            DESCRIPTION: activity.DESCRIPTION || '',
            STARTTIME: activity.STARTTIME,
            ENDTIME: activity.ENDTIME,
            COST: parseFloat(activity.COST) || 0,
            DATE: activity.DATE
          }))
        };
  
        console.log('Sending bulk activities data:', activitiesData);
  
        try {
          // Gọi API để lưu nhiều hoạt động cùng lúc
          const response = await createBulkActivities(activitiesData);
          console.log('Bulk activities created:', response);
        } catch (error) {
          console.error('Error creating bulk activities:', error);
          throw error;
        }
      }
  
      // Refresh dữ liệu từ server
      const updatedItinerary = await getItinerary(itineraryId);
      
      // Cập nhật state với dữ liệu mới
      if (updatedItinerary && updatedItinerary.ACTIVITIES) {
        const startDateObj = new Date(updatedItinerary.START_DATE);
        const initialActivitiesState = Array(days).fill().map(() => []);
        
        updatedItinerary.ACTIVITIES.forEach((activity) => {
          if (activity && activity.STARTTIME) {
            const activityDate = new Date(activity.STARTTIME);
            const dayIndex = Math.floor((activityDate - startDateObj) / (1000 * 60 * 60 * 24));
            if (dayIndex >= 0 && dayIndex < days) {
              initialActivitiesState[dayIndex].push(activity);
            }
          }
        });
        
        setActivitiesState(initialActivitiesState);
        setItinerary(updatedItinerary);
        setTotalCost(calculateTotalCost(initialActivitiesState));
      }
  
      // Reset pendingChanges
      setPendingChanges({
        newActivities: [],
        updatedActivities: [],
        deletedActivities: []
      });
  
      toast.success('Đã lưu tất cả thay đổi thành công!');
      console.log('=== Save Process Completed Successfully ===');
  
    } catch (error) {
      console.error('Error saving changes:', error);
      toast.error(`Có lỗi xảy ra khi lưu thay đổi: ${error.message}`);
    }
  };

  // closeModal
  const closeModal = () => setIsModalOpen(false);
  // Mở modal để chỉnh s���a một hoạt động hiện có
  const handleEditActivity = (activity, dayIndex) => {
    setCurrentActivity(activity);
    setCurrentDayIndex(dayIndex);
    setIsEditing(true);
  };

  // Cập nhật hoạt động hiện tại với dữ liệu mới
  const handleUpdate = async (updatedActivity) => {
    setActivitiesState(prevState => {
      const newState = [...prevState];
      const dayIndex = newState.findIndex(day => 
        day.some(act => act._id === updatedActivity._id)
      );
      
      if (dayIndex !== -1) {
        const activityIndex = newState[dayIndex].findIndex(
          act => act._id === updatedActivity._id
        );
        if (activityIndex !== -1) {
          newState[dayIndex][activityIndex] = updatedActivity;
        }
      }
      return newState;
    });

    // Thêm vào danh sách thay đổi chờ xử lý
    setPendingChanges(prev => [...prev, updatedActivity]);
  };
    // Thêm hàm mới để xử lý submit tất cả thay đổi
    const handleSubmitAllChanges = async () => {
      try {
        // Gọi API để cập nhật từng activity
        for (const updatedActivity of pendingChanges) {
          await updateActivity(updatedActivity._id, updatedActivity);
        }
        
        // Xóa danh sách thay đổi chờ xử lý
        setPendingChanges([]);
        
        // Hiển thị thông báo thành công
        toast.success('Đã lưu tất cả thay đổi thành công!');
      } catch (error) {
        console.error('Error submitting changes:', error);
        toast.error('Có lỗi xảy ra khi lưu thay đổi!');
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

  const handleSaveActivity = (dayIndex, newActivity) => {
    console.log("Saving activity for day:", dayIndex, newActivity);
  
    // Cập nhật activitiesState
    setActivitiesState(prevState => {
      const newState = [...prevState];
      if (!Array.isArray(newState[dayIndex])) {
        newState[dayIndex] = [];
      }
      newState[dayIndex] = [...newState[dayIndex], newActivity];
      return newState;
    });
  
    // Cập nhật pendingChanges
    setPendingChanges(prev => ({
      ...prev,
      newActivities: [...prev.newActivities, { ...newActivity, dayIndex }]
    }));
  
    // Cập nhật tổng chi phí
    setTotalCost(prevCost => {
      const newCost = parseInt(prevCost) + parseInt(newActivity.COST || 0);
      return newCost.toString();
    });
  
    setIsModalOpen(false);
    toast.success('Đã thêm hoạt động mới! Nhớ bấm "Lưu" để lưu lại các thay đổi.');
  };

  return (
    <div ref={itineraryRef} className="itinerary">
      <ProgressBar className="as" currentStep={currentStep} />
      {/* <Test/> */}
      {/* trình gợi ý */}





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
  <div id="places-container" className=" bg-white rounded-xl shadow-lg p-6">
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
            // Thêm kiểm tra điều kiện cho IMAGES và NORMAL
            src={place.IMAGES?.NORMAL?.[0] || 'https://via.placeholder.com/300x200'}
            alt={place.NAME || 'Place image'}
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        
        <div className="p-4 bg-white">
          <h4 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
            {place.NAME || 'Unnamed Place'}
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
 {/* Phần lộ trình gợi ý */}
 <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-bold text-gray-800 flex items-center">
        <FontAwesomeIcon icon={faRoute} className="mr-3 text-blue-600" />
        Lộ Trình Gợi Ý
      </h2>
      <button
        onClick={handleApplyRoute}
        disabled={isApplyingRoute || !routes.some(day => day.route?.length > 0)}
        className={`py-2 px-4 rounded-lg shadow-md transition-colors duration-200 flex items-center ${
          isApplyingRoute || !routes.some(day => day.route?.length > 0)
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        <FontAwesomeIcon icon={faPlus} className="mr-2" />
        {isApplyingRoute ? 'Đang áp dụng...' : 'Áp dụng lộ trình'}
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {routes.map((dayRoute) => (
        
        <div key={dayRoute.day} className="bg-white rounded-lg shadow-lg p-4">
          <h2 className="text-xl font-semibold text-blue-600 mb-4 text-center">
            {dayRoute.date}
          </h2>
          <div>
            {dayRoute.route && dayRoute.route.length > 0 ? (
              dayRoute.route.map((route, index) => (
                <div
                  key={`route-${index}`}
                  className="route-item mb-4 p-4 bg-blue-50 rounded-lg border border-gray-200"
                >
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
              <p className="text-gray-500 text-sm">
                Chưa có lộ trình cho ngày này.
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
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
      {/* Kiểm tra và hiển thị activities */}
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
                    {activity.isTemp && (
                      <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                        Chưa lưu
                      </span>
                    )}
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
                  onClick={() => handleEditActivity(activity, dayIndex)}
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
  onClick={handleSaveAndShare}
  className={`py-3 px-6 text-white rounded-lg shadow-md transition-colors duration-200 flex items-center ${
    pendingChanges.newActivities.length > 0 
      ? 'bg-blue-600 hover:bg-blue-700'
      : 'bg-gray-400 cursor-not-allowed'
  }`}
  disabled={pendingChanges.newActivities.length === 0}
>
  <FontAwesomeIcon icon={faSave} className="mr-2" />
  {pendingChanges.newActivities.length > 0 
    ? `Lưu thay đổi (${pendingChanges.newActivities.length})` 
    : 'Lưu thay đổi'}
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
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveActivity}
          dayIndex={currentDayIndex}
          activitiesState={activitiesState}
          place={selectedPlace}
          selectedDate={selectedDay}
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
