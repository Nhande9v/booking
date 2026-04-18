import React from "react";

const NotFound = () => {
    return (
        <div className=" flex flex-col items-center justify-center min-h-screen text-center bg-slate-50 ">
            <img src="/404_NotFound.png" alt="not found" className="w-full max-w-md mb-6 w-96" />
            <p className="text-2xl font-bold text-slate-800">Không tìm thấy trang</p>
            <a href="/" className="inline-block mt-6 px-6 py-3 font-medium text-white transition shadow-md bg-primary rounded-2xl hover:bg-primary-dark">
                Quay lại trang chủ
            </a>
        </div>
        
    )
}

export default NotFound;