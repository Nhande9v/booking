import { createContext, useEffect, useReducer } from "react";

const INITIAL_STATE = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  loading: false,
  error: null,
};
// tạo dữ liệu 
export const AuthContext = createContext(INITIAL_STATE);


// reducer để quản lý trạng thái đăng nhập
const AuthReducer = (state, action) => {
  switch (action.type) {
    // khi bắt đầu login reset user bật loading
    case "LOGIN_START":
      return { user: null, loading: true, error: null };
    // nếu login thành công lưu user vào state và tắt loading
    case "LOGIN_SUCCESS":
      return { user: action.payload, loading: false, error: null };
    // nếu login thất bại reset user và tắt loading, lưu lỗi vào state
    case "LOGIN_FAILURE":
      return { user: null, loading: false, error: action.payload };
    // khi logout reset user và tắt loading
      case "LOGOUT":
      return { user: null, loading: false, error: null };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(state.user));// reload trang sẽ lấy user từ localStorage để giữ trạng thái đăng nhập
  }, [state.user]);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};