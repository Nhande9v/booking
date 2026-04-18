export const removeAccents = (str) => {
    if (!str) return "";
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d") // Nên xử lý thêm chữ đ
        .replace(/Đ/g, "D")
        .toLowerCase()
        .trim();
};