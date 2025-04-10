// ImageUpload.jsx
import React, { useState } from 'react';
import './AddProduct.css';

const ImageUpload = () => {
    const [image, setImage] = useState(null);
    const [base64, setBase64] = useState('');

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setBase64(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageUpload = () => {
        console.log('Base64 string:', base64);
        // You can send the base64 string to your server or save it locally
    };

    return (
        <div>
            <h2>Image Upload and Base64 Conversion</h2>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {base64 && (
                <div>
                    <h3>Base64 Image:</h3>
                    <img src={base64} alt="Uploaded" style={{ width: '200px' }} />
                    <textarea
                        value={base64}
                        readOnly
                        rows="5"
                        cols="50"
                        style={{ marginTop: '10px' }}
                    />
                </div>
            )}
            <button onClick={handleImageUpload}>Upload Image</button>
        </div>
    );
};

export default ImageUpload;