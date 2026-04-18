export const getBookings = (req, res) => {
    res.status(200).send("Hello from the backend");
}
export const createBooking = (req, res) => {
    res.status(200).json("Booking created successfully");
}

export const updateBooking = (req, res) => {
    res.status(200).json("Booking updated successfully");
}

export const deleteBooking = (req, res) => {
    res.status(200).json("Booking deleted successfully");
}