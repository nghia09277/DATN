import { Zoom } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';


const slideImages = [
    { url: '/images/hinh2.jpg', caption: 'Phong cách hiện đại' },
    { url: '/images/hinh3.jpg', caption: 'Những bộ sofa sang trọng cho phòng khách' },
    { url: '/images/hinh4.jpg', caption: 'Những bộ bàn ăn đẹp mắt cho bữa tối' },
];

const Slideshow = () => {
    return (
        <div className="slide-container">
            <Zoom scale={0.4}>
                {slideImages.map((slideImage, index) => (
                    <div key={index} className="slide" style={{ backgroundImage: `url(${slideImage.url})` }}>
                        <div className="overlay"></div>
                        <span className="text-overlay">{slideImage.caption}</span>
                    </div>
                ))}
            </Zoom>
        </div>
    );
};

export default Slideshow;
