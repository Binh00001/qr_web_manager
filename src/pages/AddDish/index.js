import { Fragment, useState } from "react";
import classNames from "classnames";
import styles from "./AddDish.scss";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const cx = classNames.bind(styles);

function AddDish() {
    const navigate = useNavigate();
    const [state, setState] = useState({
        name: '',
        description: '',
        category: '',
        price: '',
        image_detail: null,
    });

    const changeHandler = (e) => {
        if (e.target.name === 'image_detail') {
            const file = e.target.files[0];
            if (file && isImageFile(file)) {
                setState({ ...state, [e.target.name]: file });
            } else {
                alert('Vui lòng chọn một tệp ảnh có định dạng hợp lệ.');
            }
        } else {
            setState({ ...state, [e.target.name]: e.target.value });
        }
    };

    const isImageFile = (file) => {
        const acceptedFormats = ['image/png', 'image/jpeg', 'image/jpg'];
        return acceptedFormats.includes(file.type);
    };

    const submitHandler = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', state.name);
        formData.append('description', state.description);
        formData.append('image_detail', state.image_detail);
        formData.append('category', state.category);
        formData.append('price', state.price);

        axios
            .post("http://117.4.194.207:3003/dish/create", formData)
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const { description, name, category, price } = state;

    function handleFileInputChange(event) {
        const fileInput = event.target;
        const fileLabel = document.getElementById('file-label');

        if (fileInput.files && fileInput.files.length > 0) {
            fileLabel.innerText = fileInput.files[0].name;
        } else {
            fileLabel.innerText = 'Choose File';
        }
    }

    return (
        <Fragment>
            <div className={cx("Wrapper")}>
                <div className={cx("blackBar")}>
                    <div className={cx("TopBar")}>
                        <div className={cx("mTopBar")}>
                            <div className={cx("mText")} onClick={() => navigate('/menu')} > Quản Lý Thực Đơn</div>
                            <div className={cx("mText")}>Các Món Đã Ẩn</div>
                            <div className={cx("mText active")}>Thêm Món Ăn</div>
                        </div>
                    </div>
                </div>

                <div className={cx("aBody")}>
                    <div className="margintopbody"></div>
                    <div className={cx("aItem")}>
                        <div className="aName">
                            <label htmlFor="name">Tên Món Ăn:</label>
                            <input
                                onChange={changeHandler}
                                required
                                name="name"
                                id="name"
                                type="text"
                                value={name}
                                placeholder="Tên món ăn ...."
                            />
                        </div>
                    </div>
                    <div className={cx("aItem")}>
                        <div className="aDescription">
                            <label htmlFor="description">Mô Tả:</label>
                            <textarea
                                onChange={changeHandler}
                                name="description"
                                id="description"
                                value={description}
                                placeholder="Mô tả món ăn ...."
                            />
                        </div>
                    </div>
                    <div className={cx("aItem")}>
                        <div className="aType">
                            <label htmlFor="category">Danh mục:</label>
                            <input
                                onChange={changeHandler}
                                required
                                name="category"
                                id="category"
                                type="text"
                                value={category}
                                placeholder="Thể loại món ăn ...."
                            />
                        </div>
                    </div>
                    <div className={cx("aItem")}>
                        <div className="aPrice">
                            <label htmlFor="price">Giá Tiền:</label>
                            <input
                                onChange={changeHandler}
                                type="number"
                                placeholder="Giá tiền ....."
                                name="price"
                                id="price"
                                value={price}
                                required
                            />
                        </div>
                    </div>
                    <div className={cx("aItem")}>
                        <div className="aAddImage">
                            <label htmlFor="image_detail">Ảnh Minh Hoạ:</label>
                            <div className="custom-file">
                                <input
                                    onChange={handleFileInputChange}
                                    type="file"
                                    id="image_detail"
                                    name="image_detail"
                                    accept="image/png,image/jpeg,image/jpg"
                                    required
                                    className="custom-file-input"
                                />
                                <label id="file-label" className="custom-file-label" htmlFor="image_detail"></label>
                            </div>
                        </div>
                    </div>
                    <button
                        className={cx("submitButton")}
                        onClick={submitHandler}
                    >
                        Tạo Món Ăn
                    </button>
                </div>
            </div>
        </Fragment>
    );
}

export default AddDish;