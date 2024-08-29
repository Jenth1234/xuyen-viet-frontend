import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const SphereViewer = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    // Thiết lập scene, camera, renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current?.appendChild(renderer.domElement);

    // Tạo hình cầu đơn giản
    const geometry = new THREE.SphereGeometry(5, 32, 32); // Kích thước hình cầu là 5

    // Base64 Texture
    const watermelonTexture = 'data:image/jpeg;base64,YOUR_BASE64_STRING_HERE';

    // Tải texture từ base64
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      watermelonTexture, // Sử dụng base64 thay vì đường dẫn
      (texture) => {
        const material = new THREE.MeshBasicMaterial({ map: texture });
        const sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere);

        // Đặt camera
        camera.position.z = 10;

        // Thêm OrbitControls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableZoom = true;
        controls.enablePan = true;
        controls.autoRotate = false;

        // Hàm render
        const animate = () => {
          requestAnimationFrame(animate);
          controls.update();
          renderer.render(scene, camera);
        };
        animate();
      },
      undefined,
      (error) => {
        console.error('Error loading texture:', error);
      }
    );

    // Xử lý resize cửa sổ
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Dọn dẹp khi component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="w-full h-full">
      <div ref={containerRef} className="w-full h-full"></div>
    </div>
  );
};

export default SphereViewer;
