import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getAttractionByName } from "../../api/callApi";
import ImageModal from "./modal/ImageModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";

const AttractionList = () => {
  const { provinceName } = useParams();
  const [province, setProvince] = useState({});
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalImage, setModalImage] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [isPanoramaOpen, setIsPanoramaOpen] = useState(false);
  const [panoramaImage, setPanoramaImage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAttractionByName(provinceName);
        console.log(response)
        if (response.data && response.data.length > 0) {
          setProvince(response.data[0]);
        } 
        else {
          console.error("Không tìm thấy dữ liệu.");
        }
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      }
    };

    fetchData();
  }, [provinceName]);

  const openModal = (image, title) => {
    setModalImage(image);
    setModalTitle(title);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setModalImage("");
    setModalTitle("");
  };

  const openPanorama = (image) => {
    setPanoramaImage(image);
    setIsPanoramaOpen(true);
  };

  const closePanorama = () => {
    setIsPanoramaOpen(false);
    setPanoramaImage("");
  };

  if (!province || Object.keys(province).length === 0) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <h1 className="text-4xl font-bold mb-4">{province.NAME || "Tên tỉnh"}</h1>
      <img
        src={province.BACKGROUND || "default-background.jpg"}
        alt={`${province.NAME} background`}
        className="w-full h-100 object-cover mb-8"
      />

      <div className=" mx-20 p-2">
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Mô Tả</h2>
          <p className="text-gray-700">{province.DESCRIPTION || "Chưa có mô tả."}</p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Bãi Biển</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {province.BEACHES && province.BEACHES.length > 0 ? (
              province.BEACHES.map((beach, index) => (
                <div key={index} className="relative">
                  <Link to={`/attraction/${province.NAME}/BEACHES/${beach.NAME}`}>
                    <img
                      src={beach.IMAGES?.NORMAL?.[0] || "default-beach.jpg"}
                      alt={beach.NAME}
                      className="w-full h-48 object-cover cursor-pointer"
                      onClick={() =>
                        openModal(beach.IMAGES?.NORMAL?.[0] || "default-beach.jpg", beach.NAME)
                      }
                    />
                  </Link>
                  <div
                    className="absolute bottom-4 right-4 bg-white p-2 rounded-full cursor-pointer"
                    onClick={() => openPanorama(beach.IMAGES?.PANORAMA?.[0] || "default-panorama.jpg")}
                  >
                    <FontAwesomeIcon icon={faEye} className="text-gray-700" />
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-semibold">
                      <Link to={`/attraction/${province.NAME}/BEACHES/${beach.NAME}`} className="hover:underline">
                        {beach.NAME}
                      </Link>
                    </h3>
                    <p className="mt-2 text-gray-600">
                      Bãi biển này thuộc {province.NAME}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600">Chưa có bãi biển nào.</p>
            )}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Quán Cà Phê</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {province.CAFES && province.CAFES.length > 0 ? (
              province.CAFES.map((cafe, index) => (
                <div key={index} className="relative">
                  <Link to={`/attraction/${province.NAME}/CAFÉ/${cafe.NAME}`}>
                    <img
                      src={cafe.IMAGES?.NORMAL?.[0] || "default-cafe.jpg"}
                      alt={cafe.NAME}
                      className="w-full h-48 object-cover cursor-pointer"
                      onClick={() =>
                        openModal(cafe.IMAGES?.NORMAL?.[0] || "default-cafe.jpg", cafe.NAME)
                      }
                    />
                  </Link>
                  <div
                    className="absolute bottom-4 right-4 bg-white p-2 rounded-full cursor-pointer"
                    onClick={() => openPanorama(cafe.IMAGES?.PANORAMA?.[0] || "default-panorama.jpg")}
                  >
                    <FontAwesomeIcon icon={faEye} className="text-gray-700" />
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-semibold">
                      <Link to={`/attraction/${province.NAME}/CAFÉ/${cafe.NAME}`} className="hover:underline">
                        {cafe.NAME}
                      </Link>
                    </h3>
                    <p className="mt-2 text-gray-600">
                      Quán cà phê này thuộc {province.NAME}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600">Chưa có quán cà phê nào.</p>
            )}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Danh Sách Điểm Tham Quan</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {province.ATTRACTIONS && province.ATTRACTIONS.length > 0 ? (
              province.ATTRACTIONS.map((attraction, index) => (
                <div key={index} className="relative">
                  <Link to={`/attraction/${province.NAME}/ATTRACTION/${attraction.NAME}`}>
                    <img
                      src={attraction.IMAGES?.NORMAL?.[0] || "default-attraction.jpg"}
                      alt={attraction.NAME}
                      className="w-full h-48 object-cover cursor-pointer"
                      onClick={() =>
                        openModal(attraction.IMAGES?.NORMAL?.[0] || "default-attraction.jpg", attraction.NAME)
                      }
                    />
                  </Link>
                  <div
                    className="absolute bottom-4 right-4 bg-white p-2 rounded-full cursor-pointer"
                    onClick={() => openPanorama(attraction.IMAGES?.PANORAMA?.[0] || "default-panorama.jpg")}
                  >
                    <FontAwesomeIcon icon={faEye} className="text-gray-700" />
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-semibold">
                      <Link to={`/attraction/${province.NAME}/ATTRACTION/${attraction.NAME}`} className="hover:underline">
                        {attraction.NAME}
                      </Link>
                    </h3>
                    <p className="mt-2 text-gray-600">
                      Điểm tham quan này thuộc {province.NAME}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600">Chưa có điểm tham quan nào.</p>
            )}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Di Tích Văn Hóa</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {province.CULTURAL && province.CULTURAL.length > 0 ? (
              province.CULTURAL.map((cultural, index) => (
                <div key={index} className="relative">
                  <Link to={`/attraction/${province.NAME}/CULTURAL/${cultural.NAME}`}>
                    <img
                      src={cultural.IMAGES?.NORMAL?.[0] || "default-cultural.jpg"}
                      alt={cultural.NAME}
                      className="w-full h-48 object-cover cursor-pointer"
                      onClick={() =>
                        openModal(cultural.IMAGES?.NORMAL?.[0] || "default-cultural.jpg", cultural.NAME)
                      }
                    />
                  </Link>
                  <div
                    className="absolute bottom-4 right-4 bg-white p-2 rounded-full cursor-pointer"
                    onClick={() => openPanorama(cultural.IMAGES?.PANORAMA?.[0] || "default-panorama.jpg")}
                  >
                    <FontAwesomeIcon icon={faEye} className="text-gray-700" />
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-semibold">
                      <Link to={`/attraction/${province.NAME}/CULTURAL/${cultural.NAME}`} className="hover:underline">
                        {cultural.NAME}
                      </Link>
                    </h3>
                    <p className="mt-2 text-gray-600">
                      Di tích văn hóa này thuộc {province.NAME}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600">Chưa có di tích văn hóa nào.</p>
            )}
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
        <section className="mb-12">
  <h2 className="text-3xl font-bold mb-4">Lễ Hội</h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
    {province.FESTIVAL && province.FESTIVAL.length > 0 ? (
      province.FESTIVAL.map((festival, index) => (
        <div key={index} className="relative">
          <Link to={`/attraction/${province.NAME}/FESTIVAL/${festival.NAME}`}>
            <img
              src={festival.IMAGES?.NORMAL?.[0] || "default-festival.jpg"}
              alt={festival.NAME}
              className="w-full h-48 object-cover cursor-pointer"
              onClick={() =>
                openModal(festival.IMAGES?.NORMAL?.[0] || "default-festival.jpg", festival.NAME)
              }
            />
          </Link>
          <div
            className="absolute bottom-4 right-4 bg-white p-2 rounded-full cursor-pointer"
            onClick={() => openPanorama(festival.IMAGES?.PANORAMA?.[0] || "default-panorama.jpg")}
          >
            <FontAwesomeIcon icon={faEye} className="text-gray-700" />
          </div>
          <div className="p-4">
            <h3 className="text-xl font-semibold">
              <Link to={`/attraction/${province.NAME}/FESTIVAL/${festival.NAME}`} className="hover:underline">
                {festival.NAME}
              </Link>
            </h3>
            <p className="mt-2 text-gray-600">
              Lễ hội này thuộc {province.NAME}
            </p>
            <p className="mt-2 text-gray-600">
              {festival.DATE ? `Ngày diễn ra: ${new Date(festival.DATE).toLocaleDateString()}` : 'Chưa có ngày diễn ra'}
            </p>
          </div>
        </div>
      ))
    ) : (
      <p className="text-gray-600">Chưa có lễ hội nào.</p>
    )}
  </div>
</section>

      </div>
      </div>

      {modalIsOpen && (
        <ImageModal isOpen={modalIsOpen} onClose={closeModal} image={modalImage} title={modalTitle} />
      )}

      {isPanoramaOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div>toàn cảnh</div>
          <button
            
            className="absolute top-4 right-4 text-white text-2xl"
            onClick={closePanorama}
          >
            &times;
          </button>
          <img src={panoramaImage} alt="Panorama" className="max-w-full max-h-full" />
        </div>
      )}
    </>
  );
};

export default AttractionList;
